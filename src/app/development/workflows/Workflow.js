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
  constructor() {
    super();
    this.state = {
      // deptDetailShowing: 'Permit Application Center',
      depthShowing: 3,
      deptDetailShowing: 'Stormwater',
    }
  }

  render() {
    const uniquePermitsNest = nest()
    .key(d => d.permit_number);

    const typeNest = nest()
      // TODO: USER RESEARCH TO FIND OUT IF THIS IS BEST WAY TO BREAK DOWN
      // .key(d => d.permit_group)
      .key(d => d.permit_type)
      // .key(d => d.permit_subtype)
      // .key(d => d.permit_category)
      .rollup(d => d.length)

    const deptNest = nest()
      .key(d => d.user_department)

    const personNest = nest()
      .key(d => d.user_name)

    const nestedData = deptNest
      .entries(this.props.data)
      .sort((a, b) => b.values.length - a.values.length)
      .map(dept => {
        if (dept.key === this.state.deptDetailShowing) {
          dept.children = personNest.entries(dept.values)
            .sort((a, b) => b.values.length - a.values.length)
          dept.children.map(person => {
            person.byType = typeNest.entries(person.values)
            // person.uniquePermits = uniquePermitsNest.entries(person.values)
            return person;
          })
          dept.isDeptLevel = true;
        }
        dept.byType = typeNest.entries(dept.values)
        // dept.uniquePermits = uniquePermitsNest.entries(dept.values)
        return dept;
      })

    const nestedWithRoot = {
      key: 'All Tasks',
      values: this.props.data,
      children: nestedData,
      // uniquePermits: uniquePermitsNest.entries(this.props.data),
      byType: typeNest.entries(this.props.data),
    }

    // TODO: figure out how to get correct size of root
    const rootSize = 300
    const nodeSizeFunc = scaleLinear()
      .range([2, rootSize])
      .domain([0, this.props.data.length]);

    // TODO: PUT NODE LABELS BELOW CIRCLEPACKS, GIVE THEM PLUS/MINUS FUNCTIONALITY
    const colorCoded = typeNest.entries(this.props.data)
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

    const colorCode = colorCoded.reduce(function(obj, item){
      obj[item.key] = item.color;
      return obj;
    }, {});

    // Dedupe "other" categories
    const legendGroups = [{
      styleFn: d => ({ fill: d.color, stroke: 'none' }),
      items: colorCoded.filter((d, i) =>
        i <= colorScheme.length - 1),
    }]

    return (<div className="dashRows">
      <div>
        <svg
          style={{
            position: 'absolute',
            top: '30px',
            left: '0px',
            height: `${legendGroups[0].items.length * 16 + 16}px`,
            overflow: 'visible'
          }}
        >
          <Legend
            title="Permit Type"
            legendGroups={legendGroups}
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
          edges={nestedWithRoot}
          edgeStyle={{ stroke: 'gray' }}
          nodeIDAccessor="key"
          nodeLabels={d => {
            console.log(d)
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
          customNodeIcon={d => circlePackNode(d, nodeSizeFunc, colorCode)}
        />
      </div>
    </div>);
  }
}

export default Workflow;
