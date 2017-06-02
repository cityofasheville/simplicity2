import React from 'react';
import PropTypes from 'prop-types';
import BarChart from '../../shared/visualization/BarChart';

const dataKeys = [
  'Inflow',
  'Outflow',
];

// todo get this data from graphql
const data = [
  {
    month: '4/2016',
    Inflow: 40,
    Outflow: 27,
  },
  {
    month: '5/2016',
    Inflow: 45,
    Outflow: 30,
  },
  {
    month: '6/2016',
    Inflow: 42,
    Outflow: 44,
  },
  {
    month: '7/2016',
    Inflow: 32,
    Outflow: 31,
  },
  {
    month: '8/2016',
    Inflow: 35,
    Outflow: 33,
  },
  {
    month: '9/2016',
    Inflow: 38,
    Outflow: 35,
  },
  {
    month: '10/2016',
    Inflow: 40,
    Outflow: 41,
  },
  {
    month: '11/2016',
    Inflow: 39,
    Outflow: 50,
  },
  {
    month: '12/2016',
    Inflow: 32,
    Outflow: 37,
  },
  {
    month: '1/2017',
    Inflow: 35,
    Outflow: 31,
  },
  {
    month: '2/2017',
    Inflow: 25,
    Outflow: 41,
  },
  {
    month: '3/2017',
    Inflow: 30,
    Outflow: 24,
  },
];

const getLongDesc = data => (
  <div>
    TODO: Create long description
  </div>
);

class HomelessnessVeterans extends React.Component {
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
        <h3>Ending Veteran homelessness</h3>
        <p>
         Text Block 5: Explain the goal for functional zero and the deadline. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.
        </p>
        <div className="row">
          <div className="col-xs-9 col-xs-offset-2">
            <h3 className="text-center">Veteran homelessness inflow and outflow</h3>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <BarChart data={this.props.summaryData} xAxisDataKey="month" barDataKeys={dataKeys} colorScheme="orange_purple_diverging" altText={'Bar chart of veteran homelessness inflow and outflow'} barGap={0} />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-10 col-xs-offset-2">
            <br />
            <a href="javascript:void(0);" className="text-center inText" onClick={() => this.toggleLongDesc()}>
              {this.state.showingLongDesc ? 'Hide' : 'Show'} Veteran homelessness inflow and outflow bar chart summary
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
  month: PropTypes.string,
  Inflow: PropTypes.number,
  Outflow: PropTypes.number,
};

HomelessnessVeterans.propTypes = {
  summaryData: PropTypes.arrayOf(PropTypes.shape(dataShape)),
  showLongDesc: PropTypes.bool, // eslint-disable-line
};

HomelessnessVeterans.defaultProps = {
  summaryData: data,
  showLongDesc: false,
};

export default HomelessnessVeterans;
