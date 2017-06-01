import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceArea } from 'recharts';

const colorSchemes = [
  ['#8e0152', '#b8e186', '#c51b7d', '#4d9221', '#de77ae', '#7fbc41', '#f1b6da', '#e6f5d0', '#fde0ef', '#276419', '#f7f7f7'], // color brewer diverging 11 pink-green
  ['#40004b', '#a6dba0', '#762a83', '#1b7837', '#9970ab', '#5aae61', '#c2a5cf', '#d9f0d3', '#e7d4e8', '#00441b', '#f7f7f7'], // color brewer diverging 11 purple-green
  ['#543005', '#c7eae5', '#8c510a', '#80cdc1', '#bf812d', '#35978f', '#dfc27d', '#01665e', '#f6e8c3', '#003c30', '#f5f5f5'], // color brewer diverging 11 brown-blue
  ['#67001f', '#d1e5f0', '#b2182b', '#92c5de', '#d6604d', '#4393c3', '#f4a582', '#2166ac', '#fddbc7', '#053061', '#f7f7f7'], // color brewer diverging 11 red-blue
  ['#7f3b08', '#d8daeb', '#b35806', '#b2abd2', '#e08214', '#8073ac', '#fdb863', '#542788', '#fee0b6', '#2d004b', '#f7f7f7'], // color brewer diverging 11 orange-purple
  ['#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b'], // color brewer single hue blue - single hue green
  ['#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b'], // color brewer single hue blue - single hue green
  ['#920000', '#DB6D00', '#24FF24', '#924900', '#B6DBFF', '#006DDB', '#6DB6FF', '#B66DFF', '#490092', '#004949', '#FF6DB6', '#009292', '#FFBDDB', '#000000'], // bright colors 1 colorblind 'safe'
  ['#000000', '#FFBDDB', '#009292', '#FF6DB6', '#004949', '#490092', '#B66DFF', '#6DB6FF', '#006DDB', '#B6DBFF', '#924900', '#24FF24', '#DB6D00', '#920000'], // bright colors 2 colorblind 'safe'
  ['#004987', '#4077a5', '#a6bfd5', '#aaad00', '#bfc240', '#e1e2a6'], // city of asheville branding colors, colorblind 'safe'
  ['#9EACE1', '#4292C6', '#08519C', '#fc9272', '#ef3b2c', '#a50f15'], // three blue, three red, colorblind 'safe'
];

const referenceColorScheme = [
  '#fcfcfc', '#f0f0f0', '#d9d9d9',
];

const getDollars = value => (
  [value < 0 ? '-$' : '$', Math.abs(value).toLocaleString()].join('')
);

const getColorScheme = index => (
  index < colorSchemes.length && index >= 0 ? colorSchemes[index] : colorSchemes[0]
);

const renderTitle = (title) => {
  if (title === undefined) {
    return '';
  }
  return (<h3>{title}</h3>);
};

const CustomizedLabel = labelProps => (
  <g className="recharts-reference-area-label">{labelProps.text.map((text, i) => <text key={['labelText', i].join('_')} stroke="none" fill="black" x="0" y={20 * (i + 1)} className="recharts-text" textAnchor="middle"><tspan x={labelProps.x} dy="0em">{text}</tspan></text>)}</g>
);

const BarChart = props => (
  <div style={{ height: props.height }} alt={props.altText}>
    {renderTitle(props.chartTitle)}
    <ResponsiveContainer>
      <RechartsBarChart data={props.data}>
        <XAxis dataKey={props.xAxisDataKey} tickFormatter={props.xTickFormatter !== undefined ? props.xTickFormatter : null} />
        <YAxis tickFormatter={props.yTickFormatter !== undefined ? props.yTickFormatter : null} domain={props.domain} />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip formatter={props.dollars ? getDollars : null} />
        <Legend />
        {props.barDataKeys.map((barDataKey, i) => (
          <Bar key={barDataKey} dataKey={barDataKey} fill={getColorScheme(props.colorScheme)[i % getColorScheme(props.colorScheme).length]} stackId={props.stacked ? 1 : i} animationDuration={50} />
        ))}
        {props.referenceArea &&
          <XAxis type="number" xAxisId={1} domain={[0, 1000]} dataKey={props.xReferenceAxisDataKey} hide />
        }
        {props.referenceArea && props.referenceAreaLabels.map((text, i) => (
          <ReferenceArea key={['referenceArea', i].join('_')} xAxisId={1} x1={i === 0 ? 0 : props.referenceAreaExes[i - 1]} x2={props.referenceAreaExes[i] || ((i * 250) - 250)} stroke="black" fill={referenceColorScheme[i % referenceColorScheme.length]} strokeOpacity={0.3} label={<CustomizedLabel text={text} />} />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  </div>
);

BarChart.propTypes = {
  chartTitle: PropTypes.string,
  altText: PropTypes.string,
  data: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  barDataKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
  xAxisDataKey: PropTypes.string.isRequired,
  xReferenceAxisDataKey: PropTypes.string,
  yTickFormatter: PropTypes.func,
  xTickFormatter: PropTypes.func,
  height: PropTypes.number,
  stacked: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
  dollars: PropTypes.bool,
  colorScheme: PropTypes.number, // eslint-disable-line react/no-unused-prop-types
  referenceArea: PropTypes.bool,
  referenceAreaLabels: PropTypes.arrayOf(PropTypes.array),
  referenceAreaExes: PropTypes.arrayOf(PropTypes.number),
  domain: PropTypes.array, //eslint-disable-line
};

BarChart.defaultProps = {
  altText: 'Bar chart',
  data: [],
  barDataKeys: [],
  xReferenceAxisDataKey: '',
  xAxisDataKey2: '',
  yTickFormater: null,
  xTickFormater: null,
  height: 450,
  stacked: false,
  dollars: false,
  colorScheme: 0,
  referenceArea: false,
  referenceAreaLabels: [],
  referenceAreaExes: [],
  domain: [0, 'auto'],
};

export default BarChart;
