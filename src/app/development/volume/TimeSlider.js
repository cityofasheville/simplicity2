import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ResponsiveXYFrame } from 'semiotic';
import { timeDay, timeMonday, timeMonth } from 'd3-time';
import { whichD3TimeFunction } from './granularUtils';

function spanOfYears(numYears) {
  const today = new Date();
  const currMonth = today.getMonth()
  const currYear = today.getFullYear()
  return [
    timeMonth.round(new Date(currYear - numYears, currMonth - 1)).getTime(),
    timeMonth.ceil(today).getTime(),
  ];
}

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
      // Snap to something reasonable
      const daySpan = timeDay.count(e[0], e[1]);
      const timeFunc = whichD3TimeFunction(e)
      newExtent = [timeFunc.floor(e[0]), timeFunc.ceil(e[1])];
      if (+newExtent[1] > +this.props.xSpan[1]) {
        newExtent[1] = this.props.xSpan[1];
      }
      if (+newExtent[0] < +this.props.xSpan[0]) {
        newExtent[0] = this.props.xSpan[0];
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
    const ticks = timeMonth.range(
      this.props.xSpan[0],
      timeMonth.floor(this.props.xSpan[1] + 2678400000),
    )
    // TODO: Use hover annotation and fake lines to make tooltip
    return (
      <div
        className="brushedChart"
        style={{ width: '100%' }}
      >
        <ResponsiveXYFrame
          responsiveWidth
          margin={{
            top: 50,
            right: 25,
            bottom: 25,
            left: 25,
          }}
          size={[1000, 80]}
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
                  {d.toLocaleDateString(
                    'en-US',
                    {
                      month: 'short',
                      year: 'numeric',
                    },
                  )}
                </text>
              ),
              tickValues: ticks,
            },
          ]}
          hoverAnnotation
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
  // defaultBrushExtent: PropTypes.arrayOf(PropTypes.number),
  onBrushEnd: PropTypes.func,
  xSpan: PropTypes.arrayOf(PropTypes.number),
};

TimeSlider.defaultProps = {
  defaultBrushExtent: [
    timeDay.floor(new Date()).getTime() - 2678400000,
    timeDay.ceil(new Date()).getTime(),
  ], // today and today minus thirty-one days
  onBrushEnd: newExtent => console.log(newExtent),
  xSpan: spanOfYears(2), // today and today minus one year
};

export default TimeSlider;
