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

const chronicKeys = [
  'Unassigned',
  'SSVF',
  'HUD-VASH',
  'GPD',
  'SITH',
];

const chronicData = [
  {
    month: '05/2016',
    SSVF: 3,
    'HUD-VASH': 11,
    GPD: 26,
  },
  {
    month: '08/2016',
    Unassigned: 1,
    SSVF: 3,
    'HUD-VASH': 11,
    GPD: 22,
  },
  {
    month: '09/2016',
    Unassigned: 1,
    SSVF: 4,
    'HUD-VASH': 10,
    SITH: 18,
  },
  {
    month: '12/2016',
    Unassigned: 2,
    SSVF: 5,
    'HUD-VASH': 10,
    SITH: 28,
  },
  {
    month: '02/2017',
    Unassigned: 2,
    SSVF: 7,
    'HUD-VASH': 10,
    SITH: 33,
  },
  {
    month: '03/2017',
    Unassigned: 1,
    SSVF: 5,
    'HUD-VASH': 10,
    SITH: 35,
  },
  {
    month: '04/2017',
    Unassigned: 1,
    SSVF: 4,
    'HUD-VASH': 0,
    SITH: 34,
  }
];

const programKeys = [
  "Unsheltered",
  "Emergency Shelter",
  "Intake",
  "Other",
  "MIA",
]

const programData = [
  {
    month: '05/2016',
    Unsheltered: 54,
    'Emergency Shelter': 15,
    Other: 36,
    GPD: 180,
  },
  {
    month: '08/2016',
    Unsheltered: 177,
    'Emergency Shelter': 9,
    Other: 5,
    MIA: 23,
  },
  {
    month: '09/2016',
    Unsheltered: 183,
    'Emergency Shelter': 11,
    Other: 6,
    MIA: 19,
    GPD: 49,
  },
  {
    month: '12/2016',
    Unsheltered: 21,
    'ES/Intake': 21,
    Other: 10,
    MIA: 16,
    GPD: 175,
  },
  {
    month: '02/2017',
    Unsheltered: 25,
    'ES/Intake': 28,
    Other: 12,
    MIA: 8,
    GPD: 175,
  },
  {
    month: '03/2017',
    Unsheltered: 23,
    'ES/Intake': 25,
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
]

const HomelessnessVeterans = (props) => (
  <div>
    <PageHeader h1="Ending Veteran Homelessness" dataLinkPath="/homelessness/data" externalLink="http://www.ashevillenc.gov/civicax/filebank/blobdload.aspx?blobid=27777" externalLinkText="Five Year Strategic Plan on Homelessness in Buncombe County" icon={<Icon path={IM_BED} size={50} />}>
      <ButtonGroup>
        <LinkButton pathname="/homelessness" query={{ entity: props.location.query.entity, id: props.location.query.id, label: props.location.query.label, hideNavbar: props.location.query.hideNavbar }} positionInGroup="left">Summary</LinkButton>
        <LinkButton pathname="/homelessness/veterans" query={{ entity: props.location.query.entity, id: props.location.query.id, label: props.location.query.label, hideNavbar: props.location.query.hideNavbar }} positionInGroup="right" active>Veterans</LinkButton>
      </ButtonGroup>
    </PageHeader>
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
    <div className="row">
      <div className="col-sm-12">
        <AreaChartContainer chartTitle="Housing program enrollments: Veterans" data={programData} mainAxisDataKey="month" dataKeys={programKeys} altText={'Area chart of Veteran housing enrollments'} colorScheme="bright_colors_2" />
      </div>
    </div>
    <hr />
    <div className="row">
      <div className="col-sm-12">
        <AreaChartContainer chartTitle="Chronic Homeless Veteran Program Assignments" data={chronicData} mainAxisDataKey="month" dataKeys={chronicKeys} altText={'Area chart of Chronic Homeless Veteran Program Assignments'} colorScheme="bright_colors" />
      </div>
    </div>        
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
