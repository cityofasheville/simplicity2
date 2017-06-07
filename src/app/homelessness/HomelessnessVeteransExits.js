import React from 'react';
import PropTypes from 'prop-types';
import BarChartContainer from '../../shared/visualization/BarChartContainer';

// todo get this data from graphql
const dataKeys = [
  'Rapid Re-Housing',
  'Veterans Affairs Supportive Housing',
  'Self-Resolved',
  'Service Intensive Transitional Housing',
  'Missing in Action',
];

const exitData = [
  {
    month: '4/2016',
    'Rapid Re-Housing': 3,
    'Veterans Affairs Supportive Housing': 6,
    'Self-Resolved': 2,
    'Service Intensive Transitional Housing': 11,
    'Missing in Action': 5,
  },
  {
    month: '5/2016',
    'Rapid Re-Housing': 6,
    'Veterans Affairs Supportive Housing': 6,
    'Self-Resolved': 3,
    'Service Intensive Transitional Housing': 12,
    'Missing in Action': 3,
  },
  {
    month: '6/2016',
    'Rapid Re-Housing': 7,
    'Veterans Affairs Supportive Housing': 3,
    'Self-Resolved': 6,
    'Service Intensive Transitional Housing': 18,
    'Missing in Action': 10,
  },
  {
    month: '7/2016',
    'Rapid Re-Housing': 7,
    'Veterans Affairs Supportive Housing': 9,
    'Self-Resolved': 2,
    'Service Intensive Transitional Housing': 8,
    'Missing in Action': 5,
  },
  {
    month: '8/2016',
    'Rapid Re-Housing': 3,
    'Veterans Affairs Supportive Housing': 3,
    'Self-Resolved': 1,
    'Service Intensive Transitional Housing': 19,
    'Missing in Action': 7,
  },
  {
    month: '9/2016',
    'Rapid Re-Housing': 9,
    'Veterans Affairs Supportive Housing': 3,
    'Self-Resolved': 1,
    'Service Intensive Transitional Housing': 9,
    'Missing in Action': 13,
  },
  {
    month: '10/2016',
    'Rapid Re-Housing': 4,
    'Veterans Affairs Supportive Housing': 5,
    'Self-Resolved': 2,
    'Service Intensive Transitional Housing': 16,
    'Missing in Action': 14,
  },
  {
    month: '11/2016',
    'Rapid Re-Housing': 6,
    'Veterans Affairs Supportive Housing': 8,
    'Self-Resolved': 6,
    'Service Intensive Transitional Housing': 19,
    'Missing in Action': 11,
  },
  {
    month: '12/2016',
    'Rapid Re-Housing': 8,
    'Veterans Affairs Supportive Housing': 3,
    'Self-Resolved': 5,
    'Service Intensive Transitional Housing': 9,
    'Missing in Action': 12,
  },
  {
    month: '1/2017',
    'Rapid Re-Housing': 4,
    'Veterans Affairs Supportive Housing': 2,
    'Self-Resolved': 3,
    'Service Intensive Transitional Housing': 12,
    'Missing in Action': 10,
  },
  {
    month: '2/2017',
    'Rapid Re-Housing': 6,
    'Veterans Affairs Supportive Housing': 9,
    'Self-Resolved': 7,
    'Service Intensive Transitional Housing': 17,
    'Missing in Action': 2,
  },
  {
    month: '3/2017',
    'Rapid Re-Housing': 3,
    'Veterans Affairs Supportive Housing': 2,
    'Self-Resolved': 4,
    'Service Intensive Transitional Housing': 10,
    'Missing in Action': 5,
  },
];

const HomelessnessVeteransExits = props => (
  <BarChartContainer chartTitle="Veteran Exits from Homelessness" chartText="Intro about Veteran Exits from Homelessness" mainAxisDataKey="month" dataKeys={dataKeys} colorScheme="purple_green_diverging" data={props.data} stacked altText="Bar chart of veteran exits from homelessness" />
);

const dataShape = {
  Year: PropTypes.string,
  'Families and children': PropTypes.number,
  'Chronically homeless': PropTypes.number,
  Veterans: PropTypes.number,
};

HomelessnessVeteransExits.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape(dataShape)),
  showLongDesc: PropTypes.bool, // eslint-disable-line
};

HomelessnessVeteransExits.defaultProps = {
  data: exitData,
  showLongDesc: false,
};

export default HomelessnessVeteransExits;
