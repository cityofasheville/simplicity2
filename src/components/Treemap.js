import React from 'react';
import { ResponsiveContainer, Treemap as RechartsTreemap } from 'recharts';

const COLORS = ['#9C27B0', '#03A9F4', '#FFC107', '#b71c1c', '#4CAF50', '#E91E63', '#9E9E9E'];

const getDollars = (value) => {
  if (value > 1000000) {
    return ['$', (value / 1000000).toLocaleString(), ' M'].join('');
  } else if (value > 1000) {
    return ['$', (value / 1000).toLocaleString(), ' k'].join('');
  }
  return ['$', value.toLocaleString()].join('');
};

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
              title={[name, getDollars(amount), 'Click to see more details'].join(' ')}
            >
              {getDollars(amount)}
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
  amount: React.PropTypes.number,
  diveDeeper: React.PropTypes.func,
};

const Treemap = props => (
  <div style={{ height: props.height }}>
    <ResponsiveContainer>
      <RechartsTreemap
        data={props.data}
        dataKey="size"
        ratio={4 / 3}
        stroke="#fff"
        fill="#8884d8"
        isAnimationActive={false}
        content={<CustomTreemap colors={COLORS} diveDeeper={props.diveDeeper} />}
      />
    </ResponsiveContainer>
  </div>
);

Treemap.propTypes = {
  height: React.PropTypes.number,
  data: React.PropTypes.array, // eslint-disable-line react/forbid-prop-types
  diveDeeper: React.PropTypes.func,
};

Treemap.defaultProps = {
  height: 450,
  data: [],
  diveDeeper: undefined,
};

export default Treemap;
