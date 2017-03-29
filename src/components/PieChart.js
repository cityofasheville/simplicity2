import React from 'react';
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Tooltip, Legend, Cell } from 'recharts';
import styles from './pieChartStyles.css';

const pieColors = ['#9C27B0', '#03A9F4', '#FFC107', '#4CAF50', '#E91E63', '#795548', '#9E9E9E'];

const renderTitle = (title) => {
  if (title === undefined) {
    return '';
  }
  return (<h3>{title}</h3>);
};

const renderLegend = payload => (
  <ul>
    {
      payload.map((entry, index) => (
        <li key={[entry.name, index].join('_')}><div style={{ backgroundColor: pieColors[index % pieColors.length], width: '15px', height: '15px', display: 'inline-block', marginRight: '5px' }}></div>{entry.name}: {entry.value}</li>
      ))
    }
  </ul>
);

const PieChart = props => (
  <div style={{ height: '100%' }}>
    {renderTitle(props.chartTitle)}
    <ResponsiveContainer>
      <RechartsPieChart>
        <Pie
          data={props.data}
          cx={'35%'}
          cy={'40%'}
          label
          outerRadius={'50%'}
          fill={'#9C27B0'}
        >
          {props.data.map((entry, index) => <Cell key={['cell', index].join('_')} fill={pieColors[index % pieColors.length]} />)}
        </Pie>
        <Tooltip />
        <Legend verticalAlign={'bottom'} content={renderLegend(props.data)} className={styles.pieLegend} />
      </RechartsPieChart>
    </ResponsiveContainer>
  </div>
);

PieChart.propTypes = {
  chartTitle: React.PropTypes.string,
  data: React.PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default PieChart;
