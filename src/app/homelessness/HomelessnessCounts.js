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
  'Housing Programs',
  'Transitional Housing',
];

const enrollment_data = [
  {
    Year: 2008,
    'Emergency Shelter': 134,
    'Housing Programs': 113,
    'Homelessness Prevention': 0,
    'Permanent Supportive Housing': 110,
    'Rapid Re-Housing': 3,
    'Transitional Housing': 144,
    Total: 391,
  },
  {
    Year: 2009,
    'Emergency Shelter': 120,
    'Housing Programs': 198,
    'Homelessness Prevention': 0,
    'Permanent Supportive Housing': 195,
    'Rapid Re-Housing': 3,
    'Transitional Housing': 232,
    Total: 550,
  },
  {
    Year: 2010,
    'Emergency Shelter': 125,
    'Housing Programs': 4,
    'Homelessness Prevention': 0,
    'Permanent Supportive Housing': 4,
    'Rapid Re-Housing': 4,
    'Transitional Housing': 221,
    Total: 664,
  },
  {
    Year: 2011,
    'Emergency Shelter': 162,
    'Housing Programs': 429,
    'Homelessness Prevention': 29,
    'Permanent Supportive Housing': 394,
    'Rapid Re-Housing': 6,
    'Transitional Housing': 246,
    Total: 837,
  },
  {
    Year: 2012,
    'Emergency Shelter': 185,
    'Housing Programs': 675,
    'Homelessness Prevention': 110,
    'Permanent Supportive Housing': 538,
    'Rapid Re-Housing': 27,
    'Transitional Housing': 252,
    Total: 1113,
  },
  {
    Year: 2013,
    'Emergency Shelter': 370,
    'Housing Programs': 928,
    'Homelessness Prevention': 56,
    'Permanent Supportive Housing': 700,
    'Rapid Re-Housing': 172,
    'Transitional Housing': 252,
    Total: 1508,
  },
  {
    Year: 2014,
    'Emergency Shelter': 192,
    'Housing Programs': 902,
    'Homelessness Prevention': 18,
    'Permanent Supportive Housing': 700,
    'Rapid Re-Housing': 184,
    'Transitional Housing': 242,
    Total: 1336,
  },
  {
    Year: 2015,
    'Emergency Shelter': 152,
    'Housing Programs': 855,
    'Homelessness Prevention': 21,
    'Permanent Supportive Housing': 633,
    'Rapid Re-Housing': 201,
    'Transitional Housing': 247,
    Total: 1254,
  },
  {
    Year: 2016,
    'Emergency Shelter': 138,
    'Housing Programs': 939,
    'Homelessness Prevention': 24,
    'Permanent Supportive Housing': 616,
    'Rapid Re-Housing': 299,
    'Transitional Housing': 270,
    Total: 1348,
  },
];

const HomelessnessCounts = props => (
  <div>
    <div className="row">
      <div className="col-sm-12">
        <h3>How many people are homeless in Asheville?</h3>
        <p>
          Estimating how many people are homeless is complicated since it is always changing. Each day new people either become homeless or arrive in Buncombe County while others transition into housing through our homeless support programs. The charts below show these two different sides: the <a className="inText" key="PIT_link" href="https://www.hudexchange.info/programs/hdx/guides/pit-hic/#general-pit-guides-and-tools" target="_blank" title="Annual point-in-time count definition and procedures">annual Point-in-Time (PIT) count</a> Point-in-Time (PIT) count is a one-night estimate of homeless persons conducted each January, while the graph of homeless program enrollments shows the average number of people actively receiving housing support in Buncombe County either through emergency shelter, transitional housing, a housing subsidy or permanent supportive housing. <a className="inText" href="http://www.ncceh.org/pitdata/" target="_blank">View state and local PIT counts for NC</a>. 
        </p>
      </div>
    </div>
    <div className="row">
      <div className="col-sm-6">
        <BarChartContainer chartTitle="Point-in-Time Counts" layout="vertical" mainAxisDataKey="date" legendHeight={70} dataKeys={props.PITkeys} colorScheme="bright_colors" data={props.PITdata} stacked altText="Bar chart of point-in-time counts of people who are homeless" domain={[0, 1500]} />
      </div>
      <div className="col-sm-6">
        <BarChartContainer chartTitle="Homeless program enrollments" layout="vertical" mainAxisDataKey="Year" legendHeight={70} dataKeys={props.enrollmentKeys} data={props.enrollmentData} stacked altText="Bar chart of average monthly counts of persons enrolled in housing support programs in the City of Asheville and Buncombe County" domain={[0, 'dataMax']} colorScheme="bright_colors_2" />
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
  enrollmentData: PropTypes.arrayOf(PropTypes.shape(enrollmentDataShape)),
  enrollmentKeys: PropTypes.arrayOf(PropTypes.string),
};

HomelessnessCounts.defaultProps = {
  PITdata: PIT_data,
  PITkeys: PIT_keys,
  enrollmentData: enrollment_data,
  enrollmentKeys: enrollment_keys,
};

export default HomelessnessCounts;
