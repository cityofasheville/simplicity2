import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { colorSchemes } from '../../shared/visualization/colorSchemes';
import { testProjectData, getFundsAllocatedAndExpended } from './cip_utilities'

const getDollars = (value) => {
  if (Math.abs(value) > 1000000) {
    return [value < 0 ? '-$' : '$', (Math.abs(value) / 1000000).toFixed(0).toLocaleString(), ' M'].join('');
  } else if (Math.abs(value) > 1000) {
    return [value < 0 ? '-$' : '$', (Math.abs(value) / 1000).toFixed(0).toLocaleString(), ' k'].join('');
  }
  return [value < 0 ? '-$' : '$', Math.abs(value).toFixed(0).toLocaleString()].join('');
};

const getDollarsLong = value => (
  [value < 0 ? '-$' : '$', Math.abs(value).toLocaleString()].join('')
);

const getIconPath = (category) => {
  switch (category) {
    case 'Bond - Transportation Program':
      return require('./transportationBondIcon.png'); // eslint-disable-line
    case 'Bond - Parks Program':
      return require('./parksBondIcon.png'); // eslint-disable-line
    case 'Bond - Housing Program':
      return require('./housingBondIcon.png'); // eslint-disable-line
    default:
      return require('./citylogo-419x314.png'); // eslint-disable-line
  }
};

const CapitalProjectsSummaryCard = props => {
  const barChartData = getFundsAllocatedAndExpended(testProjectData, props.category);

  return (
    <div>
      <div className="summaryCard" style={{ borderRadius: '5px', border: props.selected ? '8px solid #16abe4' : '8px solid #ffffff', opacity: props.selected ? '1.0' : '0.75', backgroundColor: '#4077a5', marginBottom: '15px' }}>
        <img className="hidden-xs" alt={[props.category, 'bonds', 'icon'].join(' ')} src={getIconPath(props.category)} style={{ width: '55%', display: 'block', margin: 'auto', backgroundColor: '#ffffff' }}></img>
        <div style={{ backgroundColor: props.selected ? '#d3f1ff' : '#eeeeee', paddingTop: '15px' }}>
          <div className="text-center text-primary" style={{ minHeight: '45px' }}>
            <input type="checkbox" aria-label={[props.category, 'projects'].join(' ')} label={[props.category, 'projects'].join(' ')} value={props.category} checked={props.selected} readOnly />
            <span>{props.category.startsWith('Bond -') ? [props.category.split(' - ')[1].slice(0, -8), 'bond'].join(' ') : props.category} projects</span>
          </div>
        </div>
      </div>
    </div>
  );
};

CapitalProjectsSummaryCard.propTypes = {
  category: PropTypes.string,
  text: PropTypes.string,
  selected: PropTypes.bool,
};

CapitalProjectsSummaryCard.defaultProps = {
  selected: false,
};

export default CapitalProjectsSummaryCard;
