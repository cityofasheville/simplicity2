import React from 'react';
import { ResponsiveContainer, Treemap as RechartsTreemap } from 'recharts';

const COLORS = ['#9C27B0', '#03A9F4', '#FFC107', '#b71c1c', '#4CAF50', '#E91E63', '#9E9E9E'];
const differenceCOLORS = ['#660000', '#006600'];

const getDollars = (value) => {
  if (value > 1000000) {
    return ['$', (value / 1000000).toLocaleString(), ' M'].join('');
  } else if (value > 1000) {
    return ['$', (value / 1000).toLocaleString(), ' k'].join('');
  }
  return ['$', value.toLocaleString()].join('');
};

const toHex = value => (
  value.toString(16).length === 1 ? ['0', value.toString(16)].join('') : value.toString(16)
);

const getFill = (delta) => {
  const fillBase = delta > 0 ? differenceCOLORS[0] : differenceCOLORS[1];
  const r = delta >= 0 ? Math.ceil(parseInt(fillBase.substring(1, 3), 16) * Math.abs(delta * 2.55)) : fillBase.substring(1, 3);
  const g = delta < 0 ? Math.ceil(parseInt(fillBase.substring(3, 5), 16) * Math.abs(delta * 2.55)) : fillBase.substring(3, 5);
  const b = fillBase.substring(5, 7);
  return ['#', delta > 0 ? toHex(r > 255 ? 255 : r) : r, delta < 0 ? toHex(g > 255 ? 255 : g) : g, b].join('');
};

const CustomTreemap = (props) => {
  const { root, depth, x, y, width, height, index, colors, name, amount, delta, diveDeeper, differenceColors } = props;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          cursor: 'pointer',
          fill: (depth < 2 && differenceColors) ? getFill(delta) : (depth < 2 ? colors[Math.floor(index % root.children.length)] : 'none'), // eslint-disable-line no-nested-ternary
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
        fill="#000"
        isAnimationActive={false}
        content={<CustomTreemap colors={COLORS} diveDeeper={props.diveDeeper} differenceColors={props.differenceColors} />}
      />
    </ResponsiveContainer>
  </div>
);

Treemap.propTypes = {
  height: React.PropTypes.number,
  data: React.PropTypes.array, // eslint-disable-line react/forbid-prop-types
  diveDeeper: React.PropTypes.func,
  differenceColors: React.PropTypes.bool,
};

Treemap.defaultProps = {
  height: 450,
  data: [],
  diveDeeper: undefined,
  differenceColors: false,
};

export default Treemap;
