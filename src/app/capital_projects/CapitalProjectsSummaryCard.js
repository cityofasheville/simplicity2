import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { colorSchemes } from '../../shared/visualization/colorSchemes';

const testData = {
  Transportation: [{ name: 'Transportation bonds funding', allocated: 32000000, 'Expended funds': 0, 'Remaining funds': 32000000 }],
  Parks: [{ name: 'Parks bonds funding', allocated: 17000000, 'Expended funds': 5000000, 'Remaining funds': 17000000 }],
  Housing: [{ name: 'Housing bonds funding', allocated: 25000000, 'Expended funds': 0, 'Remaining funds': 25000000 }],
};

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

const getIconPath = (type) => {
  switch (type) {
    case 'Transportation':
      return require('./transportationBondIcon.png'); // eslint-disable-line
    case 'Parks':
      return require('./parksBondIcon.png'); // eslint-disable-line
    default:
      return require('./housingBondIcon.png'); // eslint-disable-line
  }
};

const CapitalProjectsSummaryCard = props => (
  <div>
    <div className="summaryCard" style={{ borderRadius: '5px', border: '1px solid #ffffff', backgroundColor: '#4077a5', marginBottom: '15px' }}>
      <img alt={[props.type, 'bonds', 'icon'].join(' ')} src={getIconPath(props.type)} style={{ width: '55%', display: 'block', margin: 'auto', backgroundColor: '#ffffff' }}></img>
      <div style={{ backgroundColor: '#eeeeee', height: '180px', paddingTop: '15px', paddingRight: '8px', paddingLeft: '8px' }}>
        <ResponsiveContainer>
          <RechartsBarChart data={testData[props.type]} layout="vertical" alt="Bar chart of funds expended and funds remaining">
            <YAxis dataKey="name" type="category" hide />
            <XAxis tickFormatter={getDollars} domain={['dataMin', 32000000]} type="number" />
            <Tooltip formatter={getDollarsLong} />
            <Legend />
            <Bar dataKey="Remaining funds" stackId="1" fill={colorSchemes.bright_colors_2[0]} />
            <Bar dataKey="Expended funds" stackId="1" fill={colorSchemes.bright_colors_2[1]} />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ backgroundColor: '#eeeeee', paddingBottom: '10px', paddingTop: '15px' }}>
        <div className="text-center">
          <Link to={{ pathname: '/capital_projects/details', query: { type: props.type } }}>
            <button className="btn btn-primary">{props.type} fund details</button>
          </Link>
        </div>
      </div>
    </div>
  </div>
);

const dataShape = {
  'Total bond funding': PropTypes.number,
  'Bond funds expended': PropTypes.number,
};

CapitalProjectsSummaryCard.propTypes = {
  type: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.shape(dataShape)),
  text: PropTypes.string,
};

export default CapitalProjectsSummaryCard;
