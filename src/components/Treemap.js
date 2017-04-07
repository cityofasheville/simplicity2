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

// http://www.codingforums.com/javascript-programming/11156-convert-hsl-rgb-using-js.html
function hsl2rgb(h, sOrig, lOrig) {
  let m1;
  let m2;
  let hue;
  let r;
  let g;
  let b;
  const s = sOrig / 100;
  const l = lOrig / 100;
  if (s === 0) r = g = b = (l * 255);
  else {
    if (l <= 0.5) m2 = l * (s + 1);
    else m2 = (l + s) - (l * s);
    m1 = (l * 2) - m2;
    hue = h / 360;
    r = HueToRgb(m1, m2, hue + (1 / 3));
    g = HueToRgb(m1, m2, hue);
    b = HueToRgb(m1, m2, hue - (1 / 3));
  }
  return [r, g, b];
}

// http://www.codingforums.com/javascript-programming/11156-convert-hsl-rgb-using-js.html
function HueToRgb(m1, m2, hue) {
  let v;
  let adjustedHue = hue;
  if (adjustedHue < 0) adjustedHue += 1;
  else if (adjustedHue > 1) adjustedHue -= 1;
  if (6 * adjustedHue < 1) v = m1 + ((m2 - m1) * adjustedHue * 6);
  else if (2 * adjustedHue < 1) v = m2;
  else if (3 * adjustedHue < 2) v = m1 + ((m2 - m1) * ((2 / 3) - adjustedHue) * 6);
  else v = m1;

  return Math.ceil(255 * v);
}

const getFill = (delta) => {
  let h = 0;
  let s = 0;
  let l = 100;
  if (delta > 0) {
    h = 0;
    s = 100;
    l = Math.ceil(Math.abs(delta) * 100) > 100 ? 50 : ((100 - (Math.abs(delta) * 100)) + 50) / 2;
  } else if (delta < 0) {
    h = 240;
    s = 100;
    l = Math.ceil(Math.abs(delta) * 100) > 100 ? 50 : ((100 - (Math.abs(delta) * 100)) + 50) / 2;
  }
  const rgbArray = hsl2rgb(h, s, l);
  return ['rgb(', rgbArray[0], ',', rgbArray[1], ',', rgbArray[2], ')'].join('');
};

const CustomTreemap = (props) => {
  const { root, depth, x, y, width, height, index, colors, name, amount, delta, diveDeeper, differenceColors, showingLabels } = props;

  return (
    <g>
      {depth === 1 && <title>{[name, getDollars(amount)].join(' ')}</title>}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          cursor: 'pointer',
          fill: (depth < 2 && differenceColors) ? getFill(delta) : (depth < 2 ? colors[Math.floor(index % root.children.length)] : 'none'), // eslint-disable-line no-nested-ternary
          stroke: '#000',
          strokeWidth: 1 / (depth + 1e-10),
          strokeOpacity: 1 / (depth + 1e-10),
        }}
        onClick={diveDeeper !== undefined ? () => diveDeeper(props) : null}
      />
      {
        depth === 1 && showingLabels ?
          <foreignObject width={width} height={'20px'} x={x + 4} y={y + 2}>
            <span
              style={{ fontWeight: 'bold', fontSize: '14px', wordWrap: 'break-word', color: 'yellow', textShadow: '1px 1px 5px black' }}
            >
              {getDollars(amount)}
            </span>
            <br />
            <span
              style={{ fontWeight: 'bold', fontSize: '14px', wordWrap: 'break-word', color: 'yellow', textShadow: '1px 1px 5px black' }}
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
  showingLabels: React.PropTypes.bool,
};

class Treemap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showingLabels: props.showingLabels,
    };
    this.toggleLabels = this.toggleLabels.bind(this);
  }

  toggleLabels(event) {
    if (event.target.id === 'toggleLabels') {
      this.setState({
        showingLabels: !this.state.showingLabels,
      });
    }
  }

  render() {
    return (
      <div style={{ height: this.props.height }} onClick={this.toggleLabels}>
        <button className="button btn-success pull-right" id="toggleLabels" style={{ border: '0px', borderRadius: '3px' }}>{this.state.showingLabels === true ? 'Hide labels' : 'Show labels'}</button>
        <ResponsiveContainer>
          <RechartsTreemap
            data={this.props.data}
            dataKey="size"
            ratio={4 / 3}
            stroke="#fff"
            fill="#000"
            isAnimationActive={false}
            content={<CustomTreemap {...this.props} showingLabels={this.state.showingLabels} />}
          />
        </ResponsiveContainer>
      </div>
    );
  }
}

Treemap.propTypes = {
  height: React.PropTypes.number,
  data: React.PropTypes.array, // eslint-disable-line react/forbid-prop-types
  showingLabels: React.PropTypes.bool,
};

Treemap.defaultProps = {
  height: 450,
  data: [],
  diveDeeper: undefined,
  differenceColors: false,
  showingLabels: true,
};

export default Treemap;
