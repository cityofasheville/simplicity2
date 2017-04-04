import React from 'react';
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const barColors = ['#9C27B0', '#03A9F4', '#FFC107', '#4CAF50', '#E91E63', '#795548', '#9E9E9E'];

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
        <YAxis tickFormatter={props.tickFormatter !== undefined ? props.tickFormatter : null} />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        {props.barDataKeys.map((barDataKey, i) => (
          <Bar key={barDataKey} dataKey={barDataKey} fill={barColors[i % barColors.length]} stackId={props.stacked ? 1 : i} />
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
  tickFormatter: React.PropTypes.string,
  height: React.PropTypes.number,
  stacked: React.PropTypes.bool,
};

BarChart.defaultProps = {
  data: [],
  barDataKeys: [],
  xAxisDataKey: '',
  tickFormater: null,
  height: 450,
  stacked: false,
};

export default BarChart;
