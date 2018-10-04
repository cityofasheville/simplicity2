import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ResponsiveXYFrame } from 'semiotic';
import { timeDay, timeMonday, timeMonth } from 'd3-time';

function spanOfYears(numYears) {
  const today = new Date();
  const currMonth = today.getMonth()
  const currYear = today.getFullYear()
  return [
    timeMonday.round(new Date(currYear - numYears, currMonth - 1)).getTime(),
    timeDay.round(today).getTime(),
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
      const oneDayMilliseconds = (24 * 60 * 60 * 1000);
      const firstTime = new Date(e[0]).getTime();
      const lastTime = new Date(e[1]).getTime();
      const daySpan = (lastTime - firstTime) / oneDayMilliseconds;
      if (daySpan <= 15) {
        newExtent = e.map(timeDay.round);
      }
      if (daySpan > 15) {
        newExtent = e.map(timeMonday.round);
      }
      if (newExtent[0] >= newExtent[1]) {
        // TODO: REEVALUTE THIS
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
    const tickSpan = this.props.xSpan;
    const ticks = timeMonth.range(tickSpan[0], tickSpan[1])
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
            right: 15,
            bottom: 15,
            left: 15,
          }}
          size={[1000, 70]}
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
  defaultBrushExtent: PropTypes.arrayOf(PropTypes.number),
  onBrushEnd: PropTypes.func,
  xSpan: PropTypes.arrayOf(PropTypes.number),
};

TimeSlider.defaultProps = {
  defaultBrushExtent: [
    new Date().getTime() - 2678400000,
    new Date().getTime(),
  ], // today and today minus thirty-one days
  // TODO: get rid of width locked since it doesn't work anyway
  onBrushEnd: newExtent => console.log(newExtent),
  xSpan: spanOfYears(2), // today and today minus one year
};

export default TimeSlider;
