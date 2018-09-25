import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ResponsiveXYFrame } from 'semiotic';

class TimeSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      brushExtent: this.props.defaultBrushExtent,
    };
    this.brushEnd = this.brushEnd.bind(this);
  }

  brushEnd(e) {
    console.log(e)
    this.props.onBrushEnd(e);
    this.setState({
      brushExtent: e,
    });
  }

  render() {
    return (
      <div
        className={this.props.brushWidthLocked ?
          'brushedChart hideBrushHandles'
          : 'brushedChart'}
        style={{ width: '100%' }}
      >
        <ResponsiveXYFrame
          responsiveWidth
          margin={{
            top: 35,
            right: 5,
            bottom: 15,
            left: 5,
          }}
          size={[1000, 60]}
          xAccessor={d => new Date(d)}
          yAccessor={() => 0}
          xExtent={this.props.xSpan}
          axes={[
            {
              orient: 'top',
              tickFormat: d => (
                <text
                  textAnchor="middle"
                  style={{ fontSize: '0.70em' }}
                  transform="rotate(-45)"
                >
                  {new Date(d).toLocaleDateString(
                    'en-US',
                    {
                      month: 'short',
                      day: 'numeric',
                    },
                  )}
                </text>
              ),
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
  defaultBrushExtent: PropTypes.arrayOf(PropTypes.number),
  brushWidthLocked: PropTypes.bool,
  onBrushEnd: PropTypes.func,
  xSpan: PropTypes.arrayOf(PropTypes.number),
};

TimeSlider.defaultProps = {
  defaultBrushExtent: [
    new Date().getTime() - 2592000000,
    new Date().getTime(),
  ], // today and today minus thirty days
  brushWidthLocked: false,
  onBrushEnd: newExtent => console.log(newExtent),
  xSpan: [
    new Date().setFullYear(new Date().getFullYear() - 1),
    new Date().getTime(),
  ], // today and today minus one year
};

export default TimeSlider;
