import React from 'react';
import PropTypes from 'prop-types';
import BarChartContainer from '../../shared/visualization/BarChartContainer';
import AreaChartContainer from '../../shared/visualization/AreaChartContainer';
import PageHeader from '../../shared/PageHeader';
import ButtonGroup from '../../shared/ButtonGroup';
import LinkButton from '../../shared/LinkButton';
import AreaChart from '../../shared/visualization/AreaChart';
import Icon from '../../shared/Icon';
import { IM_BED } from '../../shared/iconConstants';
import HomelessnessVeteransInflowOutflow from './HomelessnessVeteransInflowOutflow';
import HomelessnessVeteransExitTime from './HomelessnessVeteransExitTime';
import HomelessnessVeteransEnrollment from './HomelessnessVeteransEnrollment';
import HomelessnessVeteransChronicAssignments from './HomelessnessVeteransChronicAssignments';

const dataKeys = [
  'Incoming',
  //'Remaining to be housed',
  'Outgoing',
];

// todo get this data from graphql
const data = [
  {
    month: '4/2016',
    Incoming: 40,
    'Remaining to be housed': 103,
    Outgoing: -27,
    'Net change': 13,
  },
  {
    month: '5/2016',
    Incoming: 45,
    'Remaining to be housed': 124,
    Outgoing: -30,
    'Net change': 5,
  },
  {
    month: '6/2016',
    Incoming: 42,
    'Remaining to be housed': 126,
    Outgoing: -44,
    'Net change': -2,
  },
  {
    month: '7/2016',
    Incoming: 32,
    'Remaining to be housed': 117,
    Outgoing: -31,
    'Net change': 1,
  },
  {
    month: '8/2016',
    Incoming: 35,
    'Remaining to be housed': 112,
    Outgoing: -33,
    'Net change': 2,
  },
  {
    month: '9/2016',
    Incoming: 38,
    'Remaining to be housed': 105,
    Outgoing: -35,
    'Net change': 3,
  },
  {
    month: '10/2016',
    Incoming: 40,
    'Remaining to be housed': 108,
    Outgoing: -41,
    'Net change': -1,
  },
  {
    month: '11/2016',
    Incoming: 39,
    'Remaining to be housed': 105,
    Outgoing: -50,
    'Net change': -11,
  },
  {
    month: '12/2016',
    Incoming: 32,
    'Remaining to be housed': 84,
    Outgoing: -37,
    'Net change': -5,
  },
  {
    month: '1/2017',
    Incoming: 35,
    'Remaining to be housed': 100,
    Outgoing: -31,
    'Net change': 4,
  },
  {
    month: '2/2017',
    Incoming: 25,
    'Remaining to be housed': 89,
    Outgoing: -41,
    'Net change': -16,
  },
  {
    month: '3/2017',
    Incoming: 30,
    'Remaining to be housed': 95,
    Outgoing: -24,
    'Net change': 6,
  },
  // { month: 4/2017, 'Remaining to be housed': 96, },
  // { month: 5/2017, 'Remaining to be housed': 99 },
];

const HomelessnessVeterans = (props) => (
  <div>
    <PageHeader h1="Ending Veteran Homelessness" dataLinkPath="/homelessness/data" externalLink="http://www.ashevillenc.gov/civicax/filebank/blobdload.aspx?blobid=27777" externalLinkText="Five Year Strategic Plan on Homelessness in Buncombe County" icon={<Icon path={IM_BED} size={50} />}>
      <ButtonGroup>
        <LinkButton pathname="/homelessness" query={{ entity: props.location.query.entity, id: props.location.query.id, label: props.location.query.label, hideNavbar: props.location.query.hideNavbar }} positionInGroup="left">Overview</LinkButton>
        <LinkButton pathname="/homelessness/veterans" query={{ entity: props.location.query.entity, id: props.location.query.id, label: props.location.query.label, hideNavbar: props.location.query.hideNavbar }} positionInGroup="right" active>Veterans</LinkButton>
      </ButtonGroup>
    </PageHeader>
    <div className="row" style={{ marginTop: '15px' }}>
      <div className="col-sm-12">
        <a href="http://www.nc211.org" title="NC 211 homelessness resourses" target="_blank">
          <div className="alert alert-warning" style={{ marginBottom: '0px' }}>
            Are you homeless? Do you need help finding housing? Click here for resources.
          </div>
        </a>
      </div>
    </div>
    <div className="row">
      <div className="col-sm-12">
        <h3>How are homeless Veterans being helped?</h3>
        <p>
          Buncombe County is comprised of many agencies and organizations assisting and serving our Veteran homeless population in conjunction with the VA Medical Center. Outreach specialists identify areas throughout the community where homeless Veterans congregate and camp. Veterans are identified and assessed using a standardized vulnerability index tool to help identify the most appropriate housing intervention available for that Veteran. Agency representatives meet weekly to review referrals and ensure that every eligible homeless Veteran is matched with an appropriate housing intervention. Homeless military Veterans of low and extremely low income in Buncombe County are eligible for case management, service referral or may receive housing assistance through VA funded programs. 
        </p>
      </div>
    </div>
    <HomelessnessVeteransInflowOutflow />
    <hr />
    <HomelessnessVeteransExitTime />
    <hr />
    <HomelessnessVeteransEnrollment />
    <hr />
    <HomelessnessVeteransChronicAssignments />
  </div>
);

HomelessnessVeterans.propTypes = {
  showLongDesc: PropTypes.bool, // eslint-disable-line
  location: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

HomelessnessVeterans.defaultProps = {
  showLongDesc: false,
};

export default HomelessnessVeterans;
