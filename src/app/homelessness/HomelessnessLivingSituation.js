import React from 'react';
import PropTypes from 'prop-types';
import AreaChart from '../../shared/visualization/AreaChart';
import BarChart from '../../shared/visualization/BarChart';

const dataKeys = [
  'Sheltered (ES & TH)',
  'Unsheltered',
];

// todo get this data from graphql
const data = [
  {
    Year: 2005,
    'Sheltered (ES & TH)': 418,
    Unsheltered: 84,
  },
  {
    Year: 2006,
    'Sheltered (ES & TH)': 399,
    Unsheltered: 199,
  },
  {
    Year: 2007,
    'Sheltered (ES & TH)': 448,
    Unsheltered: 187,
  },
  {
    Year: 2008,
    'Sheltered (ES & TH)': 429,
    Unsheltered: 80,
  },
  {
    Year: 2009,
    'Sheltered (ES & TH)': 426,
    Unsheltered: 92,
  },
  {
    Year: 2010,
    'Sheltered (ES & TH)': 462,
    Unsheltered: 54,
  },
  {
    Year: 2011,
    'Sheltered (ES & TH)': 436,
    Unsheltered: 62,
  },
  {
    Year: 2012,
    'Sheltered (ES & TH)': 441,
    Unsheltered: 82,
  },
  {
    Year: 2013,
    'Sheltered (ES & TH)': 513,
    Unsheltered: 57,
  },
  {
    Year: 2014,
    'Sheltered (ES & TH)': 468,
    Unsheltered: 65,
  },
  {
    Year: 2015,
    'Sheltered (ES & TH)': 488,
    Unsheltered: 74,
  },
  {
    Year: 2016,
    'Sheltered (ES & TH)': 437,
    Unsheltered: 72,
  },
  {
    Year: 2017,
    'Sheltered (ES & TH)': 457,
    Unsheltered: 105,
  },
];

const getLongDesc = data => (
  <div>
    TODO: Create long description
  </div>
);

class HomelessnessLivingSituation extends React.Component {
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
        <div className="row">
          <div className="col-xs-9 col-xs-offset-2">
            <h3 className="text-center">Homelessness over the last 12 years by living situation</h3>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <AreaChart data={this.props.summaryData} xAxisDataKey="Year" dataKeys={dataKeys} altText={'Area chart of homelessness over the last 12 years in target populations'} colorScheme={3} />
            <h3>Or - a stacked bar chart since it is Point-in-time data only taken once yearly</h3>
            <BarChart data={this.props.summaryData} xAxisDataKey="Year" barDataKeys={dataKeys} stacked colorScheme={3} altText={'Bar chart of homelessness over the last 12 years: target populations'} />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-10 col-xs-offset-2">
            <br />
            <a href="javascript:void(0);" className="text-center inText" onClick={() => this.toggleLongDesc()}>
              {this.state.showingLongDesc ? 'Hide' : 'Show'} Homlessness over the last 12 years by living situation area chart summary
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
  Year: PropTypes.string,
  'Sheltered (ES & TH)': PropTypes.number,
  Unsheltered: PropTypes.number,
  'Total Count': PropTypes.number,
};

HomelessnessLivingSituation.propTypes = {
  summaryData: PropTypes.arrayOf(PropTypes.shape(dataShape)),
  showLongDesc: PropTypes.bool, // eslint-disable-line
};

HomelessnessLivingSituation.defaultProps = {
  summaryData: data,
  showLongDesc: false,
};

export default HomelessnessLivingSituation;
