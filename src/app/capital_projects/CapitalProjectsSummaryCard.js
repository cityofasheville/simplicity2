import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { colorSchemes } from '../../shared/visualization/colorSchemes';
import { testProjectData, getFundsAllocatedAndExpended } from './cip_utilities'

const CapitalProjectsSummaryCard = props => (
  <div>
    <div className="summaryCard" style={{ borderRadius: '5px', border: props.selected ? '8px solid #16abe4' : '8px solid #ffffff', opacity: props.selected ? '1.0' : '0.75', backgroundColor: '#4077a5', marginBottom: '15px' }}>
      <div style={{ backgroundColor: props.selected ? '#d3f1ff' : '#eeeeee', paddingTop: '15px' }}>
        <div className="text-center text-primary" style={{ minHeight: '45px' }}>
          <input type="checkbox" aria-label={[props.category, 'projects'].join(' ')} label={[props.category, 'projects'].join(' ')} value={props.category} checked={props.selected} readOnly />
          <span>{props.category.startsWith('Bond -') ? [props.category.split(' - ')[1].slice(0, -8), 'bond'].join(' ') : props.category} projects</span>
        </div>
      </div>
    </div>
  </div>
);

CapitalProjectsSummaryCard.propTypes = {
  category: PropTypes.string,
  text: PropTypes.string,
  selected: PropTypes.bool,
};

CapitalProjectsSummaryCard.defaultProps = {
  selected: false,
};

export default CapitalProjectsSummaryCard;
