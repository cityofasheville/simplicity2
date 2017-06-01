import React from 'react';
import PropTypes from 'prop-types';
import AreaChart from '../../shared/visualization/AreaChart';
import BarChart from '../../shared/visualization/BarChart';

const dataKeys = [
  'Families and children',
  'Chronically homeless',
  'Veterans',
];

// todo get this data from graphql
const data = [
  {
    Year: 2005,
    'Families and children': 53,
    'Chronically homeless': 169,
    Veterans: 126,
  },
  {
    Year: 2006,
    'Families and children': 101,
    'Chronically homeless': 134,
    Veterans: 108,
  },
  {
    Year: 2007,
    'Families and children': 93,
    'Chronically homeless': 105,
    Veterans: 111,
  },
  {
    Year: 2008,
    'Families and children': 102,
    'Chronically homeless': 175,
    Veterans: 121,
  },
  {
    Year: 2009,
    'Families and children': 86,
    'Chronically homeless': 115,
    Veterans: 162,
  },
  {
    Year: 2010,
    'Families and children': 101,
    'Chronically homeless': 111,
    Veterans: 200,
  },
  {
    Year: 2011,
    'Families and children': 61,
    'Chronically homeless': 81,
    Veterans: 209,
  },
  {
    Year: 2012,
    'Families and children': 56,
    'Chronically homeless': 98,
    Veterans: 230,
  },
  {
    Year: 2013,
    'Families and children': 96,
    'Chronically homeless': 54,
    Veterans: 232,
  },
  {
    Year: 2014,
    'Families and children': 57,
    'Chronically homeless': 47,
    Veterans: 226,
  },
  {
    Year: 2015,
    'Families and children': 60,
    'Chronically homeless': 74,
    Veterans: 209,
  },
  {
    Year: 2016,
    'Families and children': 42,
    'Chronically homeless': 72,
    Veterans: 196,
  },
  {
    Year: 2017,
    'Families and children': 57,
    'Chronically homeless': 83,
    Veterans: 239,
  },
];

const getLongDesc = data => (
  <div>
    TODO: Create long description
  </div>
);

class HomelessTargetPops extends React.Component {
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
            <h3 className="text-center">Homelessness over the last 12 years: Target Populations</h3>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <AreaChart data={this.props.summaryData} xAxisDataKey="Year" dataKeys={dataKeys} altText={'Area chart of homelessness over the last 12 years in target populations'} colorScheme={0} />
            <h3>Or - a stacked bar chart since it is Point-in-time data only taken once yearly</h3>
            <BarChart data={this.props.summaryData} xAxisDataKey="Year" barDataKeys={dataKeys} stacked colorScheme={0} altText={'Bar chart of homelessness over the last 12 years: target populations'} />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-10 col-xs-offset-2">
            <br />
            <a href="javascript:void(0);" className="text-center inText" onClick={() => this.toggleLongDesc()}>
              {this.state.showingLongDesc ? 'Hide' : 'Show'} Homlessness over the last 12 years: Target populations area chart summary
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
  'Families and children': PropTypes.number,
  'Chronically homeless': PropTypes.number,
  Veterans: PropTypes.number,
};

HomelessTargetPops.propTypes = {
  summaryData: PropTypes.arrayOf(PropTypes.shape(dataShape)),
  showLongDesc: PropTypes.bool, // eslint-disable-line
};

HomelessTargetPops.defaultProps = {
  summaryData: data,
  showLongDesc: false,
};

export default HomelessTargetPops;
