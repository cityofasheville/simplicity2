import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import BarChartContainer from '../../shared/visualization/BarChartContainer';
import { colorSchemes } from '../../shared/visualization/colorSchemes';
import PageHeader from '../../shared/PageHeader';
import ButtonGroup from '../../shared/ButtonGroup';
import LinkButton from '../../shared/LinkButton';
import AreaChart from '../../shared/visualization/AreaChart';

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

const days_exit_keys = [
  'Non-SITH',
  'SITH',
];

const days_exit_data = [
  {
    month: '02/2017',
    'Non-SITH': 124,
    SITH: 366,
  },
  {
    month: '03/2017',
    'Non-SITH': 101,
    SITH: 279,
  },
  {
    month: '04/2017',
    'Non-SITH': 136,
    SITH: 332,
  },
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
        <PageHeader h1="Ending Veteran Homelessness" dataLinkPath="/homelessness/data" externalLink="http://www.ashevillenc.gov/civicax/filebank/blobdload.aspx?blobid=27777" externalLinkText="Five year strategic plan on homelessness in Buncombe county">
          <ButtonGroup>
            <LinkButton pathname="/homelessness" query={{ entity: this.props.location.query.entity, id: this.props.location.query.id, label: this.props.location.query.label, hideNavbar: this.props.location.query.hideNavbar }} positionInGroup="left">Summary</LinkButton>
            <LinkButton pathname="/homelessness/veterans" query={{ entity: this.props.location.query.entity, id: this.props.location.query.id, label: this.props.location.query.label, hideNavbar: this.props.location.query.hideNavbar }} positionInGroup="right" active>Veterans</LinkButton>
          </ButtonGroup>
        </PageHeader>
        <div className="row">
          <div className="col-sm-12">
            <h3>How are homeless veterans being helped?</h3>
            <p>
              Briefly explain how homeless veterans are identified and what the help is that they are able to receive.
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <h4>Incoming and outgoing Veterans</h4>
            <p>
              Every month, a new group of Veterans come into services while others exit. More explanation here.
            </p>
            <div style={{ height: 450 }}>
              <ResponsiveContainer>
                <ComposedChart data={this.props.summaryData} barGap="-77%">
                  <XAxis dataKey="month" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  {dataKeys.map((barDataKey, i) => (
                    <Bar key={barDataKey} dataKey={barDataKey} fill={colorSchemes.bright_colors_2[i % colorSchemes.pink_green_diverging.length]} animationDuration={50} />
                  ))}
                  <Line dataKey="Net change" stroke="black" fill="white" strokeWidth={3} dot={{ stroke: 'black', strokeWidth: 5, r: 5 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-10 col-xs-offset-2">
            <br />
            <a href="javascript:void(0);" className="text-center inText" onClick={() => this.toggleLongDesc()}>
              {this.state.showingLongDesc ? 'Hide' : 'Show'} Veteran homelessness Incoming and Outgoing bar chart summary
            </a>
            <div hidden={!this.state.showingLongDesc}>
              {getLongDesc(this.props.summaryData)}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <hr />
            <h3>How long does it take to house veterans?</h3>
            <p>The City of Asheville and Buncombe County are striving to achieve &quot;functional zero&quot; for veteran homelessness, as defined for NC 501, Asheville-Buncombe Continuum of Care. Functional zero would be achieved when every newly identified homeless Veteran in Asheville-Buncombe is connected with an appropriate housing intervention within 30 days and is permanently housed within 90 days after signing a Declaration of Housing Preference form, unless the Veteran elects to enter a long term service intensive transitional housing program (SITH). We connect newly identified homeless Veterans who wish to be connected with a housing intervention within two weeks. The below charts show how many days to positive exit from homelessness.</p>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <BarChartContainer layout="vertical" chartTitle="Average days from identification to positive exit: non-SITH" mainAxisDataKey="month" dataKeys={['Non-SITH']} colorScheme="bright_colors" data={this.props.daysToExitData} altText="Bar chart of average days from identification to positive exit: non-SITH" domain={[0, 380]} referenceLine referenceX={90} referenceLineLabel="90 days" margin={{ top: 15, left: 10, right: 0, bottom: 0 }}/>
            {/*<InflowOutflowAnimation value={50} riseAnimation />*/}
          </div>
          <div className="col-sm-6">
            <BarChartContainer layout="vertical" chartTitle="Average days from identification to positive exit: SITH" mainAxisDataKey="month" dataKeys={['SITH']} colorScheme="bright_colors_2" data={this.props.daysToExitData} altText="Bar chart of average days from identification to positive exit: SITH" />
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-sm-12">
            <h3>Housing program enrollments: Veterans</h3>
            <p>Put in area chart</p>
            <AreaChart data={programData} mainAxisDataKey="month" dataKeys={programKeys} altText={'Area chart of Veteran housing enrollments'} colorScheme="bright_colors_2" />
          </div>
        </div>
      </div>
    );
  }
}

const dataShape = {
  month: PropTypes.string,
  Incoming: PropTypes.number,
  Remaining: PropTypes.number,
  Outgoing: PropTypes.number,
  'Net change': PropTypes.number,
};

const daysToExitDataShape = {
  month: PropTypes.string,
  'Non-SITH': PropTypes.number,
  SITH: PropTypes.number,
};

HomelessnessVeterans.propTypes = {
  summaryData: PropTypes.arrayOf(PropTypes.shape(dataShape)),
  daysToExitData: PropTypes.arrayOf(PropTypes.shape(daysToExitDataShape)),
  daysToExitKeys: PropTypes.arrayOf(PropTypes.string),
  showLongDesc: PropTypes.bool, // eslint-disable-line
  location: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

HomelessnessVeterans.defaultProps = {
  summaryData: data,
  daysToExitData: days_exit_data,
  daysToExitKeys: days_exit_keys,
  showLongDesc: false,
};

export default HomelessnessVeterans;
