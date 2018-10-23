import React from 'react';
import PropTypes from 'prop-types';
import { timeDay, timeMonday, timeMonth } from 'd3-time';
import { nest } from 'd3-collection';
import { scaleLinear } from 'd3-scale';
import { ResponsiveNetworkFrame, Legend } from 'semiotic';
import { colorScheme } from '../volume/granularUtils';
import Tooltip from '../../../shared/visualization/Tooltip';


const circlePackNode = (d, nodeSizeFunc, colorCode) => {
  const size = nodeSizeFunc(d.d.values.length)
  return (
    <foreignObject
      key={d.key}
      x={d.d.x - size / 2}
      y={d.d.y - size / 2}
      width={size}
      height={size}
    >
    <ResponsiveNetworkFrame
      hoverAnnotation
      tooltipContent={datum => {
        if (datum.key === 'root') {
          return null;
        }
        return (<Tooltip
          style={{ zIndex: 1000 }}
          title={d.key}
          textLines={[{
            text: `${datum.key}: ${datum.data.value}`
          }]}
        />);
      }}
      key={d.key}
      size={[size, size]}
      edges={{ key: 'root', values: d.d.data.byType }}
      nodeStyle={node => node.key === 'root' ?
        ({ fill: '#e6e6e6', stroke: 'none' }) :
        ({ fill: colorCode[node.key] })
      }
      nodeIDAccessor="key"
      hoverAnnotation
      networkType={{
        type: 'circlepack',
        hierarchyChildren: datum => datum.values,
        hierarchySum: datum => datum.value,
      }}
    />
  </foreignObject>
)
}

function nodesAtDepth(inputNode, activeDepth, parentNodeKeyShowing) {
  const node = Object.assign({}, inputNode);
  if (node.depth === activeDepth) {
    if (activeDepth === 0) {
      return [node];
    }
    return node;
  }
  if (!node.children) {
    return [];
  }
  return [].concat(...node.children
    .map(v => nodesAtDepth(v, activeDepth))
  );
}

class Workflow extends React.Component {
  constructor(props) {
    super(props);

    this.nests = {
      // uniquePermits: nest()
      //   .key(d => d.permit_number),
      types: nest()
        // TODO: USER RESEARCH TO FIND OUT IF THIS IS BEST WAY TO BREAK DOWN
        // .key(d => d.permit_group)
        .key(d => d.permit_type)
        // .key(d => d.permit_subtype)
        // .key(d => d.permit_category)
        .rollup(d => d.length),
      department: nest().key(d => d.user_department),
      people: nest().key(d => d.user_name),
    };

    const colorCodedTypes = this.getColorCodedTypes();
    this.state = {
      parentNodeKeyShowing: 'Permit Application Center',
      activeDepth: 2,
      // parentNodeKeyShowing: 'Stormwater',
    };
    this.state.nestedData = this.getNestedData(props.data);
    this.state.colorCode = this.getColorCode(colorCodedTypes);
    this.state.legendGroups = this.getLegendGroups(colorCodedTypes);
    this.handleCollapsedNodeClick = this.handleCollapsedNodeClick.bind(this)
  }

  getNestedData(inputData) {
    return {
      key: 'All Tasks',
      values: inputData,
      depth: 0,
      children: this.nests.department.entries(inputData)
        .sort((a, b) => b.values.length - a.values.length)
        .map(department => {
          // if (department.key === this.state.parentNodeKeyShowing) {
            department.children = this.nests.people.entries(department.values)
              .sort((a, b) => b.values.length - a.values.length)
            department.children.map(person => {
              person.byType = this.nests.types.entries(person.values)
              person.depth = 2;
              // person.uniquePermits = uniquePermitsNest.entries(person.values)
              return person;
            })
          // }
          department.depth = 1;
          department.byType = this.nests.types.entries(department.values)
          // department.uniquePermits = uniquePermitsNest.entries(department.values)
          return department;
      }),
      // uniquePermits: uniquePermitsNest.entries(inputData),
      byType: this.nests.types.entries(inputData),
    }
  }

  getColorCodedTypes() {
    return this.nests.types.entries(this.props.data)
      .sort((a, b) => b.value - a.value)
      .map((d, i) => {
        const rObj = Object.assign({}, d);
        const othered = i >= colorScheme.length - 1
        if (othered) {
          rObj.color = colorScheme[colorScheme.length - 1];
          rObj.label = 'Other';
        } else {
          rObj.color = colorScheme[i];
          rObj.label = rObj.key;
        }
        return rObj;
      })
  }

  getColorCode(colorCodedTypes) {
    return colorCodedTypes.reduce(function(obj, item){
      obj[item.key] = item.color;
      return obj;
    }, {});
  }

  getLegendGroups(colorCodedTypes) {
    return [{
      styleFn: d => ({ fill: d.color, stroke: 'none' }),
      items: colorCodedTypes.filter((d, i) =>
      i <= colorScheme.length - 1),
    }]
  }

  getSizeFunc(filteredData) {
    // TODO: figure out how to get correct size of root
    // DETERMINE SIZE WITH RECURSIVE FUNCTION BASED ON LEVEL?
    const largestNode = nodesAtDepth(
      filteredData,
      this.state.activeDepth,
      this.state.parentNodeKeyShowing,
    )
      .sort((a, b) => b.values.length - a.values.length)[0].values.length
    const maxSize = 100
    return scaleLinear()
      .range([2, maxSize])
      .domain([0, largestNode]);
  }

  componentWillReceiveProps(nextProps) {
    // TODO: less hacky
    if (this.nextProps.data[0].permit_number !== this.props.data[0].permit_number
      || this.nextProps.data[0].current_status_date !== this.props.data[0].current_status_date
    ) {
      const colorCodedTypes = this.getColorCodedTypes(nextProps.data)
      this.setState({
        colorCode: this.getColorCode(colorCodedTypes),
        legendGroups: this.getLegendGroups(colorCodedTypes),
      })
    }
  }

  handleCollapsedNodeClick(d) {
    // if depth and key match state.activeDepth and state.parentNodeKeyShowing, toggle closed
    if (d.d.depth === this.state.activeDepth && d.d.key === this.state.parentNodeKeyShowing) {
      this.setState({
        activeDepth: Math.max(this.state.activeDepth - 1, 0),
        parentNodeKeyShowing: null,
      })
    } else {
      this.setState({
        nestedData: this.getNestedData(this.props.data),
        activeDepth: d.d.depth + 1,
        parentNodeKeyShowing: d.d.key,
      })
    }
  }

  filterData(inputNode) {
    const node = Object.assign({}, inputNode);
    if (!node.children) {
      return node;
    }
    if ((node.depth + 1 === this.state.activeDepth && node.key !== this.state.parentNodeKeyShowing)
      || (this.state.activeDepth === node.depth)
    ) {
      node.children = null;
    } else {
      node.children = node.children.map(v => this.filterData(v));
    }
    return node;
  }

  render() {
    // TODO: PUT NODE LABELS BELOW CIRCLEPACKS, GIVE THEM PLUS/MINUS FUNCTIONALITY
    // DO THIS INSTEAD OF HAVING PLUS MINUS ON NODES-- BECAUSE WHEN ACTIVE DEPTH 1, STILL NEED TO ACCESS LOWER NODES
    const filteredData = this.filterData(this.state.nestedData)
    const nodeSizeFunc = this.getSizeFunc(filteredData)

    return (<div className="dashRows">
      <div>
        <svg
          style={{
            position: 'absolute',
            top: '100px',
            left: '25px',
            height: `${this.state.legendGroups[0].items.length * 16 + 16}px`,
            overflow: 'visible'
          }}
        >
          <Legend
            title="Permit Type"
            legendGroups={this.state.legendGroups}
          />
        </svg>
        <ResponsiveNetworkFrame
          size={[900, 900]}
          margin={{
            top: 10,
            right: 40,
            bottom: 10,
            left: 5,
          }}
          responsiveWidth
          networkType={{
            type: "tree",
            projection: "horizontal",
            hierarchySum: d => d.values.length,
            separation: ((a, b) => {
              if (a.depth !== this.state.activeDepth) {
                // If it's not a circlepack, evenly space them
                return 15;
              }
              const basicSeparation = Math.max(nodeSizeFunc(a.value)/3, nodeSizeFunc(b.value)/3) + 10;
              return basicSeparation;
            }),
          }}
          edges={filteredData}
          edgeStyle={{ stroke: 'gray', fill: 'gray', opacity: 0.5 }}
          nodeIDAccessor="key"
          nodeLabels={d => {
            const width = Math.max(200, d.nodeSize);
            return (<g>
              <foreignObject
                style={{
                  x: - width / 2,
                  y: -d.nodeSize / 2 - 25,
                  width: width,
                  height: 25,
                  fontSize: '0.75em',
                  textAlign: 'center',
                }}
              >
                {`${d.key}: ${d.value}`}
              </foreignObject>
            </g>)
          }}
          nodeSizeAccessor={d => {
            return d.depth === this.state.activeDepth && d.parent.key === this.state.parentNodeKeyShowing ?
              nodeSizeFunc(d.values.length) : 10;
          }}
          customNodeIcon={d => {
            if (d.d.depth === 0) {
              return null;
            } else if (d.d.depth === this.state.activeDepth && d.d.parent.key === this.state.parentNodeKeyShowing) {
              return circlePackNode(d, nodeSizeFunc, this.state.colorCode);
            }
            return (
              <g
                key={d.d.key}
                style={{
                  transform: `translate(${d.d.x}px, ${d.d.y}px)`
                }}
                className="toggleAbleNode"
                onClick={() => this.handleCollapsedNodeClick(d)}
              >
                <circle
                  r={d.d.nodeSize}
                >
                </circle>
                <text
                  dy={`${d.d.nodeSize / 2}px`}
                  textAnchor="middle"
                  style={{ alignmentBaseline: 'baseline' }}
                >
                  {d.d.key === this.state.parentNodeKeyShowing ? '-' : '+'}
                </text>
              </g>
            )
          }}
        />
      </div>
    </div>);
  }
}

export default Workflow;
