import React from 'react';
import { ResponsiveContainer, AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const COLORS = ['#9C27B0', '#03A9F4', '#FFC107', '#b71c1c', '#4CAF50', '#E91E63', '#9E9E9E'];

const getDollars = (value) => {
  if (value > 1000000) {
    return ['$', (value / 1000000).toLocaleString(), ' M'].join('');
  } else if (value > 1000) {
    return ['$', (value / 1000).toLocaleString(), ' k'].join('');
  }
  return ['$', value.toLocaleString()].join('');
};

const AreaChart = props => (
  <div style={{ height: props.height }}>
    <ResponsiveContainer>
      <RechartsAreaChart
        data={props.data.dataValues}
      >
        <XAxis dataKey="year" />
        <YAxis tickFormatter={getDollars} />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip formatter={getDollars} />
        {props.data.dataKeys.map((area, i) => (
          <Area key={['area', i].join('_')} type="monotone" dataKey={props.data.dataKeys[i]} stackId={1} fill={COLORS[i % COLORS.length]} stroke={COLORS[i % COLORS.length]} fillOpacity={1} onClick={props.diveDeeper !== undefined ? () => props.diveDeeper(props.data.dataValues[i]) : null} style={{ cursor: 'pointer' }} />
        ))}
        <Legend />
      </RechartsAreaChart>
    </ResponsiveContainer>
  </div>
);

AreaChart.propTypes = {
  height: React.PropTypes.number,
  data: React.PropTypes.object, // eslint-disable-line react/forbid-prop-types
  diveDeeper: React.PropTypes.func,
};

AreaChart.defaultProps = {
  height: 450,
  data: [],
  diveDeeper: undefined,
};

export default AreaChart;
