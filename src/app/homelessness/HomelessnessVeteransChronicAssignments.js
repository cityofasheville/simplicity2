import React from 'react';
import PropTypes from 'prop-types';
import AreaChart from '../../shared/visualization/AreaChart';

const chronicKeys = [
  'Declining',
  'SSVF',
  'HUD-VASH',
  'Grant & Per Diem',
];

const chronicData = [
  {
    month: '5/2016',
    SSVF: 3,
    'HUD-VASH': 11,
    'Grant & Per Diem': 26,
  },
  {
    month: '7/2016',
    Declining: 1,
    SSVF: 1,
    'HUD-VASH': 11,
    'Grant & Per Diem': 22,
  },
  {
    month: '8/2016',
    Declining: 1,
    SSVF: 3,
    'HUD-VASH': 11,
    'Grant & Per Diem': 22,
  },
  {
    month: '9/2016',
    Declining: 1,
    SSVF: 4,
    'HUD-VASH': 10,
    'Grant & Per Diem': 18,
  },
  {
    month: '10/2016',
    Declining: 1,
    SSVF: 3,
    'HUD-VASH': 10,
    'Grant & Per Diem': 12.
  },
  {
    month: '11/2016',
    Declining: 2,
    SSVF: 5,
    'HUD-VASH': 10,
    'Grant & Per Diem': 12,
  },
  {
    month: '12/2016',
    Declining: 2,
    SSVF: 5,
    'HUD-VASH': 10,
    'Grant & Per Diem': 28,
  },
  {
    month: '1/2017',
    Declining: 2,
    SSVF: 2,
    'HUD-VASH': 10,
    'Grant & Per Diem': 38,
  },
  {
    month: '2/2017',
    Declining: 2,
    SSVF: 7,
    'HUD-VASH': 10,
    'Grant & Per Diem': 33,
  },
  {
    month: '3/2017',
    Declining: 1,
    SSVF: 5,
    'HUD-VASH': 10,
    'Grant & Per Diem': 35,
  },
  {
    month: '4/2017',
    Declining: 1,
    SSVF: 4,
    'HUD-VASH': 0,
    'Grant & Per Diem': 34,
  },
  {
    month: '5/2017',
    Declining: 2,
    SSVF: 4,
    'HUD-VASH': 0,
    'Grant & Per Diem': 34,
  },
  {
    month: '6/2017',
    Declining: 4,
    SSVF: 2,
    'HUD-VASH': 0,
    'Grant & Per Diem': 34,
  },
  {
    month: '7/2017',
    Declining: 1,
    SSVF: 3,
    'HUD-VASH': 8,
    'Grant & Per Diem': 34,
  },
];

class HomelessnessVeteransChronicAssignments extends React.Component {
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
        <h3>Program enrollments: chronically homeless Veterans</h3>
          <p>Every identified Veteran is given an opportunity to choose an appropriate intervention they qualify for and that facilities their specific needs. For Veterans who decline an intervention, the U.S. Interagency Council on Homelessness benchmarks require that a documented offer of a housing intervention be made to that Veteran every two weeks. These persons are listed as ‘declining’ on the Veteran By-Name list for Buncombe County.</p>
          <p>Program enrollment for all Veterans is tracked on the by-name list but particular attention is paid to those Veterans who are identified as chronically homeless.
            <br />
            <a href="javascript:void(0);" className="text-center inText" onClick={() => this.toggleDefinitions()}>
              {this.state.showingDefinitions ? 'Hide' : 'Show'} program definitions
            </a>
            <div hidden={!this.state.showingDefinitions}>
              <p>
                <ul>
                  <li>
                    <div>
                      <strong>Supportive Services for Veteran Families (SSVF)</strong>
                    </div>
                    <div>
                      The Veteran Administration offers community-based grants through the Supportive Services for Veteran Families (SSVF) Program, which provides supportive services to very low-income Veteran families in or transitioning to permanent housing. Funds are granted to private non-profit organizations and consumer cooperatives who assist very low-income Veteran families by providing a range of supportive services designed to promote housing stability. Grantees provide eligible Veteran families with outreach, case management, and assistance in obtaining VA and other benefits to support housing stability.
                    </div>
                  </li>
                  <li>
                    <div>
                      <strong>HUD-VASH</strong>
                    </div>
                    <div>
                      a collaborative program between US Department of Housing and Urban Development (HUD) and the VA which combines HUD housing vouchers with VA supportive services to help Veterans who are homeless and their families find and sustain permanent housing. Through public housing authorities, HUD provides rental assistance vouchers for privately owned housing to Veterans who are eligible for VA health care services and are experiencing homelessness. VA case managers may connect these Veterans with support services such as health care, mental health treatment and substance use counseling to help them in their recovery process and with their ability to maintain housing in the community.
                    </div>
                  </li>
                  <li>
                    <div>
                      <strong>Grant and Per Diem</strong>
                    </div>
                    <div>
                      Since 1994, the VA's Homeless Providers Grant and Per Diem Program (GPD) has offered Veterans Affairs Health Care for Homeless Veterans (HCHV) Programs to community agencies providing services to homeless Veterans. The purpose of GPD is to promote the development and provision of supportive housing and/or supportive services with the goal of helping homeless Veterans achieve residential stability, increase their skill levels and/or income, and obtain greater self-determination. In 2017, the VA designated several program types within GPD: Healthcare to Home, Low Barrier, Clinical, Bridge Housing and Service-Intensive Transitional Housing (SITH). Whereas most GPD programs provide short lengths of stay in transitional housing facilities and provide rapid connections to permanent housing, SITH provides up to 24 months of transitional housing in which homeless Veterans are actively working with the assistance of appropriate services and supports to achieve permanent housing. In Buncombe County, Veterans are offered a choice at identification as to whether a housing intervention or a Grant and Per Diem program meets their needs.
                    </div>
                  </li>
                </ul>
              </p>
            </div>
          </p>
        <div className="row">
          <div className="col-sm-12">
            <AreaChart data={chronicData} mainAxisDataKey="month" dataKeys={chronicKeys} altText={'Area chart of Chronic Homeless Veteran Program Assignments'} colorScheme="bright_colors" />
          </div>
        </div>
      </div>
    );
  }
}

const dataShape = {
  month: PropTypes.string,
  Unsheltered: PropTypes.number,
  'Emergency Shelter': PropTypes.number,
  'Emergency Shelter/Intake': PropTypes.number,
  Intake: PropTypes.number,
  Other: PropTypes.number,
  MIA: PropTypes.number,

};

HomelessnessVeteransChronicAssignments.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape(dataShape)),
  dataKeys: PropTypes.arrayOf(PropTypes.string),
  showingDefinitions: PropTypes.bool, // eslint-disable-line
};

HomelessnessVeteransChronicAssignments.defaultProps = {
  data: chronicData,
  dataKeys: chronicKeys,
  showingDefinitions: false,
};

export default HomelessnessVeteransChronicAssignments;
