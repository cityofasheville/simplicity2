import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ResponsiveXYFrame } from 'semiotic';
import { timeDay } from 'd3-time';

function spanOfYears(numYears) {
  const today = new Date();
  const currMonth = today.getMonth()
  const currYear = today.getFullYear()
  return [
    new Date(currYear - numYears, currMonth - 1).getTime(),
    today.getTime(),
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

    const ticks = [];
    let addDate = new Date(this.props.xSpan[0])
    let currMonth = addDate.getMonth()
    let currYear = addDate.getFullYear()
    addDate = new Date(currYear, currMonth + 1);
    // Start a month later so it doesn't go of the screen

    const lastDate = new Date(this.props.xSpan[1])

    while (addDate <= lastDate) {
      ticks.push(addDate);
      currMonth = (currMonth + 1) % 12;
      if (currMonth === 0) {
        currYear += 1;
      }
      addDate = new Date(currYear, currMonth);
    }

    // TODO: add hover annotation
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
            // todo: tick at the beginning of each month
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
