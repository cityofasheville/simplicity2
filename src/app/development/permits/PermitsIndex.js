import React from 'react';
import PropTypes from 'prop-types';
import PermitsTableWrapper from '../trc/PermitsTableWrapper';
import TimeSlider from '../volume/TimeSlider';
import { timeDay } from 'd3-time';


class PermitsIndex extends React.Component {

  constructor() {
    super();
    this.state = {
      timeSpan: [
        timeDay.floor(new Date()).getTime() - 2678400000,
        timeDay.ceil(new Date()).getTime(),
      ],
    };
  }

  render() {
    return (<div>
      <h1>All Permits by Date Applied</h1>
      <TimeSlider
        onBrushEnd={newExtent => this.setState({
          timeSpan: newExtent,
        })}
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
