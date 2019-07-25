import React from 'react';
// import PropTypes from 'prop-types';
import { timeDay, timeWeek } from 'd3-time';
import PermitsTableWrapper from './PermitsTableWrapper';
import TimeSlider from '../volume/TimeSlider';
import ErrorBoundary from '../../../shared/ErrorBoundary';


class PermitsIndex extends React.Component {
  constructor() {
    super();
    const now = timeDay.floor(new Date());
    this.initialBrushExtent = [
      timeWeek.offset(now, -4).getTime(),
      now.getTime(),
    ];
    this.state = {
      timeSpan: this.initialBrushExtent,
    };
  }

  render() {
    return (
      <div className="container">
        <h1>All Permit Applications by Date Applied</h1>
        <ErrorBoundary>
          <TimeSlider
            onBrushEnd={newExtent => this.setState({
              timeSpan: newExtent,
            })}
            defaultBrushExtent={this.initialBrushExtent}
          />
          <PermitsTableWrapper
            // Defaults are fine for now
            after={this.state.timeSpan[0]}
            before={this.state.timeSpan[1]}
          />
        </ErrorBoundary>
      </div>
    );
  }
}

export default PermitsIndex;
