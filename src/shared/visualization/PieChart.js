import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Tooltip, Legend, Cell } from 'recharts';
import { colorSchemes } from './colorSchemes';
import styles from './pieChartStyles.css';

const pieColors = colorSchemes.bright_colors;

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
          cx={props.cx}
          cy={props.cy}
          startAngle={props.startAngle}
          endAngle={props.endAngle}
          paddingAngle={props.paddingAngle}
          label={props.label}
          outerRadius={props.outerRadius}
          fill={'#9C27B0'}
          innerRadius={props.doughnut ? 40 : props.innerRadius}
        >
          {props.data.map((entry, index) => <Cell key={['cell', index].join('_')} fill={pieColors[index % pieColors.length]} />)}
        </Pie>
        <Tooltip formatter={props.toolTipFormatter} />
        {props.defaultLegend &&
          <Legend legentType="square" />
        }
        {!props.defaultLegend &&
          <Legend verticalAlign={'bottom'} content={props.defaultLegend ? null : renderLegend(props.data)} className={styles.pieLegend} />
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
  defaultLegend: PropTypes.bool,
  colorScheme: PropTypes.string,
  startAngle: PropTypes.number,
  endAngle: PropTypes.number,
  paddingAngle: PropTypes.number,
  innerRadius: PropTypes.number,
  outerRadius: PropTypes.number,
  cx: PropTypes.string,
  cy: PropTypes.string,
  toolTipFormatter: PropTypes.func,
};

PieChart.defaultProps = {
  data: [],
  height: 400,
  label: true,
  defaultLegend: false,
  altText: 'Pie chart',
  doughnut: false,
  defaultLegend: false,
  colorScheme: 'bright_colors',
  startAngle: 0,
  endAngle: 360,
  paddingAngle: 0,
  innerRadius: 0,
  outerRadius: 100,
  cx: '50%',
  cy: '40%',
  toolTipFormatter: null,
};

export default PieChart;
