/**
*
* GqlTest
*
*/

import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import TopicContainerPage from '../../../../containers/TopicContainerPage/topicContainerPage';
// I have no idea why ESLint is complaining about the following line, which seems to work.
require('./dashboard.css');

class DevelopmentSLADashboard extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      start: null,
      end: null,
      commercial: true,
      residential: true,
      slaToggles: [
        { name: '1', show: true },
        { name: '3', show: true },
        { name: '10', show: true },
        { name: '21', show: true },
        { name: '30', show: true },
        { name: '45', show: true },
        { name: '90', show: true },
        { name: 'None', show: true },
      ],
      slaIndex: {
        1: 0,
        3: 1,
        10: 2,
        21: 3,
        30: 4,
        45: 5,
        90: 6,
        None: 7,
      },
    };
  }

  inDateRange(inDate) {
    let inRange = true;
    const date = new Date(inDate).getTime();
    if ((this.state.start && date < this.state.start.getTime()) ||
        (this.state.end && date > this.state.end.getTime())) {
      inRange = false;
    }
    return inRange;
  }

  stats(permits, cFields) {
    const slaToggles = this.state.slaToggles;
    const slaIndex = this.state.slaIndex;
    const counters = {};
    this.total = 0;
    cFields.forEach((field) => {
      counters[field] = {};
    });
    permits.forEach((permit) => {
      if (this.inDateRange(permit.app_date)) {
        let included = true;
        const sla = (permit.sla === -1) ? 'None' : permit.sla;
        if (!slaToggles[slaIndex[sla]].show) included = false;
        if (!((permit.type === 'Commercial' && this.state.commercial) ||
              (permit.type === 'Residential' && this.state.residential))) {
          included = false;
        }
        if (included) {
          ++this.total;
          for (let i = 0; i < cFields.length; ++i) {
            const field = cFields[i];
            const c = permit[field];
            if (!(c in counters[field])) counters[field][c] = 0;
            ++counters[field][c];
          }
        }
      }
    });
    return counters;
  }

  dateString(date) {
    let month = `${date.getMonth() + 1}`;
    let day = `${date.getDate()}`;
    if (month.length === 1) month = `0${month}`;
    if (day.length === 1) day = `0${day}`;
    return `${date.getFullYear()}-${month}-${day}`;
  }

  updateDateRange() {
    let start = null;
    let end = null;
    if (this.startInput.value.trim().length > 0) {
      try {
        let date = `${new Date(this.startInput.value.trim())} 00:00:00`;
        if (!isNaN(date.getMonth())) {
          start = date;
          this.startInput.value = this.dateString(date);
        }
        date = `${new Date(this.endInput.value.trim())} 00:00:00`;
        if (!isNaN(date.getMonth())) {
          end = date;
          this.endInput.value = this.dateString(date);
        }
      } catch (e) {
        throw new Error(`Error parsing date: ${JSON.stringify(e)}`);
      }
      this.setState({ start, end });
    }
  }

  checkType(e) {
    if (e.target.id.startsWith('commercial')) {
      this.setState({ commercial: !this.state.commercial });
    } else if (e.target.id.startsWith('residential')) {
      this.setState({ residential: !this.state.residential });
    } else if (e.target.id.startsWith('slatoggle')) {
      const sla = e.target.id.substring(10);
      const slaToggles = [].concat(this.state.slaToggles);
      let idx = -1;
      for (let i = 0; i < slaToggles.length; ++i) {
        if (sla === slaToggles[i].name) {
          idx = i;
          break;
        }
      }

      if (idx >= 0) {
        slaToggles[idx].show = !slaToggles[idx].show;
        this.setState({ slaToggles });
      }
    }
  }

  render() {
    let counters = {};
    this.total = 0;

    if (!this.props.data.loading) {
      counters = this.stats(this.props.data.permits, ['type', 'subtype', 'sla']);
    }
    const boundUpdateDateRange = this.updateDateRange.bind(this); // eslint-disable-line react/jsx-no-bind
    const boundCheck = this.checkType.bind(this); // eslint-disable-line react/jsx-no-bind
    return (
      <TopicContainerPage>
        <div>
          <div id="date-inputs" style={{ marginBottom: '15px' }}>
            <label htmlFor="startdate">Start Date: </label>
            <input ref={(input) => { this.startInput = input; }} defaultValue="" name="startdate" />
            <label htmlFor="enddate">End Date: </label>
            <input id="end-date" ref={(input) => { this.endInput = input; }} defaultValue="" name="enddate" />
            <input type="button" value="Update Date Range" onClick={boundUpdateDateRange} />
          </div>
          <div id="type-inputs" style={{ marginBottom: '15px' }}>
            <label htmlFor="commtoggle">Commercial: </label>
            <input type="checkbox" name="commtoggle" id="commercial-toggle" checked={this.state.commercial} onChange={boundCheck} />
            <label htmlFor="restoggle">Residential: </label>
            <input type="checkbox" name="restoggle" id="residential-toggle" checked={this.state.residential} onChange={boundCheck} />
          </div>
          <div id="sla-inputs" style={{ marginBottom: '15px', marginLeft: '15px' }}>
            <b>SLAs: </b>&nbsp;
            {this.state.slaToggles.map((sla, idx) =>
              <span key={`sla-toggle-${idx}`}>
                <label htmlFor={`slacheck${idx}`}>{sla.name} </label>
                <input
                  type="checkbox"
                  name={`slacheck${idx}`}
                  id={`slatoggle-${sla.name}`}
                  checked={sla.show}
                  onChange={boundCheck}
                />
              </span>
            )}
          </div>

        </div>
        <div>
          <br />
          <p><b>Total Permits:</b> {this.total}</p>
          <p><span>&nbsp;&nbsp;&nbsp;</span><b>Commercial:</b> {counters.type ? counters.type.Commercial : 0}</p>
          <p><span>&nbsp;&nbsp;&nbsp;</span><b>Residential:</b> {counters.type ? counters.type.Residential : 0}</p>
          <br />
        </div>
        <div id="full-period-stats">
          Full period stats:
          <br />
          {JSON.stringify(counters)}
        </div>
        <div id="performance-over-time">
          Performance over time
        </div>
      </TopicContainerPage>
    );
  }
}

DevelopmentSLADashboard.propTypes = {
  data: React.PropTypes.object,
  dispatch: React.PropTypes.func,
};

const myQuery = gql`
  query {
    permits {
      permit_id
      type
      subtype
      category
      app_date
      app_status
      app_status_date
      ntrips
      violation
      violation_count
      violation_days
      sla
      building
      fire
      zoning
      addressing
      trips {
        trip
        start_date
        end_date
        due_date
        trip_violation_days
        trip_sla
        division
      }
    }
  }
`;

export default graphql(myQuery)(DevelopmentSLADashboard);
