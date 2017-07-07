import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { colorSchemes } from './colorSchemes';

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
        data={props.data}
      >
        <XAxis dataKey={props.mainAxisDataKey} />
        <YAxis tickFormatter={props.dollars ? getDollars : null} />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip formatter={props.dollars ? getDollars : null} />
        {props.dataKeys.map((area, i) => (
          <Area key={['area', i].join('_')} type="monotone" dataKey={props.dataKeys[i]} stackId={1} fill={colorSchemes[props.colorScheme][i % colorSchemes[props.colorScheme].length]} stroke={colorSchemes[props.colorScheme][i % colorSchemes[props.colorScheme].length]} fillOpacity={1} onClick={props.diveDeeper !== undefined ? () => props.diveDeeper(props.dataKeys[i]) : null} style={{ cursor: 'pointer' }} />
        ))}
        <Legend iconType="square" />
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
  mainAxisDataKey: PropTypes.string,
  colorScheme: PropTypes.string,
};

AreaChart.defaultProps = {
  height: 450,
  data: [],
  dataKeys: [],
  diveDeeper: undefined,
  dollars: false,
  mainAxisDataKey: 'year',
  colorScheme: 'pink_green_diverging',
};

export default AreaChart;
