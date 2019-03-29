import React from 'react';
// import PropTypes from 'prop-types';
import { timeDay, timeMonth } from 'd3-time';
import PermitsTableWrapper from '../permits/PermitsTableWrapper';
import TimeSlider from '../volume/TimeSlider';
import ErrorBoundary from '../../ErrorBoundary';
import { trcProjectTypes } from '../utils';


class TRCDataTable extends React.Component {
  constructor() {
    super();
    const now = timeDay.floor(new Date());
    this.initialBrushExtent = [
      timeMonth.offset(now, -3).getTime(),
      now.getTime(),
    ];
    this.state = {
      timeSpan: this.initialBrushExtent,
    };
  }

  render() {
    return (<div>
      <ErrorBoundary>
        <TimeSlider
          onBrushEnd={newExtent => this.setState({
            timeSpan: newExtent,
          })}
          defaultBrushExtent={this.initialBrushExtent}
          xSpan={2}
        />
        <PermitsTableWrapper
          // Defaults are fine for now
          after={this.state.timeSpan[0]}
          before={this.state.timeSpan[1]}
          projectTypes={trcProjectTypes}
          // permit_groups={['Planning']}
        />
      </ErrorBoundary>
    </div>);
  }
}

export default TRCDataTable;
