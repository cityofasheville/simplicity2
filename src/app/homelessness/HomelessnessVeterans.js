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
  'Declining',
  'SSVF',
  'HUD-VASH',
  'Grant & Per Diem',
];

const chronicData = [
  {
    month: '05/2016',
    SSVF: 3,
    'HUD-VASH': 11,
    'Grant & Per Diem': 26,
  },
  {
    month: '07/2016',
    Declining: 1,
    SSVF: 1,
    'HUD-VASH': 11,
    'Grant & Per Diem': 22,
  },
  {
    month: '08/2016',
    Declining: 1,
    SSVF: 3,
    'HUD-VASH': 11,
    'Grant & Per Diem': 22,
  },
  {
    month: '09/2016',
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
    month: '01/2017',
    Declining: 2,
    SSVF: 2,
    'HUD-VASH': 10,
    'Grant & Per Diem': 38,
  },
  {
    month: '02/2017',
    Declining: 2,
    SSVF: 7,
    'HUD-VASH': 10,
    'Grant & Per Diem': 33,
  },
  {
    month: '03/2017',
    Declining: 1,
    SSVF: 5,
    'HUD-VASH': 10,
    'Grant & Per Diem': 35,
  },
  {
    month: '04/2017',
    Declining: 1,
    SSVF: 4,
    'HUD-VASH': 0,
    'Grant & Per Diem': 34,
  },
  {
    month: '05/2017',
    Declining: 2,
    SSVF: 4,
    'HUD-VASH': 0,
    'Grant & Per Diem': 34,
  },
];

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
    <hr />
    <div className="row">
      <div className="col-sm-12">
        <p><strong>Definitions:</strong><br />
          <ul>
            <li>HUD-VASH:<br /> A collaborative program between Housing and Urban Development (HUD) and the VA which combines HUD housing vouchers with VA supportive services to help Veterans who are homeless and their families find and sustain permanent housing. Through public housing authorities, HUD provides rental assistance vouchers for privately owned housing to Veterans who are eligible for VA health care services and are experiencing homelessness. VA case managers may connect these Veterans with support services such as health care, mental health treatment and substance use counseling to help them in their recovery process and with their ability to maintain housing in the community.<br /><br /></li>

            <li>Grant and Per Diem:<br /> Since 1994, the VA's Homeless Providers Grant and Per Diem Program (GPD) has offered Veterans Affairs Health Care for Homeless Veterans (HCHV) Programs to community agencies providing services to homeless Veterans. The purpose of GPD is to promote the development and provision of supportive housing and/or supportive services with the goal of helping homeless Veterans achieve residential stability, increase their skill levels and/or income, and obtain greater self-determination. In 2017, the VA designated several program types within GPD: Healthcare to Home, Low Barrier, Clinical, Bridge Housing and Service-Intensive Transitional Housing (SITH). Whereas most GPD programs provide short lengths of stay in transitional housing facilities and provide rapid connections to permanent housing, SITH provides up to 24 months of transitional housing in which homeless Veterans are actively working with the assistance of appropriate services and supports to achieve permanent housing. In Buncombe County, Veterans are offered a choice at identification as to whether a housing intervention of SITH meets their needs.<br /><br /></li> 
            <li>Supportive Services for Veteran Families (SSVF): <br />The Veteran Administration offers community-based grants through the Supportive Services for Veteran Families (SSVF) Program, which provides supportive services to very low-income Veteran families in or transitioning to permanent housing.  Funds are granted to private non-profit organizations and consumer cooperatives who assist very low-income Veteran families by providing a range of supportive services designed to promote housing stability.  Grantees provide eligible Veteran families with outreach, case management, and assistance in obtaining VA and other benefits to support housing stability.</li>
          </ul>
        </p>
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
