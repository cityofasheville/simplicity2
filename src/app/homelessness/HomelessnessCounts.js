import React from 'react';
import PropTypes from 'prop-types';
import BarChartContainer from '../../shared/visualization/BarChartContainer';

const PIT_keys = [
  'All sheltered people',
  'All unsheltered people',
  // 'Sheltered: with at least one adult and one child',
  // 'Sheltered: with only children',
  // 'Sheltered: without children',
  // 'Unsheltered: with at least one adult and one child',
  // 'Unsheltered: with only children',
  // 'Unsheltered: without children',
];

// todo get this data from graphql
const PIT_data = [
  // {
  //   date: '2005',
  //   'All sheltered people': 418,
  //   'All unsheltered people': 84,
  // },
  // {
  //   date: '2006',
  //   'All sheltered people': 399,
  //   'All unsheltered people': 199,
  // },
  // {
  //   date: '2007',
  //   'All sheltered people': 448,
  //   'All unsheltered people': 187,
  // },
  {
    date: '2008',
    'All sheltered people': 429,
    'All unsheltered people': 80,
  },
  {
    date: '2009',
    'All sheltered people': 426,
    'All unsheltered people': 92,
  },
  {
    date: '2010',
    'All sheltered people': 462,
    'All unsheltered people': 54,
    'Sheltered: with at least one adult and one child': 101,
    'Sheltered: with only children': 0,
    'Sheltered: without children': 361,
    'Unsheltered: with at least one adult and one child': 0,
    'Unsheltered: with only children': 0,
    'Unsheltered: without children': 54,
  },
  {
    date: '2011',
    'All sheltered people': 436,
    'All unsheltered people': 62,
    'Sheltered: with at least one adult and one child': 61,
    'Sheltered: with only children': 10,
    'Sheltered: without children': 381,
    'Unsheltered: with at least one adult and one child': 0,
    'Unsheltered: with only children': 0,
    'Unsheltered: without children': 62,
  },
  {
    date: '2012',
    'All sheltered people': 441,
    'All unsheltered people': 82,
    'Sheltered: with at least one adult and one child': 94,
    'Sheltered: with only children': 9,
    'Sheltered: without children': 375,
    'Unsheltered: with at least one adult and one child': 0,
    'Unsheltered: with only children': 0,
    'Unsheltered: without children': 82,
  },
  {
    date: '2013',
    'All sheltered people': 513,
    'All unsheltered people': 57,
    'Sheltered: with at least one adult and one child': 92,
    'Sheltered: with only children': 4,
    'Sheltered: without children': 417,
    'Unsheltered: with at least one adult and one child': 0,
    'Unsheltered: with only children': 0,
    'Unsheltered: without children': 57,
  },
  {
    date: '2014',
    'All sheltered people': 468,
    'All unsheltered people': 65,
    'Sheltered: with at least one adult and one child': 52,
    'Sheltered: with only children': 5,
    'Sheltered: without children': 408,
    'Unsheltered: with at least one adult and one child': 0,
    'Unsheltered: with only children': 0,
    'Unsheltered: without children': 65,
  },
  {
    date: '2015',
    'All sheltered people': 488,
    'All unsheltered people': 74,
    'Sheltered: with at least one adult and one child': 52,
    'Sheltered: with only children': 8,
    'Sheltered: without children': 426,
    'Unsheltered: with at least one adult and one child': 0,
    'Unsheltered: with only children': 0,
    'Unsheltered: without children': 74,
  },
  {
    date: '2016',
    'All sheltered people': 437,
    'All unsheltered people': 72,
    'Sheltered: with at least one adult and one child': 37,
    'Sheltered: with only children': 5,
    'Sheltered: without children': 395,
    'Unsheltered: with at least one adult and one child': 0,
    'Unsheltered: with only children': 0,
    'Unsheltered: without children': 72,
  },
];

const enrollment_keys = [
  'Emergency Shelter',
  'Homelessness Prevention',
  'Permanent Supportive Housing',
  'Rapid Re-Housing',
  'Transitional Housing',
];

const enrollment_data = [
  {
    Year: 2008,
    'Emergency Shelter': 1606 / 12,
    'Homelessness Prevention': 0 / 12,
    'Permanent Supportive Housing': 1322 / 12,
    'Rapid Re-Housing': 39 / 12,
    'Transitional Housing': 1730 / 12,
    Total: 4697,
  },
  {
    Year: 2009,
    'Emergency Shelter': 1443 / 12,
    'Homelessness Prevention': 0 / 12,
    'Permanent Supportive Housing': 2334 / 12,
    'Rapid Re-Housing': 33 / 12,
    'Transitional Housing': 2787 / 12,
    Total: 6597,
  },
  {
    Year: 2010,
    'Emergency Shelter': 1496 / 12,
    'Homelessness Prevention': 2 / 12,
    'Permanent Supportive Housing': 3769 / 12,
    'Rapid Re-Housing': 43 / 12,
    'Transitional Housing': 2655 / 12,
    Total: 7965,
  },
  {
    Year: 2011,
    'Emergency Shelter': 1947 / 12,
    'Homelessness Prevention': 345 / 12,
    'Permanent Supportive Housing': 4733 / 12,
    'Rapid Re-Housing': 70 / 12,
    'Transitional Housing': 2946 / 12,
    Total: 10041,
  },
  {
    Year: 2012,
    'Emergency Shelter': 2223 / 12,
    'Homelessness Prevention': 1322 / 12,
    'Permanent Supportive Housing': 6451 / 12,
    'Rapid Re-Housing': 329 / 12,
    'Transitional Housing': 3029 / 12,
    Total: 13354,
  },
  {
    Year: 2013,
    'Emergency Shelter': 4438 / 12,
    'Homelessness Prevention': 676 / 12,
    'Permanent Supportive Housing': 7900 / 12,
    'Rapid Re-Housing': 2063 / 12,
    'Transitional Housing': 3018 / 12,
    Total: 18095,
  },
  {
    Year: 2014,
    'Emergency Shelter': 2308 / 12,
    'Homelessness Prevention': 215 / 12,
    'Permanent Supportive Housing': 8399 / 12,
    'Rapid Re-Housing': 2206 / 12,
    'Transitional Housing': 2903 / 12,
    Total: 16031,
  },
  {
    Year: 2015,
    'Emergency Shelter': 1826 / 12,
    'Homelessness Prevention': 256 / 12,
    'Permanent Supportive Housing': 7596 / 12,
    'Rapid Re-Housing': 2412 / 12,
    'Transitional Housing': 2961 / 12,
    Total: 15051,
  },
  {
    Year: 2016,
    'Emergency Shelter': 1656 / 12,
    'Homelessness Prevention': 293 / 12,
    'Permanent Supportive Housing': 7393 / 12,
    'Rapid Re-Housing': 3588 / 12,
    'Transitional Housing': 3243 / 12,
    Total: 16173,
  },
];

const HomelessnessCounts = props => (
  <div>
    <div className="row">
      <div className="col-sm-12">
        <h3>How many people are homeless?</h3>
        <p>
          Text Block 1.5: Why this question is complicated, how we get ballpark figures. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.
        </p>
      </div>
    </div>
    <div className="row">
      <div className="col-sm-6">
        <BarChartContainer chartTitle="Point-in-Time Counts" chartText="Unduplicated one night estimates of both sheltered and unsheltered homeless persons, conducted the last week of January." layout="vertical" mainAxisDataKey="date" legendHeight={70} dataKeys={props.PITkeys} colorScheme="purple_green_diverging" data={props.PITdata} stacked altText="Bar chart of point-in-time counts of people who are homeless" domain={[0, 1500]} />
      </div>
      <div className="col-sm-6">
        <BarChartContainer chartTitle="Homeless program enrollments" chartText="Average monthly counts of individuals enrolled in homeless programs in the City of Asheville and Buncombe county." layout="vertical" mainAxisDataKey="Year" legendHeight={70} dataKeys={props.enrollmentKeys} data={props.enrollmentData} stacked altText="Bar chart of month counts of individuals enrolled in homeless programs in the City of Asheville and Buncombe county" domain={[0, 'dataMax']} />
      </div>
    </div>
  </div>
);

const dataShape = {
  date: PropTypes.string,
  'All sheltered people': PropTypes.number,
  'All unsheltered people': PropTypes.number,
  'Sheltered: with at least one adult and one child': PropTypes.number,
  'Sheltered: with only children': PropTypes.number,
  'Sheltered: without children': PropTypes.number,
  'Unsheltered: with at least one adult and one child': PropTypes.number,
  'Unsheltered: with only children': PropTypes.number,
  'Unsheltered: without children': PropTypes.number,
};

const enrollmentDataShape = {
  Year: PropTypes.number,
  'Emergency Shelter': PropTypes.number,
  'Homelessness Prevention': PropTypes.number,
  'Permanent Supportive Housing': PropTypes.number,
  'Rapid Re-Housing': PropTypes.number,
  'Transitional Housing': PropTypes.number,
  Total: PropTypes.number,
};

HomelessnessCounts.propTypes = {
  PITdata: PropTypes.arrayOf(PropTypes.shape(dataShape)),
  PITkeys: PropTypes.arrayOf(PropTypes.string),
  showLongDesc: PropTypes.bool, // eslint-disable-line
  enrollmentData: PropTypes.arrayOf(PropTypes.shape(enrollmentDataShape)),
  enrollmentKeys: PropTypes.arrayOf(PropTypes.string),
};

HomelessnessCounts.defaultProps = {
  PITdata: PIT_data,
  PITkeys: PIT_keys,
  enrollmentData: enrollment_data,
  enrollmentKeys: enrollment_keys,
  showLongDesc: false,
};

export default HomelessnessCounts;
