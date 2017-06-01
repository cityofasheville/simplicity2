import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

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

const getColorScheme = index => (
  index < colorSchemes.length && index >= 0 ? colorSchemes[index] : colorSchemes[0]
);

const getDollars = (value) => {
  if (value > 1000000) {
    return ['$', (value / 1000000).toLocaleString(), ' M'].join('');
  } else if (value > 1000) {
    return ['$', (value / 1000).toLocaleString(), ' k'].join('');
  }
  return ['$', value.toLocaleString()].join('');
};

/*const renderLegend = payload => (
  <ul style={{ listStyle: 'none' }}>
    {
      payload.map((entry, index) => (
        <li key={['legend', entry[index], index].join('_')} style={{ display: 'inline', marginRight: '10px' }}><div style={{ backgroundColor: COLORS[index % COLORS.length], width: '10px', height: '10px', display: 'inline-block', marginRight: '2px' }}></div>{entry}</li>
      ))
    }
  </ul>
);*/

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
          <Area key={['area', i].join('_')} type="monotone" dataKey={props.dataKeys[i]} stackId={1} fill={getColorScheme(props.colorScheme)[i % getColorScheme(props.colorScheme).length]} stroke={getColorScheme(props.colorScheme)[i % getColorScheme(props.colorScheme).length]} fillOpacity={1} onClick={props.diveDeeper !== undefined ? () => props.diveDeeper(props.dataKeys[i]) : null} style={{ cursor: 'pointer' }} />
        ))}
        <Legend />
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
  colorScheme: PropTypes.number,
};

AreaChart.defaultProps = {
  height: 450,
  data: [],
  dataKeys: [],
  diveDeeper: undefined,
  dollars: false,
  xAxisDataKey: 'year',
  colorScheme: 0,
};

export default AreaChart;
