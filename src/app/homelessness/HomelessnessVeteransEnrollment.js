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
  'Grant & Per Diem',
];

const programData = [
  {
    month: '5/2016',
    Unsheltered: 54,
    'Emergency Shelter': 15,
    Other: 36,
    'Grant & Per Diem': 180,
  },
  {
    month: '7/2016',
    Unsheltered: 58,
    'Emergency Shelter': 6,
    Other: 3,
    MIA: 31,
    'Grant & Per Diem': 180,
  },
  {
    month: '8/2016',
    Unsheltered: 56,
    'Emergency Shelter': 9,
    Other: 5,
    MIA: 23,
    'Grant & Per Diem': 177,
  },
  {
    month: '9/2016',
    Unsheltered: 49,
    'Emergency Shelter': 11,
    Other: 6,
    MIA: 19,
    'Grant & Per Diem': 183,
  },
  {
    month: '10/2016',
    Unsheltered: 48,
    'Emergency Shelter': 10,
    Other: 7,
    MIA: 26,
    'Grant & Per Diem': 179,
  },
  {
    month: '11/2016',
    Unsheltered: 30,
    'Emergency Shelter/Intake': 28,
    Other: 16,
    MIA: 12,
    'Grant & Per Diem': 179,
  },
  {
    month: '12/2016',
    Unsheltered: 21,
    'Emergency Shelter/Intake': 21,
    Other: 10,
    MIA: 16,
    'Grant & Per Diem': 175,
  },
  {
    month: '1/2017',
    Unsheltered: 22,
    'Emergency Shelter/Intake': 39,
    Other: 15,
    MIA: 7,
    'Grant & Per Diem': 170,
  },
  {
    month: '2/2017',
    Unsheltered: 25,
    'Emergency Shelter/Intake': 28,
    Other: 12,
    MIA: 8,
    'Grant & Per Diem': 175,
  },
  {
    month: '3/2017',
    Unsheltered: 23,
    'Emergency Shelter/Intake': 25,
    Other: 8,
    MIA: 19,
    'Grant & Per Diem': 177,
  },
  {
    month: '4/2017',
    Unsheltered: 26,
    'Emergency Shelter': 8,
    Intake: 24,
    Other: 9,
    MIA: 7,
    'Grant & Per Diem': 180,
  },
  {
    month: '5/2017',
    Unsheltered: 27,
    'Emergency Shelter': 7,
    Intake: 16,
    Other: 10,
    MIA: 16,
    'Grant & Per Diem': 180, 
  },
  {
    month: '6/2017',
    Unsheltered: 36,
    'Emergency Shelter': 9,
    Intake: 10,
    Other: 10,
    MIA: 20,
    'Grant & Per Diem': 180,
  },
  {
    month: '7/2017',
    Unsheltered: 38,
    'Emergency Shelter': 9,
    Intake: 18,
    Other: 8,
    MIA: 14,
    'Grant & Per Diem': 174,
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
        <p>
          The Veteran By-Name List is a comprehensive list of homeless Veterans in the community that is populated through information from street and VA outreach, HMIS, community shelters, VA-funded programs including GPD providers, and any other provider who may work with Veterans experiencing homelessness. The list is updated regularly – in most cases, daily – in order to ensure it has the most up-to-date information.
        </p>
        <p>
          A by-name is not a waiting list – Veterans on this list may already be accessing programs, waiting for a housing unit, have entered a transitional program, declined assistance or may self-resolve their homelessness. The by-name list is used to determine where Veterans actually are in our homeless assistance system, who needs to be prioritized for services and/or housing and what barriers need to be removed.
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
                    A facility that’s primary purpose is to provide temporary shelter for the general homeless population or those that serve a specific client base such as Domestic Violence victims or youth under 18 years of age.
                  </div>
                </li>
                <li>
                  <div>
                    <strong>Intake</strong>
                  </div>
                  <div>
                    Once a Veteran has been identified, a determination is made as to eligibility for VA programs and the Veteran is offered a choice for a housing intervention. If no immediate bed is available in the non-clinical GPD program, the Veteran moves to an intake bed until a GPD bed is available. The Veteran may elect to enroll in a housing program and enter GPD for a short duration (Bridge Housing) while housing is located or enter the long term service intensive transitional program.
                  </div>
                </li>
                <li>
                  <div>
                    <strong>Other</strong>
                  </div>
                  <div>
                    This category covers Veterans that have been outreached, identified and placed on the by-name list but who may be temporarily in an institutional setting like an inpatient treatment center or hospital or detained in the local jail so they cannot be fully engaged in housing related services until current issue is resolved.
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
                      <strong>Grant &amp; Per Diem</strong>
                    </div>
                    <div>
                      Since 1994, the VA's Homeless Providers Grant and Per Diem Program (GPD) has offered Veterans Affairs Health Care for Homeless Veterans (HCHV) Programs to community agencies providing services to homeless Veterans. The purpose of GPD is to promote the development and provision of supportive housing and/or supportive services with the goal of helping homeless Veterans achieve residential stability, increase their skill levels and/or income, and obtain greater self-determination. In 2017, the VA designated several program types within GPD: Healthcare to Home, Low Barrier, Clinical, Bridge Housing and Service-Intensive Transitional Housing (SITH). Whereas most GPD programs provide short lengths of stay in transitional housing facilities and provide rapid connections to permanent housing, SITH provides up to 24 months of transitional housing in which homeless Veterans are actively working with the assistance of appropriate services and supports to achieve permanent housing. In Buncombe County, Veterans are offered a choice at identification as to whether a housing intervention or a Grant and Per Diem program meets their needs.
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
        </p>
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
