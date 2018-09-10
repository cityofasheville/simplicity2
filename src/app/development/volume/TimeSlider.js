import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ResponsiveXYFrame } from 'semiotic';

class TimeSlider extends Component {
  constructor() {
    super();
    this.state = {
      brushExtent: this.props.defaultBrushExtent,
    };
    this.brushEnd = this.brushEnd.bind(this);
  }

  brushEnd(e) {
    this.props.parentBrushEnd(e);
    this.setState({
      brushExtent: e,
    });
  }

  render() {
    // if brushWidthLocked, use a css class to hide handles
    // style it so that it can be consistent on charts and as a standalone

    return (
      <div
        className={this.props.brushWidthLocked ?
          'brushedChart hideBrushHandles'
          : 'brushedChart'}
        style={{ width: '100%' }}
      >
        <ResponsiveXYFrame
          responsiveWidth
          xAccessor={d => new Date(d)}
          yAccessor={() => 0}
          xExtent={this.props.xSpan}
          axes={[
            {
              orient: 'bottom',
              ticks: 12,
              tickFormat: d => d.getFullYear(),
            },
          ]}
          interaction={{
            end: this.brushEnd,
            brush: 'xBrush',
            extent: this.state.brushExtent,
          }}
        />
      </div>
    );
  }
}

TimeSlider.propTypes = {
  defaultBrushExtent: PropTypes.arrayOf(PropTypes.object),
  brushWidthLocked: PropTypes.bool,
  parentBrushEnd: PropTypes.func,
  xSpan: PropTypes.arrayOf(PropTypes.object),
};

TimeSlider.defaultProps = {
  defaultBrushExtent: [], // today and today minus thirty days
  brushWidthLocked: false, // 2592000000 is 30 days in milliseconds
  parentBrushEnd: newExtent => console.log(newExtent),
  xSpan: [new Date(), new Date()], // today and today minus one year
};

export default TimeSlider;
