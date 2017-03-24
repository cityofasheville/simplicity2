import React from 'react';
import { ResponsiveContainer, Treemap as RechartsTreemap } from 'recharts';

const COLORS = ['#9C27B0', '#03A9F4', '#FFC107', '#b71c1c', '#4CAF50', '#E91E63', '#9E9E9E'];

const CustomTreemap = (props) => {
  const { root, depth, x, y, width, height, index, colors, name, amount, diveDeeper } = props;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          cursor: 'pointer',
          fill: depth < 2 ? colors[Math.floor((index / root.children.length) * 6)] : 'none',
          stroke: '#fff',
          strokeWidth: 2 / (depth + 1e-10),
          strokeOpacity: 1 / (depth + 1e-10),
        }}
        onClick={diveDeeper !== undefined ? () => diveDeeper(props) : null}
      />
      {
        depth === 1 ?
          <foreignObject width={width} height={'20px'} x={x + 4} y={y + 2}>
            <span
              style={{ fontWeight: 'bold', wordWrap: 'break-word', color: '#fff' }}
              title={[name, amount, 'Click to see more details'].join(' ')}
            >
              {amount}
            </span>
            <br />
            <span
              style={{ fontWeight: 'bold', wordWrap: 'break-word', color: '#fff' }}
            >
              {name}
            </span>
          </foreignObject>
        : null
      }
    </g>
  );
};

CustomTreemap.propTypes = {
  root: React.PropTypes.object, // eslint-disable-line react/forbid-prop-types
  depth: React.PropTypes.number,
  x: React.PropTypes.number,
  y: React.PropTypes.number,
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  index: React.PropTypes.number,
  colors: React.PropTypes.arrayOf(React.PropTypes.string),
  name: React.PropTypes.string,
  amount: React.PropTypes.string,
  diveDeeper: React.PropTypes.func,
};

const Treemap = props => (
  <div style={{ height: '450px' }}>
    <ResponsiveContainer>
      <RechartsTreemap
        width={900}
        height={450}
        data={props.data}
        dataKey="size"
        ratio={4 / 3}
        stroke="#fff"
        fill="#8884d8"
        content={<CustomTreemap colors={COLORS} diveDeeper={props.diveDeeper} />}
      />
    </ResponsiveContainer>
  </div>
);

Treemap.propTypes = {
  data: React.PropTypes.array, // eslint-disable-line react/forbid-prop-types
  diveDeeper: React.PropTypes.func,
};

export default Treemap;
