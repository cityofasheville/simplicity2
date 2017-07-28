import React from 'react';
import PropTypes from 'prop-types';
import AreaChartContainer from '../../shared/visualization/AreaChartContainer';

const programKeys = [
  'Unsheltered',
  'Emergency Shelter',
  'Emergency Shelter/Intake',
  'Intake',
  'Other',
  'MIA',
];

const programData = [
  {
    month: '05/2016',
    Unsheltered: 54,
    'Emergency Shelter': 15,
    Other: 36,
    GPD: 180,
  },
  {
    month: '07/2016',
    Unsheltered: 58,
    'Emergency Shelter': 6,
    Other: 3,
    MIA: 31,
    GPD: 180,
  },
  {
    month: '08/2016',
    Unsheltered: 56,
    'Emergency Shelter': 9,
    Other: 5,
    MIA: 23,
    GPD: 177,
  },
  {
    month: '09/2016',
    Unsheltered: 49,
    'Emergency Shelter': 11,
    Other: 6,
    MIA: 19,
    GPD: 183,
  },
  {
    month: '10/2016',
    Unsheltered: 48,
    'Emergency Shelter': 10,
    Other: 7,
    MIA: 26,
    GPD: 179,
  },
  {
    month: '11/2016',
    Unsheltered: 30,
    'Emergency Shelter/Intake': 28,
    Other: 16,
    MIA: 12,
    GPD: 179,
  },
  {
    month: '12/2016',
    Unsheltered: 21,
    'Emergency Shelter/Intake': 21,
    Other: 10,
    MIA: 16,
    GPD: 175,
  },
  {
    month: '01/2017',
    Unsheltered: 22,
    'Emergency Shelter/Intake': 39,
    Other: 15,
    MIA: 7,
    GPD: 170,
  },
  {
    month: '02/2017',
    Unsheltered: 25,
    'Emergency Shelter/Intake': 28,
    Other: 12,
    MIA: 8,
    GPD: 175,
  },
  {
    month: '03/2017',
    Unsheltered: 23,
    'Emergency Shelter/Intake': 25,
    Other: 8,
    MIA: 19,
    GPD: 177,
  },
  {
    month: '04/2017',
    Unsheltered: 26,
    'Emergency Shelter': 8,
    Intake: 24,
    Other: 9,
    MIA: 7,
  },
  {
    month: '05/2017',
    Unsheltered: 27,
    'Emergency Shelter': 7,
    Intake: 16,
    Other: 10,
    MIA: 16,
  },
];

class HomelessnessVeteransEnrollment extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showingDefinitions: this.showingDefinitions };
  }

  toggleDefinitions() {
    this.setState({
      showingDefinitions: !this.state.showingDefinitions,
    });
  }

  render() {
    return (
      <div>
        <h3>Veterans on the by-name list</h3>
          Short explanation of this chart coming soon.
          <br />
          <a href="javascript:void(0);" className="text-center inText" onClick={() => this.toggleDefinitions()}>
            {this.state.showingDefinitions ? 'Hide' : 'Show'} by-name list definitions
          </a>
          <div hidden={!this.state.showingDefinitions}>
            <p>
              <ul>
                <li>
                  <div>
                    <strong>Emergency Shelter</strong>
                  </div>
                  <div>
                    a facility that’s primary purpose is to provide temporary shelter for the general homeless population or those that serve a specific client base such as Domestic Violence victims or youth under 18 years of age.
                  </div>
                </li>
                <li>
                  <div>
                    <strong>Transitional Housing</strong>
                  </div>
                  <div>
                    housing projects that are designed to provide housing and appropriate supportive services to homeless persons to facilitate movement to independent living within 24 months, or longer if approved by HUD. Individuals and families living in Transitional Housing are included under the HUD Homeless definition.
                  </div>
                </li>
                <li>
                  <div>
                    <strong>Other</strong>
                  </div>
                  <div>
                    Definition needs to be added
                  </div>
                </li>
                <li>
                  <div>
                    <strong>MIA</strong>
                  </div>
                  <div>
                    If a Veteran on the active by-name list can no longer be located after repeated attempts, the Veteran’s status is then changed from “active” to “missing in action” and after 90 days or more, are then removed from the list for purposes of calculating these benchmarks. If the Veteran is located at a later date and is still experiencing homelessness, the date of the most recent contact becomes the new date of identification. 
                  </div>
                </li>                              
                <li>
                  <div>
                    <strong>NOTE:</strong>
                  </div>
                  <div>
                    If it is determined that an individual on the active by-name list is not a Veteran, that individual is removed from the list and not included in this data.
                  </div>
                </li>
              </ul>
            </p>
          </div>
        <div className="row">
          <div className="col-sm-12">
            <AreaChartContainer data={this.props.data} mainAxisDataKey="month" dataKeys={this.props.dataKeys} altText={'Area chart of Veterans on the by-name list'} colorScheme="bright_colors_2" />
          </div>
        </div>
      </div>
    );
  }
}

const dataShape = {
  month: PropTypes.string,
  'Emergency shelter': PropTypes.number,
  'Homelessness prevention': PropTypes.number,
  'Permanent supportive housing': PropTypes.number,
  'Rapid re-housing': PropTypes.number,
  'Transitional housing': PropTypes.number,
  Total: PropTypes.number,
};

HomelessnessVeteransEnrollment.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape(dataShape)),
  dataKeys: PropTypes.arrayOf(PropTypes.string),
  showingDefinitions: PropTypes.bool, // eslint-disable-line
};

HomelessnessVeteransEnrollment.defaultProps = {
  data: programData,
  dataKeys: programKeys,
  showingDefinitions: false,
};

export default HomelessnessVeteransEnrollment;
