import React from 'react';
import { timeDay, timeWeek } from 'd3-time';
import PermitsTableWrapper from './PermitsTableWrapper';
import TimeSlider from '../volume/TimeSlider';
import ErrorBoundary from '../../../shared/ErrorBoundary';
// import PermitSearchBar from './PermitSearchBar';


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
        <h1>All Permit Applications</h1>
        <hr />
        {/* <h2>Look Up an Existing Application</h2>
        <PermitSearchBar /> */}
        <h2 style={{marginTop: "32px"}}>Filter Permits by Date Applied</h2>
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
            permit_groups={['Permits', 'Planning']}
          />
        </ErrorBoundary>
      </div>
    );
  }
}

export default PermitsIndex;
