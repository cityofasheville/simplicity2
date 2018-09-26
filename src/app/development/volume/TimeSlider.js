import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ResponsiveXYFrame } from 'semiotic';
import { timeDay } from 'd3-time';

class TimeSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      brushExtent: this.props.defaultBrushExtent,
    };
    this.brushEnd = this.brushEnd.bind(this);
  }

  brushEnd(e) {
    let newExtent;
    if (e) {
      // Snap brush to the day
      // TODO: make this flexible based on timespan
      newExtent = e.map(timeDay.round);
      if (newExtent[0] >= newExtent[1]) {
        newExtent[0] = timeDay.floor(newExtent[0]);
        newExtent[1] = timeDay.ciel(newExtent[1]);
      }
    } else {
      newExtent = this.state.brushExtent;
    }

    this.props.onBrushEnd(newExtent);
    this.setState({
      brushExtent: newExtent,
    });
  }

  render() {
    // TODO: add hover annotation
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
    new Date().getTime() - 2678400000,
    new Date().getTime(),
  ], // today and today minus thirty-one days
  // TODO: get rid of width locked since it doesn't work anyway
  brushWidthLocked: true,
  onBrushEnd: newExtent => console.log(newExtent),
  xSpan: [
    new Date().setFullYear(new Date().getFullYear() - 1),
    new Date().getTime(),
  ], // today and today minus one year
};

export default TimeSlider;
