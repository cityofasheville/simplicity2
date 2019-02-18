import React from 'react';
import PropTypes from 'prop-types';
import PermitsTableWrapper from './PermitsTableWrapper';
import TimeSlider from '../volume/TimeSlider';
import { timeWeek } from 'd3-time';


class PermitsIndex extends React.Component {

  constructor() {
    super();

    const now = new Date();

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
      <TimeSlider
        onBrushEnd={newExtent => this.setState({
          timeSpan: newExtent,
        })}
        defaultBrushExtent={this.initialBrushExtent}
      />
      <PermitsTableWrapper
        permit_groups={['Planning', 'Permits', 'Services']}
        after={new Date(this.state.timeSpan[0])}
        before={new Date(this.state.timeSpan[1])}
        {...this.props}
      />
    </div>)
  }
}

export default PermitsIndex;
