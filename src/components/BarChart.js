import React from 'react';
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const colorSchemes = [
  ['#920000', '#DB6D00', '#24FF24', '#924900', '#B6DBFF', '#006DDB', '#6DB6FF', '#B66DFF', '#490092', '#004949', '#FF6DB6', '#009292', '#FFBDDB', '#000000'], // colorblind 'safe'
  ['#000000', '#FFBDDB', '#009292', '#FF6DB6', '#004949', '#490092', '#B66DFF', '#6DB6FF', '#006DDB', '#B6DBFF', '#924900', '#24FF24', '#DB6D00', '#920000'], // colorblind 'safe'
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
