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
          // Defaults are fine for now
          {...this.props}
        />
      </ErrorBoundary>
    </div>)
  }
}

export default PermitsIndex;
