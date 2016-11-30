import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import TopicContainerPage from '../../../../containers/TopicContainerPage/topicContainerPage';
import PieChart from '../../../../components/PieChart/pieChart';
import BarChart from '../../../../components/BarChart/barChart';
import DashboardValue from '../../../../components/DashboardValue/dashboardValue';
import DashboardValueRange from '../../../../components/DashboardValueRange/dashboardValueRange';
import DateRangeSelector from '../../../../components/DateRangeSelector/dateRangeSelector';
import DateUtilities from './statistics/dateutilities';
import Statistics from './statistics/statistics';
import CounterSet from './statistics/counterset';
import TimeSeriesSet from './statistics/timeseriesset';


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
    this.handleDateRangeSelectorOnChange = this.handleDateRangeSelectorOnChange.bind(this);
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

  handleDateRangeSelectorOnChange(dateRange) {
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

  timeStats(permit, timeSeries, counters) {
    let idx = DateUtilities.dateIndex(new Date(permit.app_date), this.state.timeBy);
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
            idx = DateUtilities.dateIndex(new Date(trip.start_date), this.state.timeBy);
            timeSeries.addTimePoint('reviews', idx.index, idx.value);
          }
        });
      }
    }
  }

  render() {
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

      if (counters.getValue('permitsWithViolations') > 0) {
        pctFailures = ((100 * counters.getValue('permitsWithViolations')) /
                        counters.getValue('totalPermits')).toFixed(0);
      }
    }

    const timeTitle = this.createTimeTitle();
    const timeData = timeSeries.getSeriesData(this.state.timeFor);
    const timeLabels = timeSeries.getSeriesLabels(this.state.timeFor);

    const daysLate = counters.getStats('daysLate');

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
            <DashboardValue
              value={counters.getValue('totalPermits').toString()}
              label="Total Permits"
            >
            </DashboardValue>
            <DashboardValue
              value={counters.getValue('permitsWithViolations').toString()}
              subValue={`${pctFailures}%`}
              label="Permits Failing SLA"
            >
            </DashboardValue>
            <DashboardValue
              value={counters.getValue('totalViolations').toString()}
              label="Total SLA Failures"
            >
            </DashboardValue>
            <DashboardValueRange
              minValue={daysLate[1].toString()}
              medValue={daysLate[0].toString()}
              maxValue={daysLate[2].toString()}
              label="Days Late"
            >
            </DashboardValueRange>

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
