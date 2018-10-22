import React from 'react';
import PropTypes from 'prop-types';
import { timeDay, timeMonday, timeMonth } from 'd3-time';
import { nest } from 'd3-collection';
import { scaleLinear } from 'd3-scale';
import { ResponsiveNetworkFrame } from 'semiotic';


class Workflow extends React.Component {
  constructor() {
    super();
    this.state = {
      deptDetailShowing: 'Permit Application Center',
    }
  }

  render() {
    const uniquePermitsNest = nest()
    .key(d => d.permit_number);

    const typeNest = nest()
    .key(d => d.permit_group)
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
    const rootSize = 200
    const nodeSizeFunc = scaleLinear()
    .range([2, rootSize])
    .domain([0, this.props.data.length]);


    // TODO: PUT NODE LABELS BELOW CIRCLEPACKS, GIVE THEM PLUS/MINUS FUNCTIONALITY

    return (<div className="dashRows">
      <div>
        <ResponsiveNetworkFrame
          size={[900, 800]}
          responsiveWidth
          edges={nestedWithRoot}
          edgeStyle={{ stroke: 'gray' }}
          nodeIDAccessor="key"
          nodeLabels
          nodeSizeAccessor={d => {
            return nodeSizeFunc(d.values.length)
          }}
          customNodeIcon={d => {
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
                  key={d.key}
                  size={[size, size]}
                  edges={{ key: 'root', values: d.d.data.byType }}
                  nodeStyle={node => node.key === 'root' ?
                    ({ fill: '#e6e6e6' }) :
                    ({ fill: 'gray', fillOpacity: 0.5 })
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
          }}
          networkType={{
            type: "tree",
            projection: "vertical",
            nodePadding: 5,
            hierarchySum: d => d.values.length,
          }}
          margin={5}
        />
      </div>
    </div>);
  }
}

export default Workflow;
