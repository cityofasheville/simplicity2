import React from 'react';
import PropTypes from 'prop-types';
import BarChart from '../../shared/visualization/BarChart';

// todo get this data from graphql
const dataKeys = [
  'Rapid Re-Housing',
  'Veterans Affairs Supportive Housing',
  'Self-Resolved',
  'Service Intensive Transitional Housing',
  'Missing in Action',
];

const data = [
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

const getLongDesc = data => (
  <div>
    TODO: Create long description
  </div>
);

class HomelessnessVeteransExits extends React.Component {
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
        <p>
          Text Block 5.5: Intro for veteran exists graph (should this graph be on the summary page or more of a detail view?). Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.
        </p>
        <div className="row">
          <div className="col-xs-9 col-xs-offset-2">
            <h3 className="text-center">Veteran Exits from Homelessness</h3>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <BarChart data={this.props.summaryData} xAxisDataKey="month" barDataKeys={dataKeys} stacked colorScheme="purple_green_diverging" altText={'Bar chart of veteran exits from homelessness'} />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-10 col-xs-offset-2">
            <br />
            <a href="javascript:void(0);" className="text-center inText" onClick={() => this.toggleLongDesc()}>
              {this.state.showingLongDesc ? 'Hide' : 'Show'} Veteran exits from homelessness bar chart summary
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

HomelessnessVeteransExits.propTypes = {
  summaryData: PropTypes.arrayOf(PropTypes.shape(dataShape)),
  showLongDesc: PropTypes.bool, // eslint-disable-line
};

HomelessnessVeteransExits.defaultProps = {
  summaryData: data,
  showLongDesc: false,
};

export default HomelessnessVeteransExits;
