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
          style={{ zIndex: 99 }}
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
        ({ fill: '#e6e6e6', stroke: 'gray', strokeWidth: '0.2px' }) :
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
      dept: nest()
      .key(d => d.user_department),
      people: nest()
      .key(d => d.user_name)
    }

    const colorCodedTypes = this.getColorCodedTypes()
    this.state = {
      // deptDetailShowing: 'Permit Application Center',
      depthShowing: 2,
      deptDetailShowing: 'Stormwater',
    }
    this.state.nestedData = this.getNestedData(props.data);
    this.state.colorCode = this.getColorCode(colorCodedTypes);
    this.state.legendGroups = this.getLegendGroups(colorCodedTypes);
  }

  getNestedData(inputData) {
    return {
      key: 'All Tasks',
      values: this.props.data,
      children: this.nests.dept.entries(this.props.data)
      .sort((a, b) => b.values.length - a.values.length)
      .map(dept => {
        if (dept.key === this.state.deptDetailShowing) {
          dept.children = this.nests.people.entries(dept.values)
          .sort((a, b) => b.values.length - a.values.length)
          dept.children.map(person => {
            person.byType = this.nests.types.entries(person.values)
            // person.uniquePermits = uniquePermitsNest.entries(person.values)
            return person;
          })
          dept.isDeptLevel = true;
        }
        dept.byType = this.nests.types.entries(dept.values)
        // dept.uniquePermits = uniquePermitsNest.entries(dept.values)
        return dept;
      }),
      // uniquePermits: uniquePermitsNest.entries(this.props.data),
      byType: this.nests.types.entries(this.props.data),
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

  componentWillReceiveProps(nextProps) {
    // TODO: less hacky
    if (this.nextProps.data.length !== this.props.data.length
      || this.nextProps.data[0].key !== this.props.data[0].key
    ) {
      const colorCodedTypes = this.getColorCodedTypes(nextProps.data)
      this.setState({
        colorCode: this.getColorCode(colorCodedTypes),
        legendGroups: this.getLegendGroups(colorCodedTypes),
      })
    }
  }

  render() {
    // TODO: PUT NODE LABELS BELOW CIRCLEPACKS, GIVE THEM PLUS/MINUS FUNCTIONALITY
    // TODO: figure out how to get correct size of root
    // DETERMINE SIZE WITH RECURSIVE FUNCTION BASED ON LEVEL?
    const rootSize = 300
    const nodeSizeFunc = scaleLinear()
      .range([2, rootSize])
      .domain([0, this.props.data.length]);

    return (<div className="dashRows">
      <div>
        <svg
          style={{
            position: 'absolute',
            top: '30px',
            left: '0px',
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
            top: 0,
            right: 50,
            bottom: 0,
            left: 0,
          }}
          responsiveWidth
          networkType={{
            type: "tree",
            projection: "horizontal",
            nodePadding: 5,
            hierarchySum: d => d.values.length,
          }}
          edges={this.state.nestedData}
          edgeStyle={{ stroke: 'gray' }}
          nodeIDAccessor="key"
          nodeLabels={d => {
            // console.log(d)
            const width = Math.max(100, d.nodeSize);
            return (<g
            >
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
                {d.key}
              </foreignObject>
            </g>)
          }}
          nodeSizeAccessor={d => {
            return nodeSizeFunc(d.values.length)
          }}
          customNodeIcon={d => { console.log(d); return d.d.depth === this.state.depthShowing ?
            circlePackNode(d, nodeSizeFunc, this.state.colorCode) : null
          }}
        />
      </div>
    </div>);
  }
}

export default Workflow;
