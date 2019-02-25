import React from 'react';
import PropTypes from 'prop-types';
import { timeDay, timeWeek } from 'd3-time';
import moment from 'moment';
import PermitsTableWrapper from './PermitsTableWrapper';
import TimeSlider from '../volume/TimeSlider';
import ErrorBoundary from '../../ErrorBoundary';


class PermitsIndex extends React.Component {

  constructor() {
    super();
    const now = timeDay.floor(new Date());
    this.initialBrushExtent = [
      timeWeek.offset(now, -1).getTime(),
      now.getTime(),
    ];
    this.state = {
      timeSpan: this.initialBrushExtent,
    };
  }

  render() {
    return (<div className="container">
      <h1>All Permits by Date Applied</h1>
      <ErrorBoundary>
        <TimeSlider
          onBrushEnd={newExtent => this.setState({
            timeSpan: newExtent,
          })}
          defaultBrushExtent={this.initialBrushExtent}
        />
        <PermitsTableWrapper
          permit_groups={['Planning', 'Permits', 'Services']}
          after={timeDay.floor(new Date(this.state.timeSpan[0]).getTime())}
          before={timeDay.ceil(new Date(this.state.timeSpan[1]).getTime())}
          tableHeaders={[
            {
              field: 'applied_date',
              display: 'Date Applied',
              formatFunc: d => moment(d).format('MM/DD/YYYY'),
            },
            {
              field: 'address',
              display: 'Address',
            },
            {
              field: 'permit_group',
              display: 'Module',
              show: (colWidth) => colWidth > 90,
            },
            {
              field: 'permit_type',
              display: 'Type',
            },
            {
              field: 'permit_subtype',
              display: 'Subtype',
              show: (colWidth) => colWidth > 70,
            },
            {
              field: 'permit_category',
              display: 'Category',
              show: (colWidth) => colWidth > 70,
            },
            {
              field: 'status_current',
              display: 'Status',
              show: (colWidth) => colWidth > 90,
            },
            {
              field: 'applicant_name',
              display: 'Applicant',
              show: (colWidth) => colWidth > 90,
            },
            {
              field: 'permit_number',
              display: 'Record Link',
              formatFunc: d => <a href={`/permits/${d}`}>{d}</a>
            }
          ]}
          {...this.props}
        />
      </ErrorBoundary>
    </div>)
  }
}

export default PermitsIndex;
