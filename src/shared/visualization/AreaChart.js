import React from 'react';
import PropTypes from 'prop-types';
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

const renderLegend = payload => (
  <ul style={{ listStyle: 'none' }}>
    {
      payload.map((entry, index) => (
        <li key={['legend', entry[index], index].join('_')} style={{ display: 'inline', marginRight: '10px' }}><div style={{ backgroundColor: COLORS[index % COLORS.length], width: '10px', height: '10px', display: 'inline-block', marginRight: '2px' }}></div>{entry}</li>
      ))
    }
  </ul>
);

const AreaChart = props => (
  <div style={{ height: props.height }}>
    <ResponsiveContainer>
      <RechartsAreaChart
        data={props.data}
      >
        <XAxis dataKey={props.xAxisDataKey} />
        <YAxis tickFormatter={props.dollars ? getDollars : null} />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip formatter={props.dollars ? getDollars : null} />
        {props.dataKeys.map((area, i) => (
          <Area key={['area', i].join('_')} type="monotone" dataKey={props.dataKeys[i]} stackId={1} fill={COLORS[i % COLORS.length]} stroke={COLORS[i % COLORS.length]} fillOpacity={1} onClick={props.diveDeeper !== undefined ? () => props.diveDeeper(props.dataKeys[i]) : null} style={{ cursor: 'pointer' }} />
        ))}
        <Legend verticalAlign="bottom" content={renderLegend(props.dataKeys)} />
      </RechartsAreaChart>
    </ResponsiveContainer>
  </div>
);

AreaChart.propTypes = {
  height: PropTypes.number,
  data: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  dataKeys: PropTypes.arrayOf(PropTypes.string),
  diveDeeper: PropTypes.func,
  dollars: PropTypes.bool,
  xAxisDataKey: PropTypes.string,
};

AreaChart.defaultProps = {
  height: 450,
  data: [],
  dataKeys: [],
  diveDeeper: undefined,
  dollars: false,
  xAxisDataKey: 'year',
};

export default AreaChart;
