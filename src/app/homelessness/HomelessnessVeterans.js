import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import BarChartContainer from '../../shared/visualization/BarChartContainer';
import { colorSchemes } from '../../shared/visualization/colorSchemes';
import InflowOutflowAnimation from '../../shared/visualization/InflowOutflowAnimation';

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
    'Remaining to be housed': 213,
    Outgoing: -27,
    'Net change': 13,
  },
  {
    month: '5/2016',
    Incoming: 45,
    'Remaining to be housed': 218,
    Outgoing: -30,
    'Net change': 5,
  },
  {
    month: '6/2016',
    Incoming: 42,
    'Remaining to be housed': 216,
    Outgoing: -44,
    'Net change': -2,
  },
  {
    month: '7/2016',
    Incoming: 32,
    'Remaining to be housed': 217,
    Outgoing: -31,
    'Net change': 1,
  },
  {
    month: '8/2016',
    Incoming: 35,
    'Remaining to be housed': 219,
    Outgoing: -33,
    'Net change': 2,
  },
  {
    month: '9/2016',
    Incoming: 38,
    'Remaining to be housed': 221,
    Outgoing: -35,
    'Net change': 3,
  },
  {
    month: '10/2016',
    Incoming: 40,
    'Remaining to be housed': 220,
    Outgoing: -41,
    'Net change': -1,
  },
  {
    month: '11/2016',
    Incoming: 39,
    'Remaining to be housed': 209,
    Outgoing: -50,
    'Net change': -11,
  },
  {
    month: '12/2016',
    Incoming: 32,
    'Remaining to be housed': 204,
    Outgoing: -37,
    'Net change': -5,
  },
  {
    month: '1/2017',
    Incoming: 35,
    'Remaining to be housed': 208,
    Outgoing: -31,
    'Net change': 4,
  },
  {
    month: '2/2017',
    Incoming: 25,
    'Remaining to be housed': 192,
    Outgoing: -41,
    'Net change': -16,
  },
  {
    month: '3/2017',
    Incoming: 30,
    'Remaining to be housed': 198,
    Outgoing: -24,
    'Net change': 6,
  },
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
        <div className="row">
          <div className="col-sm-12">
            <h1>
              <div className="btn-group pull-right" style={{ marginLeft: '10px' }}>
                <Link to={{ pathname: '/homelessness', query: { entity: this.props.location.query.entity, id: this.props.location.query.id, label: this.props.location.query.label, hideNavbar: this.props.location.query.hideNavbar } }}>
                  <button className="btn btn-primary" style={{ borderTopRightRadius: '0px', borderBottomRightRadius: '0px' }}>Summary</button>
                </Link>
                <Link to={{ pathname: '/homelessness/veterans', query: { entity: this.props.location.query.entity, id: this.props.location.query.id, label: this.props.location.query.label, hideNavbar: this.props.location.query.hideNavbar } }}>
                  <button className="btn btn-primary active" style={{ borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px', borderTopRightRadius: '0px', borderBottomRightRadius: '0px' }}>Veterans</button>
                </Link>
                <Link to={{ pathname: '/homelessness/details', query: { entity: this.props.location.query.entity, id: this.props.location.query.id, label: this.props.location.query.label, hideNavbar: this.props.location.query.hideNavbar } }}>
                  <button className="btn btn-primary" style={{ borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px' }}>Details</button>
                </Link>
              </div>
              Ending Veteran Homelessness
            </h1>
            <div className="pull-left">
              <a className="inText" href="http://www.ashevillenc.gov/civicax/filebank/blobdload.aspx?blobid=27777" target="_blank">Five year strategic plan on homelessness in Buncombe county</a>
            </div>
          </div>
        </div>
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
            <h4>Incoming and outgoing veterans</h4>
            <p>
              Every month, a new group of veterans come into services while others exit. More explanation here.
            </p>
            <div style={{ height: 450 }}>
              <ResponsiveContainer>
                <ComposedChart data={this.props.summaryData} barGap="-77%">
                  <XAxis dataKey="month" />
                  <YAxis domain={['datamin', 200]} />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  {dataKeys.map((barDataKey, i) => (
                    <Bar key={barDataKey} dataKey={barDataKey} fill={colorSchemes.pink_green_diverging[i % colorSchemes.pink_green_diverging.length]} animationDuration={50} />
                  ))}
                  <Line dataKey="Remaining to be housed" stroke="blue" dot={{ stroke: 'blue', strokeWidth: 3 }} fill="white" />
                  <Line dataKey="Net change" stroke="black" fill="white" dot={{ stroke: 'black', strokeWidth: 3 }} />
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
            <p>Some intro text here about the 90 days and functional zero goal.</p>
            <BarChartContainer layout="vertical" barGap={0} chartTitle="Average days from identification to positive exit" chartText="Brief chart explanation here" mainAxisDataKey="month" dataKeys={this.props.daysToExitKeys} colorScheme="purple_green_diverging" data={this.props.daysToExitData} altText="Bar chart of average days from identification to positive exit" />
            {/*<InflowOutflowAnimation value={50} riseAnimation />*/}
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
