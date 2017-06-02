import React from 'react';
import PropTypes from 'prop-types';
import BarChart from '../../shared/visualization/BarChart';

const dataKeys = [
  'All sheltered people',
  'All unsheltered people',
  'Sheltered: with at least one adult and one child',
  'Sheltered: with only children',
  'Sheltered: without children',
  'Unsheltered: with at least one adult and one child',
  'Unsheltered: with only children',
  'Unsheltered: without children',
];

// todo get this data from graphql
const PITdata = [
  {
    date: '2005',
    'All sheltered people': 418,
    'All unsheltered people': 84,
  },
  {
    date: '2006',
    'All sheltered people': 399,
    'All unsheltered people': 199,
  },
  {
    date: '2007',
    'All sheltered people': 448,
    'All unsheltered people': 187,
  },
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
    'Sheltered: with at least one adult and one child': 101,
    'Sheltered: with only children': 0,
    'Sheltered: without children': 361,
    'Unsheltered: with at least one adult and one child': 0,
    'Unsheltered: with only children': 0,
    'Unsheltered: without children': 54,
  },
  {
    date: '2011',
    'Sheltered: with at least one adult and one child': 61,
    'Sheltered: with only children': 10,
    'Sheltered: without children': 381,
    'Unsheltered: with at least one adult and one child': 0,
    'Unsheltered: with only children': 0,
    'Unsheltered: without children': 62,
  },
  {
    date: '2012',
    'Sheltered: with at least one adult and one child': 94,
    'Sheltered: with only children': 9,
    'Sheltered: without children': 375,
    'Unsheltered: with at least one adult and one child': 0,
    'Unsheltered: with only children': 0,
    'Unsheltered: without children': 82,
  },
  {
    date: '2013',
    'Sheltered: with at least one adult and one child': 92,
    'Sheltered: with only children': 4,
    'Sheltered: without children': 417,
    'Unsheltered: with at least one adult and one child': 0,
    'Unsheltered: with only children': 0,
    'Unsheltered: without children': 57,
  },
  {
    date: '2014',
    'Sheltered: with at least one adult and one child': 52,
    'Sheltered: with only children': 5,
    'Sheltered: without children': 408,
    'Unsheltered: with at least one adult and one child': 0,
    'Unsheltered: with only children': 0,
    'Unsheltered: without children': 65,
  },
  {
    date: '2015',
    'Sheltered: with at least one adult and one child': 52,
    'Sheltered: with only children': 8,
    'Sheltered: without children': 426,
    'Unsheltered: with at least one adult and one child': 0,
    'Unsheltered: with only children': 0,
    'Unsheltered: without children': 74,
  },
  {
    date: '2016',
    'Sheltered: with at least one adult and one child': 37,
    'Sheltered: with only children': 5,
    'Sheltered: without children': 395,
    'Unsheltered: with at least one adult and one child': 0,
    'Unsheltered: with only children': 0,
    'Unsheltered: without children': 72,
  },
];

const getLongDesc = data => (
  <div>
    TODO: Create long description
  </div>
);

class HomelessnessPITSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showingLongDesc: this.showLongDesc };
  }

  toggleLongDesc() {
    this.setState({
      showingLongDesc: !this.state.showingLongDesc,
    });
  }

  render() {
    return (
      <div>
        <h3>Point-in-Time Counts</h3>
        <p>
          Text Block 2: Text about what the PIT is and when it is done, why it is important, so that users can better understand the visualization. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.
        </p>
        <div className="row">
          <div className="col-xs-9 col-xs-offset-2">
            <h3 className="text-center">Point-in-Time counts of people who are homeless</h3>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <BarChart data={this.props.summaryData} xAxisDataKey="date" barDataKeys={dataKeys} stacked colorScheme="blue_red_grouped" altText={'Bar chart of point-in-time counts of people who are homeless'} />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-10 col-xs-offset-2">
            <br />
            <a href="javascript:void(0);" className="text-center inText" onClick={() => this.toggleLongDesc()}>
              {this.state.showingLongDesc ? 'Hide' : 'Show'} Point-in-time count bar chart summary
            </a>
            <div hidden={!this.state.showingLongDesc}>
              {getLongDesc(this.props.summaryData)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

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

HomelessnessPITSummary.propTypes = {
  summaryData: PropTypes.arrayOf(PropTypes.shape(dataShape)),
  showLongDesc: PropTypes.bool, // eslint-disable-line
};

HomelessnessPITSummary.defaultProps = {
  summaryData: PITdata,
  showLongDesc: false,
};

export default HomelessnessPITSummary;
