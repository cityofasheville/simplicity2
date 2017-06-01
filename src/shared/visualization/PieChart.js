import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Tooltip, Legend, Cell } from 'recharts';
import styles from './pieChartStyles.css';

const pieColors = ['#490092', '#FFBDDB', '#009292', '#FF6DB6', '#004949', '#B66DFF', '#6DB6FF', '#000000', '#006DDB', '#B6DBFF', '#924900', '#24FF24', '#DB6D00', '#920000']; // colorblind 'safe'

const renderTitle = (title) => {
  if (title === undefined) {
    return '';
  }
  return (<h3>{title}</h3>);
};

const renderLegend = payload => (
  <ul style={{ marginBottom: '30px' }}>
    {
      payload.map((entry, index) => (
        <li key={[entry.name, index].join('_')}><div style={{ backgroundColor: pieColors[index % pieColors.length], width: '15px', height: '15px', display: 'inline-block', marginRight: '5px' }}></div>{entry.name}: {entry.value}</li>
      ))
    }
  </ul>
);

const PieChart = props => (
  <div style={{ height: props.height }} alt={props.altText}>
    {renderTitle(props.chartTitle)}
    <ResponsiveContainer>
      <RechartsPieChart>
        <Pie
          data={props.data}
          cx={'50%'}
          cy={'40%'}
          label={props.label}
          outerRadius={'50%'}
          fill={'#9C27B0'}
          innerRadius={props.doughnut ? 40 : 0}
        >
          {props.data.map((entry, index) => <Cell key={['cell', index].join('_')} fill={pieColors[index % pieColors.length]} />)}
        </Pie>
        <Tooltip />
        {props.defaultLegend &&
          <Legend legentType="square" />
        }
        {!props.defaultLegend &&
          <Legend verticalAlign={'bottom'} content={renderLegend(props.data)} className={styles.pieLegend} />
        }
      </RechartsPieChart>
    </ResponsiveContainer>
  </div>
);

PieChart.propTypes = {
  chartTitle: PropTypes.string,
  data: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  height: PropTypes.number,
  label: PropTypes.bool,
  defaultLegend: PropTypes.bool,
  altText: PropTypes.string,
  doughnut: PropTypes.bool,
};

PieChart.defaultProps = {
  data: [],
  height: 400,
  label: true,
  defaultLegend: false,
  altText: 'Pie chart',
  doughnut: false,
};

export default PieChart;
