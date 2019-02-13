import React from 'react';
import PropTypes from 'prop-types';
import PermitsTableWrapper from '../trc/PermitsTableWrapper';
import TimeSlider from '../volume/TimeSlider';
import { timeWeek } from 'd3-time';


class PermitsIndex extends React.Component {

  constructor() {
    super();
    this.initialBrushExtent = [
      timeWeek.floor(new Date()).getTime(),
      timeWeek.ceil(new Date()).getTime(),
    ];
    this.state = {
      timeSpan: this.initialBrushExtent,
    };
  }

  render() {
    return (<div className="container">
      <h1>All Permits by Date Applied</h1>
      <TimeSlider
        onBrushEnd={newExtent => this.setState({
          timeSpan: newExtent,
        })}
        defaultBrushExtent={this.initialBrushExtent}
      />
      <PermitsTableWrapper
        permit_groups={['Planning', 'Permits', 'Services']}
        after={this.state.timeSpan[0]}
        before={this.state.timeSpan[1]}
      />
    </div>)
  }
}

export default PermitsIndex;
