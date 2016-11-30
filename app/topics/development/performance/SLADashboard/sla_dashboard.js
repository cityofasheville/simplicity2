import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import TopicContainerPage from '../../../../containers/TopicContainerPage/topicContainerPage';
import PieChart from '../../../../components/PieChart/pieChart';
import BarChart from '../../../../components/BarChart/barChart';
import DashboardValue from '../../../../components/DashboardValue/dashboardValue';
import DashboardValueRange from '../../../../components/DashboardValueRange/dashboardValueRange';
import DateRangeSelector from '../../../../components/DateRangeSelector/dateRangeSelector';


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
    this.updateDateRange = this.updateDateRange.bind(this);
    this.checkType = this.checkType.bind(this); // eslint-disable-line react/jsx-no-bind
    this.handleTimeBy = this.handleTimeBy.bind(this);
    this.handleTimeFor = this.handleTimeFor.bind(this);
    this.handleDateRangeSelectorOnChange = this.handleDateRangeSelectorOnChange.bind(this);
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

  inDateRange(inDate) {
    let inRange = true;
    const date = new Date(inDate).getTime();
    if ((this.state.start && date < this.state.start.getTime()) ||
        (this.state.end && date > this.state.end.getTime())) {
      inRange = false;
    }
    return inRange;
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
      dd.setDate(dd.getDate() - (dd.getDay() + 6) % 7); // eslint-disable-line no-mixed-operators
      idx = { index: week, value: months[dd.getMonth()] };
    } else if (this.state.timeBy === 'day-of-week') {
      const day = date.getDay();
      idx = { index: day, value: days[day] };
    }
    return idx;
  }

  stats(permits, cFields) {
    const slaToggles = this.state.slaToggles;
    const slaIndex = this.state.slaIndex;
    const stats = {};
    const counters = {};
    let i;
    cFields.forEach((field) => {
      counters[field] = {};
    });
    const timeStats = {
      permits: {
        data: [],
        labels: [],
        minIndex: Number.MAX_SAFE_INTEGER,
      },
      violations: {
        data: [],
        labels: [],
        minIndex: Number.MAX_SAFE_INTEGER,
      },
      reviews: {
        data: [],
        labels: [],
        minIndex: Number.MAX_SAFE_INTEGER,
      },
    };
    stats.permitsWithViolations = 0;
    stats.totalViolations = 0;
    stats.totalPermits = 0;
    stats.daysLate = [0, 0, 0];
    const daysLate = [];
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
          stats.totalPermits++;
          // Time series
          let idx = this.dateIndex(new Date(permit.app_date));

          if (!(timeStats.permits.data[idx.index])) {
            timeStats.permits.data[idx.index] = 0;
            timeStats.permits.labels[idx.index] = idx.value;
            timeStats.permits.minIndex = Math.min(timeStats.permits.minIndex, idx.index);
          }
          timeStats.permits.data[idx.index] += 1;

          if (permit.violation) {
            if (!(timeStats.violations.data[idx.index])) {
              timeStats.violations.data[idx.index] = 0;
              timeStats.violations.labels[idx.index] = idx.value;
              timeStats.violations.minIndex = Math.min(timeStats.violations.minIndex, idx.index);
            }
            timeStats.violations.data[idx.index] += 1;
          }

          if (permit.violation) {
            ++stats.permitsWithViolations;
            stats.totalViolations += permit.violation_count;
            if (permit.trips && permit.trips.length > 0) {
              permit.trips.forEach((trip) => {
                if (trip.trip_violation_days > 0) {
                  daysLate.push(Number(trip.trip_violation_days));
                  idx = this.dateIndex(new Date(trip.start_date));
                  if (!(timeStats.reviews.data[idx.index])) {
                    timeStats.reviews.data[idx.index] = 0;
                    timeStats.reviews.labels[idx.index] = idx.value;
                    timeStats.reviews.minIndex = Math.min(timeStats.reviews.minIndex, idx.index);
                  }
                  timeStats.reviews.data[idx.index] += 1;
                }
              });
            }
          }
          for (i = 0; i < cFields.length; ++i) {
            const field = cFields[i];
            const c = permit[field];
            if (!(c in counters[field])) counters[field][c] = 0;
            ++counters[field][c];
          }
        }
      }
    });

    if (daysLate.length > 0) {
      daysLate.sort((val1, val2) => (Number(val1) - Number(val2)));

      stats.daysLate = [
        daysLate[Math.floor(daysLate.length / 2)],
        daysLate[0],
        daysLate[daysLate.length - 1],
      ];
    }
    stats.categoryCounts = {};
    Object.keys(counters).forEach((field) => {
      stats.categoryCounts[field] = [];
      Object.keys(counters[field]).forEach((val) => {
        stats.categoryCounts[field].push({ key: val, value: counters[field][val] });
      });
    });

    // Prune the labels & offset index to 0
    if (timeStats.permits && timeStats.permits.labels && timeStats.permits.labels.length > 1) {
      const pdata = timeStats.permits.data;
      const plabels = timeStats.permits.labels;
      const minIndex = timeStats.permits.minIndex;
      timeStats.permits = { data: [], labels: [], minIndex };
      let last = null;
      pdata.forEach((item, idx) => {
        let label = plabels[idx];
        if (label === last) label = '';
        last = plabels[idx];
        timeStats.permits.data[idx - minIndex] = item;
        timeStats.permits.labels[idx - minIndex] = label;
      });
    }
    if (timeStats.violations && timeStats.violations.labels && timeStats.violations.labels.length > 1) {
      const pdata = timeStats.violations.data;
      const plabels = timeStats.violations.labels;
      const minIndex = timeStats.violations.minIndex;
      timeStats.violations = { data: [], labels: [], minIndex };
      let last = null;
      pdata.forEach((item, idx) => {
        let label = plabels[idx];
        if (label === last) label = '';
        last = plabels[idx];
        timeStats.violations.data[idx - minIndex] = item;
        timeStats.violations.labels[idx - minIndex] = label;
      });
    }
    if (timeStats.reviews && timeStats.reviews.labels && timeStats.reviews.labels.length > 1) {
      const pdata = timeStats.reviews.data;
      const plabels = timeStats.reviews.labels;
      const minIndex = timeStats.reviews.minIndex;
      timeStats.reviews = { data: [], labels: [], minIndex };
      let last = null;
      pdata.forEach((item, idx) => {
        let label = plabels[idx];
        if (label === last) label = '';
        last = plabels[idx];
        timeStats.reviews.data[idx - minIndex] = item;
        timeStats.reviews.labels[idx - minIndex] = label;
      });
    }
    stats.timeStats = timeStats;
    return stats;
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
      console.log(start)
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

  handleTimeBy(e) {
    this.setState({ timeBy: e.target.value });
  }

  handleTimeFor(e) {
    this.setState({ timeFor: e.target.value });
  }

  handleDateRangeSelectorOnChange(dateRange){
    this.setState({ start: dateRange.start, end: dateRange.end });
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

  render() {
    let stats = {
      permitsWithViolations: 0,
      totalViolations: 0,
      totalPermits: 0,
      daysLate: [0, 0, 0],
      categoryCounts: {
        type: null,
        subtype: null,
        sla: null,
      },
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
    if (!this.props.data.loading) {
      stats = this.stats(this.props.data.permits, ['type', 'subtype', 'sla']);
      if (stats.permitsWithViolations > 0) {
        pctFailures = ((100 * stats.permitsWithViolations) / (stats.totalPermits)).toFixed(0);
      }
    }

    const timeTitle = this.createTimeTitle();
    const timeData = stats.timeStats[this.state.timeFor].data;
    const timeLabels = stats.timeStats[this.state.timeFor].labels;


    return (
      <TopicContainerPage>
        <div className="col-xs-12">
          <div className="col-md-6">
            <DateRangeSelector
              className="col-md-6"
              options={['last-week', 'last-30-days', 'last-6-months', 'last-year']}
              onChange={this.handleDateRangeSelectorOnChange}
            />
          </div>
        </div>
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
                  onChange={this.checkType}
                />
              </span>
            )}
          </div>

        </div>
        <div>
          <div id="full-period-stats">
            <DashboardValue
              value={stats.totalPermits.toString()}
              label="Total Permits"
            >
            </DashboardValue>
            <DashboardValue
              value={stats.permitsWithViolations.toString()}
              subValue={`${pctFailures}%`}
              label="Permits Failing SLA"
            >
            </DashboardValue>
            <DashboardValue
              value={stats.totalViolations.toString()}
              label="Total SLA Failures"
            >
            </DashboardValue>
            <DashboardValueRange
              minValue={stats.daysLate[1].toString()}
              medValue={stats.daysLate[0].toString()}
              maxValue={stats.daysLate[2].toString()}
              label="Days Late"
            >
            </DashboardValueRange>
          </div>
          <br />
          <div id="full-period-charts">
          {this.pieChart(stats.categoryCounts.type, 'Permit Type')}
          {this.pieChart(stats.categoryCounts.subtype, 'Permit SubType')}
          {this.pieChart(stats.categoryCounts.sla, 'SLA')}
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
