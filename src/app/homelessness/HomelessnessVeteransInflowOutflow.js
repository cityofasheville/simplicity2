import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { colorSchemes } from '../../shared/visualization/colorSchemes';

const dataKeysArr = [
  'Incoming',
  //'Remaining to be housed',
  'Outgoing',
];

// todo get this data from graphql
const dataArr = [
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
  {
    month: '4/2017',
    Incoming: 34,
    'Remaining to be housed': 95,
    Outgoing: -28,
    'Net change': 6,
  },
  {
    month: '5/2017',
    Incoming: 28,
    'Remaining to be housed': 95,
    Outgoing: -31,
    'Net change': -3,
  },
  {
    month: '6/2017',
    Incoming: 38,
    'Remaining to be housed': 95,
    Outgoing: -20,
    'Net change': 18,
  },
  {
    month: '7/2017',
    Incoming: 37,
    'Remaining to be housed': 95,
    Outgoing: -43,
    'Net change': -6,
  },
  // { month: 4/2017, 'Remaining to be housed': 96, },
  // { month: 5/2017, 'Remaining to be housed': 99 },
];

const getLongDesc = (data, dataKeys, mainAxisKey) => (
  <div>
    {data.map((value, index) => (
      <div key={[value[mainAxisKey], index].join('_')}>
        <p>{value[mainAxisKey]}<br />
          {dataKeys.map(key => (
            <span key={[value[mainAxisKey], key].join('_')}>{key}: {value[key]}<br /></span>
          ))}
        </p>
      </div>
    ))}
  </div>
);

class HomelessnessVeteransInflowOutflow extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showingLongDesc: this.showLongDesc, showingDefinitions: this.showingDefinitions };
  }

  toggleLongDesc() {
    this.setState({
      showingLongDesc: !this.state.showingLongDesc,
    });
  }

  toggleDefinitions() {
    this.setState({
      showingDefinitions: !this.state.showingDefinitions,
    });
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-sm-12">
            <h4>Incoming and outgoing Veterans</h4>
            <div>
              There is an inflow and outflow of homeless Veterans in Buncombe County, and Veteran representation in the homeless community is considerably higher than other communities of similar size in the country. Our exceptional VA Medical Center, large service area and transitional housing availability contribute to this large number of homeless Veterans being attracted to this area. Each month homeless service providers identify new homeless Veterans in Buncombe County and each month various agencies assist homeless Veterans in exiting homelessness. An exit from homelessness in Buncombe County includes rental units, living with family and/or friends, long-term care facilities, and also leaving Buncombe County.
              <br />
                <a href="" className="text-center inText" onClick={(e) => { e.preventDefault(); this.toggleDefinitions() }}>
                  {this.state.showingDefinitions ? 'Hide' : 'Show'} Definition of Veteran
                </a>
                <div hidden={!this.state.showingDefinitions}>
                  <div>
                    <ul>
                      <li>
                        <div>
                          <strong>Veteran</strong>
                        </div>
                        <div>
                          The Veteran Health Administration classifies a homeless Veteran by the following: (1) An individual or family who lacks a fixed, regular, and adequate nighttime residence; (2) An individual or family with a primary nighttime residence that is a public or private place not designed for or ordinarily used as a regular sleeping accommodation for human beings, including a car, park, abandoned building, bus or train station, airport, or camping ground; (3) An individual or family living in a supervised publicly or privately operated shelter designated to provide temporary living arrangements (including hotels and motels paid for by Federal, state, or local government programs for low-income individuals or by charitable organizations, congregate shelters, and transitional housing); (4) An individual who resided in a shelter or place not meant for human habitation and who is exiting an institution where the individual temporarily resided; (5) An individual or family who: (a) Will imminently lose their housing, including housing they own, rent, or live in without paying rent, are sharing with others, and rooms in hotels or motels not paid for by Federal, state, or local government programs for low-income individuals or by charitable organizations, as evidenced by: 1. A court order resulting from an eviction action that notifies the individual or family that they must leave within 14 days; 2. The individual or family having a primary nighttime residence that is a room in a hotel or motel and where they lack the resources necessary to reside there for more than 14 days; or 3. Credible evidence indicating that the owner or renter of the housing will not allow the individual or family to stay for more than 14 days, and any oral statement from an individual or family seeking homeless assistance that is found to be credible shall be considered credible evidence for purposes of this clause if the Veteran (b) has no subsequent residence identified and/or (c) lacks the resources or support networks needed to obtain other permanent housing.<br /><br />

                          (6) Notwithstanding any other provision of this paragraph, VA shall consider to be homeless any individual or family who is fleeing, or is attempting to flee, domestic violence, dating violence, sexual assault, stalking, or other dangerous or life threatening conditions in the individual's or family's current housing situation, including where the health and safety of children are jeopardized, and who have no other residence and lack the resources or support networks to obtain other permanent housing.
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
            </div>
            <div style={{ height: 450 }}>
              <ResponsiveContainer>
                <ComposedChart data={this.props.data} barGap="-77%">
                  <XAxis dataKey="month" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  {this.props.dataKeys.map((barDataKey, i) => (
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
            <a href="" className="text-center inText" onClick={(e) => { e.preventDefault(); this.toggleLongDesc() }}>
              {this.state.showingLongDesc ? 'Hide' : 'Show'} Veteran homelessness Incoming and Outgoing bar chart summary
            </a>
            <div hidden={!this.state.showingLongDesc}>
              {getLongDesc(this.props.data, this.props.dataKeys, 'month')}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

const dataShape = {
  month: PropTypes.string,
  Incoming: PropTypes.number,
  Outgoing: PropTypes.number,
  'Net change': PropTypes.number,
};

HomelessnessVeteransInflowOutflow.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape(dataShape)),
  showLongDesc: PropTypes.bool, // eslint-disable-line
  dataKeys: PropTypes.arrayOf(PropTypes.string),
};

HomelessnessVeteransInflowOutflow.defaultProps = {
  showLongDesc: false,
  data: dataArr,
  dataKeys: dataKeysArr,
};

export default HomelessnessVeteransInflowOutflow;