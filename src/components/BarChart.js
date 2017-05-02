import React from 'react';
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceArea } from 'recharts';

const colorSchemes = [
  ['#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b'], // color brewer single hue blue - single hue green
  ['#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b'], // color brewer single hue blue - single hue green
  ['#920000', '#DB6D00', '#24FF24', '#924900', '#B6DBFF', '#006DDB', '#6DB6FF', '#B66DFF', '#490092', '#004949', '#FF6DB6', '#009292', '#FFBDDB', '#000000'], // colorblind 'safe'
  ['#000000', '#FFBDDB', '#009292', '#FF6DB6', '#004949', '#490092', '#B66DFF', '#6DB6FF', '#006DDB', '#B6DBFF', '#924900', '#24FF24', '#DB6D00', '#920000'], // colorblind 'safe'
  ['#004987', '#4077a5', '#a6bfd5', '#aaad00', '#bfc240', '#e1e2a6'], // city of asheville branding colors, colorblind 'safe'
];

const referenceColorScheme = [
  '#fff7ec', '#fee8c8', '#fdd49e',
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
  <g className="recharts-reference-area-label"><text stroke="none" fill="black" x="0" y="20" className="recharts-text" textAnchor="middle"><tspan x={labelProps.x} dy="0em">{labelProps.text}</tspan></text></g>
);

const BarChart = props => (
  <div style={{ height: props.height }}>
    {renderTitle(props.chartTitle)}
    <ResponsiveContainer>
      <RechartsBarChart data={props.data}>
        <XAxis dataKey={props.xAxisDataKey} tickFormatter={props.xTickFormatter !== undefined ? props.xTickFormatter : null} />
        <YAxis tickFormatter={props.yTickFormatter !== undefined ? props.yTickFormatter : null} domain={['dataMin', 'dataMax + 25000000']} />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip formatter={props.dollars ? getDollars : null} />
        <Legend />
        {props.barDataKeys.map((barDataKey, i) => (
          <Bar key={barDataKey} dataKey={barDataKey} fill={getColorScheme(props.colorScheme)[i % getColorScheme(props.colorScheme).length]} stackId={props.stacked ? 1 : i} animationDuration={50} />
        ))}
        {props.referenceArea &&
          <XAxis type="number" xAxisId={1} domain={[0, 1000]} dataKey={props.xAxisDataKey2} hide />
        }
        {props.referenceArea && props.referenceAreaLabels.map((text, i) => (
          <ReferenceArea key={['referenceArea', i].join('_')} xAxisId={1} x1={i === 0 ? 0 : props.referenceAreaExes[i - 1]} x2={props.referenceAreaExes[i] || ((i * 250) - 250)} stroke="black" fill={referenceColorScheme[i % referenceColorScheme.length]} strokeOpacity={0.3} label={<CustomizedLabel text={text} />} />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  </div>
);

BarChart.propTypes = {
  chartTitle: React.PropTypes.string,
  data: React.PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  barDataKeys: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  xAxisDataKey: React.PropTypes.string.isRequired,
  xReferenceAxisDataKey: React.PropTypes.string,
  yTickFormatter: React.PropTypes.func,
  xTickFormatter: React.PropTypes.func,
  height: React.PropTypes.number,
  stacked: React.PropTypes.bool,
  dollars: React.PropTypes.bool,
  colorScheme: React.PropTypes.number, // eslint-disable-line react/no-unused-prop-types
  referenceArea: React.PropTypes.bool,
  referenceLabels: React.PropTypes.arrayOf(React.PropTypes.string),
  referenceAreaExes: React.PropTypes.arrayOf(React.PropTypes.number),
};

BarChart.defaultProps = {
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
  referenceLabels: [],
  referenceAreaExes: [],
};

export default BarChart;
