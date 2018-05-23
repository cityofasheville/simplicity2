import React from 'react';
import PropTypes from 'prop-types';
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

const getDollarsForTooltips = value => (
  [value < 0 ? '-$' : '$', Math.abs(value).toLocaleString()].join('')
);

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
    h = 240; // 300; // 240; // 0;
    s = 100;
    l = Math.ceil(Math.abs(delta) * 100) > 100 ? 45 : (((100 - (Math.abs(delta) * 100)) * 55) / 100) + 45;
  } else if (delta < 0) {
    h = 36; // 240;
    s = 100;
    l = Math.ceil(Math.abs(delta) * 100) > 100 ? 45 : (((100 - (Math.abs(delta) * 100)) * 55) / 100) + 45;
  }
  const rgbArray = hsl2rgb(h, s, l);
  return ['rgb(', rgbArray[0], ',', rgbArray[1], ',', rgbArray[2], ')'].join('');
};

const getTopLevelOnly = (data) => (
  data.map(item => (Object.assign({}, item, { children: null })))
);

const nameText = (name, x, y, delta, maxLength) => {
  const numChars = name.length;
  const words = name.split(' ');
  const lines = [''];
  let thisLineLength = 0;
  const fill =  delta < 0.5 ? "black" : "white";
  for (let i = 0; i < words.length; i += 1) {
    if (thisLineLength + words[i].length + 1 <= maxLength) {
      lines[lines.length-1] = lines[lines.length-1] + ' ' + words[i];
      thisLineLength += words[i].length + 1;
    } else {
      lines.push(words[i]);
      thisLineLength = words[i].length;
    }
  }
  return (
    <text x={x + 4} y={y + 17} fill={fill} stroke="none" style={{ fontWeight: 'bold' }}>
      {lines.map((word, index) => (<tspan key={[name, 'line', index].join('_')} dy={16} x={x + 4}>{word}</tspan>))}
    </text>
  );
};

const CustomTreemap = (props) => {
  const { root, depth, x, y, width, height, index, colors, name, amount, delta, diveDeeper, differenceColors, showingLabels } = props;

  if (depth === 1) {
    const myD = ['M ', x, ' ', y, ' h ', width, ' v ', height, ' h -', width, ' Z'].join('');
    return (
      <g>
        <title>{[name, getDollarsForTooltips(amount)].join(' ')}</title>
        <path className="recharts-rectangle" d={myD} onClick={diveDeeper !== undefined && depth === 1 ? () => diveDeeper(props) : null}
          style={{
            cursor: 'pointer',
            fill: differenceColors ? getFill(delta) : COLORS[Math.floor(index % root.children.length)],
            stroke: '#000',
          }} />
        { showingLabels && (width * height > 500) && (width > 75 && height > 40) ?
          <text x={x + 4} y={y + 16} fill={delta < 0.5 ? "black" : "white"} stroke="none" style={{ fontWeight: 'bold' }}>
            {getDollars(amount)}
          </text>
        : null
        }
        { showingLabels && (width * height > 500) && (width > 75 && height > 40) ?
          nameText(name, x, y, delta, parseInt(width / 8))
        : null
        }
      </g>
    );
  }
  return null;
};

CustomTreemap.propTypes = {
  root: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  depth: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  index: PropTypes.number,
  colors: PropTypes.arrayOf(PropTypes.string),
  name: PropTypes.string,
  amount: PropTypes.number,
  diveDeeper: PropTypes.func,
  showingLabels: PropTypes.bool,
};

class Treemap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showingLabels: props.showingLabels,
    };
    this.toggleLabels = this.toggleLabels.bind(this);
    this.altText = props.altText;
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
      <div style={{ height: this.props.height }} onClick={this.toggleLabels} alt={this.altText}>
        <ResponsiveContainer>
          <RechartsTreemap
            data={getTopLevelOnly(this.props.data)}
            dataKey="size"
            stroke="#fff"
            fill="#000"
            isAnimationActive={false}
            animationDuration={200}
            content={<CustomTreemap {...this.props} showingLabels={this.state.showingLabels} />}
          />
        </ResponsiveContainer>
        <button className="btn btn-primary btn-xs pull-right" style={{ marginTop: '3px' }} id="toggleLabels">{this.state.showingLabels === true ? 'Hide labels' : 'Show labels'}</button>
      </div>
    );
  }
}

Treemap.propTypes = {
  height: PropTypes.number,
  data: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  showingLabels: PropTypes.bool,
  differenceColors: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
  diveDeeper: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
  altText: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
};

Treemap.defaultProps = {
  height: 450,
  data: [],
  diveDeeper: undefined,
  differenceColors: false,
  showingLabels: true,
  altText: 'Treemap',
};

export default Treemap;
