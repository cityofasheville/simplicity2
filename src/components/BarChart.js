import React from 'react';
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const colorSchemes = [
  ['#920000', '#924900', '#db6d00', '#24ff24', '#000000', '#ffb6db', '#004949', '#b66dff', '#006ddb', '#ff6db6'], // colorblind 'safe'
  ['#490092', '#006ddb', '#b66dff', '#6db6ff', '#bgdbff', '#ff6db6', '#004949', '#924900', '#920000', '#db6d00'], // colorblind 'safe'
  ['#9C27B0', '#03A9F4', '#FFC107', '#4CAF50', '#E91E63', '#795548', '#9E9E9E'],
  ['#FF5722', '#CDDC39', '#009688', '#FF80AB', '#3F51B5', '#FFEE58', '#37474F'],
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

const BarChart = props => (
  <div style={{ height: props.height }}>
    {renderTitle(props.chartTitle)}
    <ResponsiveContainer>
      <RechartsBarChart data={props.data}>
        <XAxis dataKey={props.xAxisDataKey} />
        <YAxis tickFormatter={props.tickFormatter !== undefined ? props.tickFormatter : null} domain={['dataMin', 'dataMax + 25000000']} />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip formatter={props.dollars ? getDollars : null} />
        <Legend />
        {props.barDataKeys.map((barDataKey, i) => (
          <Bar key={barDataKey} dataKey={barDataKey} fill={getColorScheme(props.colorScheme)[i % getColorScheme(props.colorScheme).length]} stackId={props.stacked ? 1 : i} animationDuration={50} />
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
  tickFormatter: React.PropTypes.func,
  height: React.PropTypes.number,
  stacked: React.PropTypes.bool,
  dollars: React.PropTypes.bool,
  colorScheme: React.PropTypes.number, // eslint-disable-line react/no-unused-prop-types
};

BarChart.defaultProps = {
  data: [],
  barDataKeys: [],
  xAxisDataKey: '',
  tickFormater: null,
  height: 450,
  stacked: false,
  dollars: false,
  colorScheme: 0,
};

export default BarChart;
