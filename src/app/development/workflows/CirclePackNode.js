import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveNetworkFrame } from 'semiotic';


const CirclePackNode = ({ d, nodeSizeFunc, colorCode }) => {
  const size = nodeSizeFunc(d.d.values.length)
  return (
    <foreignObject
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
  </foreignObject>)
}

export default CirclePackNode;
