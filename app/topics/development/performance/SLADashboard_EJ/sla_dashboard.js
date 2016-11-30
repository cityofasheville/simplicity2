import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import TopicContainerPage from '../../../../containers/TopicContainerPage/topicContainerPage';
import PieChart from '../../../../components/PieChart/pieChart';
import BarChart from '../../../../components/BarChart/barChart';
import Statistics from './statistics';
import CounterSet from './counterset';
import TimeSeriesSet from './timeseriesset';

import './dashboard.css';

class DevelopmentSLADashboard extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      start: null,
      end: null,
      commercial: true,
      residential: true,
      timeBy: 'week', // options: month, week, day-of-week
      timeFor: 'permits', // permits, violations, reviews
      slaMap: { 1: true, 3: true, 10: true, 21: true, 30: true, 45: true, 90: true, '-1': true },
    };
    this.updateDateRange = this.updateDateRange.bind(this);
    this.checkType = this.checkType.bind(this); // eslint-disable-line react/jsx-no-bind
    this.handleTimeBy = this.handleTimeBy.bind(this);
    this.handleTimeFor = this.handleTimeFor.bind(this);
  }

  // Returns the ISO week of the date. From https://weeknumber.net/how-to/javascript
  getWeek(dd) {
    const date = new Date(dd.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7); // eslint-disable-line no-mixed-operators
    // January 4 is always in week 1.
    const week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 // eslint-disable-line no-mixed-operators
                          - 3 + (week1.getDay() + 6) % 7) / 7); // eslint-disable-line no-mixed-operators
  }

  // Returns the four-digit year corresponding to the ISO week of the date.
  getWeekYear(dd) {
    const date = new Date(dd.getTime());
    date.setDate((date.getDate() + 3) - (date.getDay() + 6) % 7); // eslint-disable-line no-mixed-operators
    return date.getFullYear();
  }

  dateIndex(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let idx = null;
    if (this.state.timeBy === 'month') {
      const m = date.getMonth();
      idx = { index: m, value: months[m] };
    } else if (this.state.timeBy === 'week') {
      const week = this.getWeek(date);
      const dd = new Date(date.getTime());
      dd.setHours(0, 0, 0, 0);
      // Adding 4 to date to get the Friday, not the Monday
      dd.setDate(dd.getDate() - (dd.getDay() + 6) % 7 + 4); // eslint-disable-line no-mixed-operators
      idx = { index: week, value: months[dd.getMonth()] };
    } else if (this.state.timeBy === 'day-of-week') {
      const day = date.getDay();
      idx = { index: day, value: days[day] };
    }
    return idx;
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
        let date = new Date(`${this.startInput.value.trim()} 00:00:00`);
        if (!isNaN(date.getMonth())) {
          start = date;
          this.startInput.value = this.dateString(date);
        }
        date = new Date(`${this.endInput.value.trim()} 00:00:00`);
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
    } else if (e.target.id.startsWith('sla-map')) {
      const sla = e.target.id.substring(8);
      const slaMap = { ...this.state.slaMap };
      slaMap[sla] = !slaMap[sla];
      this.setState({ slaMap });
    }
  }

  handleTimeBy(e) {
    this.setState({ timeBy: e.target.value });
  }

  handleTimeFor(e) {
    this.setState({ timeFor: e.target.value });
  }

  badge(description, value, min = null, max = null) {
    let divStyle = {
      borderStyle: 'solid',
      borderRadius: '5px',
      borderWidth: 'thick',
      width: '200px',
      textAlign: 'center',
      display: 'inline-block',
      padding: '5px',
      marginLeft: '15px',
      marginRight: '5px',
    };
    let minStyle = {
      fontSize: 'medium',
      fontWeight: 'bold',
      marginRight: '25px',
    };
    let maxStyle = {
      fontSize: 'medium',
      fontWeight: 'bold',
      marginLeft: '25px',
    };
    let mainStyle = {
      fontSize: 'x-large',
      fontWeight: 'bold',
    };
    let minSpan = <span style={minStyle}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>;
    let maxSpan = <span style={maxStyle}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>;
    if (min) {
      minSpan = <span style={minStyle}>{min}</span>;
    }
    if (max) {
      maxSpan = <span style={maxStyle}>{max}</span>;
    }
    return (
      <div className="badge" style={divStyle}>
        <div>
          {minSpan}
          <span style={mainStyle}>{`${value}`}</span>
          {maxSpan}
        </div>
        <div>
          <span style={{ fontWeight: 'bold' }}>{description}</span>
        </div>
      </div>
    );
  }

  pieChart(data, title) {
    const pieStyle = {
      width: '33%',
      display: 'inline-block',
    };
    if (data) return <div style={pieStyle}><PieChart data={data} title={title} /></div>;
    return '';
  }

  barChart(data, labels, title) {
    if (data) return <BarChart data={data} labels={labels} title={title} />;
    return '';
  }

  createTimeTitle() {
    switch (this.state.timeFor) {
      case 'permits':
        return 'Permits Filed By Application Date';
      case 'violations':
        return 'Permit SLA Failures By Application Date';
      case 'reviews':
        return 'Review SLA Failures By Review Start Date';
      default:
        return 'Unknown';
    }
  }

  timeStats(permit, timeSeries, counters) {
    let idx = this.dateIndex(new Date(permit.app_date));
    counters.incrementCounter('totalPermits');

    timeSeries.addTimePoint('permits', idx.index, idx.value);

    if (permit.violation) {
      counters.incrementCounter('permitsWithViolations');
      counters.incrementCounter('totalViolations', permit.violation_count);
      timeSeries.addTimePoint('violations', idx.index, idx.value);

      if (permit.trips && permit.trips.length > 0) {
        permit.trips.forEach((trip) => {
          if (trip.trip_violation_days > 0) {
            counters.incrementCounter('daysLate', trip.trip_violation_days);
            idx = this.dateIndex(new Date(trip.start_date));
            timeSeries.addTimePoint('reviews', idx.index, idx.value);
          }
        });
      }
    }
  }

  render() {
    let stats = {
      permitsWithViolations: 0,
      totalViolations: 0,
      totalPermits: 0,
      daysLate: [0, 0, 0],
      timeStats: {
        permits: {
          data: [],
          labels: [],
        },
        violations: {
          data: [],
          labels: [],
        },
        reviews: {
          data: [],
          labels: [],
        },
      },
    };

    let pctFailures = 0;
    let categoryCounts = { type: null, subtype: null, sla: null };
    const counters = new CounterSet(['totalPermits', 'permitsWithViolations', 'totalViolations',
                                      { type: 'full', name: 'daysLate' }]);
    const timeSeries = new TimeSeriesSet(['permits', 'violations', 'reviews']);

    if (!this.props.data.loading) {
      const filters = [
        { type: 'date_range', field: 'app_date', values: [this.state.start, this.state.end] },
        { type: 'truthy_in_set', field: 'type', values: { Commercial: this.state.commercial, Residential: this.state.residential } },
        { type: 'truthy_in_set', field: 'sla', values: this.state.slaMap },
      ];
      // Filter the permits
      const permits = Statistics.filter(this.props.data.permits, filters);
      // Process to get timeseries and counters
      permits.forEach((permit) => this.timeStats(permit, timeSeries, counters));
      timeSeries.finalizeSeries();
      counters.finalizeCounter('daysLate');
      // Process to get category counts
      categoryCounts = Statistics.categoryCounts(permits, ['type', 'subtype', 'sla']);
      stats = { counters, timeSeries, categoryCounts };

      if (counters.getValue('permitsWithViolations') > 0) {
        pctFailures = ((100 * counters.getValue('permitsWithViolations')) /
                        counters.getValue('totalPermits')).toFixed(0);
      }
      if (counters.permitsWithViolations > 0) {
        pctFailures = ((100 * stats.permitsWithViolations) / (stats.totalPermits)).toFixed(0);
      }
    }
    const timeTitle = this.createTimeTitle();
    const timeData = timeSeries.getSeriesData(this.state.timeFor);
    const timeLabels = timeSeries.getSeriesLabels(this.state.timeFor);

    const daysLate = counters.getStats('daysLate');
    return (
      <TopicContainerPage>
        <div id="data-filter-section">
          <div id="date-inputs" style={{ marginBottom: '15px' }}>
            <label htmlFor="startdate">Start Date: </label>
            <input ref={(input) => { this.startInput = input; }} defaultValue="" name="startdate" />
            <label htmlFor="enddate">End Date: </label>
            <input id="end-date" ref={(input) => { this.endInput = input; }} defaultValue="" name="enddate" />
            <input type="button" value="Update Date Range" onClick={this.updateDateRange} />
          </div>
          <div id="type-inputs" style={{ marginBottom: '15px' }}>
            <label htmlFor="commtoggle">Commercial: </label>
            <input type="checkbox" name="commtoggle" id="commercial-toggle" checked={this.state.commercial} onChange={this.checkType} />
            <label htmlFor="restoggle">Residential: </label>
            <input type="checkbox" name="restoggle" id="residential-toggle" checked={this.state.residential} onChange={this.checkType} />
          </div>
          <div id="sla-map" style={{ marginBottom: '15px', marginLeft: '15px' }}>
            <b>SLAs: </b>&nbsp;
            {Object.keys(this.state.slaMap).map((sla, idx) =>
              <span key={`sla-map-${idx}`}>
                <label htmlFor={`slacheck${idx}`}>{(sla === -1) ? 'None' : sla} </label>
                <input
                  type="checkbox"
                  name={`slacheck${idx}`}
                  id={`sla-map-${sla}`}
                  checked={this.state.slaMap[sla]}
                  onChange={this.checkType}
                />
              </span>
            )}
          </div>
        </div>
        <div>
          <div id="full-period-stats">
            {this.badge('Total Permits', counters.getValue('totalPermits'))}
            {this.badge('Permits Failing SLA', counters.getValue('permitsWithViolations'), null, `${pctFailures}%`)}
            {this.badge('Total SLA Failures', counters.getValue('totalViolations'))}
            {this.badge('Days Late', daysLate[0], daysLate[1], daysLate[2])}
          </div>
          <br />
          <div id="full-period-charts">
            {this.pieChart(categoryCounts.type, 'Permit Type')}
            {this.pieChart(categoryCounts.subtype, 'Permit SubType')}
            {this.pieChart(categoryCounts.sla, 'SLA')}
          </div>
        </div>
        <div id="performance-over-time">
          <div>
            <h2>Performance over time</h2>
            <div style={{ float: 'right' }}>
              <label htmlFor="timeby">Time:</label>
              <select name="timeby" value={this.state.timeBy} onChange={this.handleTimeBy}>
                <option value="month">Monthly</option>
                <option value="week">Weekly</option>
                <option value="day-of-week">Day of Week</option>
              </select>
            </div>
            <div style={{ float: 'right' }}>
              <label htmlFor="timefor">Statistic:</label>
              <select name="timefor" value={this.state.timeFor} onChange={this.handleTimeFor}>
                <option value="permits">Permits</option>
                <option value="violations">SLA Failures</option>
                <option value="reviews">Review Failures</option>
              </select>
            </div>
          </div>
          {this.barChart(timeData, timeLabels, timeTitle)}
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
