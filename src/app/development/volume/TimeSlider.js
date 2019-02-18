import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ResponsiveXYFrame } from 'semiotic';
import { timeDay, timeMonday, timeWeek, timeMonth, timeYear } from 'd3-time';
import { whichD3TimeFunction } from './granularUtils';

function spanOfYears(numYears) {
  return [
    timeYear.offset(new Date(), -1 * numYears).getTime(),
    new Date().getTime(),
  ];
}

class TimeSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      brushExtent: this.props.defaultBrushExtent,
    };
    this.determineNewExtent = this.determineNewExtent.bind(this);
    this.brushDuring = this.brushDuring.bind(this);
    this.brushEnd = this.brushEnd.bind(this);
  }

  determineNewExtent(e) {
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
    return newExtent;
  }

  brushDuring(e) {
    const newExtent = this.determineNewExtent(e);
    this.setState({
      brushExtent: newExtent,
    });
  }

  brushEnd(e) {
    const newExtent = this.determineNewExtent(e);

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
            top: 20,
            right: 25,
            bottom: 90,
            left: 25,
          }}
          size={[1000, 120]}
          xAccessor={d => {console.log(d); return d.getTime() }}
          yAccessor={() => 0}
          xExtent={this.props.xSpan}
          axes={[
            {
              orient: 'bottom',
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
                      year: 'numeric',
                    },
                  )}
                </text>
              ),
              tickValues: ticks,
              // TODO: MAKE THE LABEL AN INPUT BOX
              label: (<text
                style={{ textAnchor: 'middle', alignmentBaseline: 'hanging' }}
              >
                {`${new Date(this.state.brushExtent[0]).toLocaleDateString('en-us')} - ${new Date(this.state.brushExtent[1]).toLocaleDateString('en-us')}`}
              </text>),
            },
          ]}
          interaction={{
            during: this.brushDuring,
            end: this.brushEnd,
            brush: 'xBrush',
            extent: this.state.brushExtent,
          }}
          // lines={[{ title: 'dummy-line', coordinates: ticks }]}
          // hoverAnnotation
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
    timeWeek.offset(new Date(), -1).getTime(),
    new Date().getTime(),
  ], // today and today minus thirty-one days
  onBrushEnd: newExtent => console.log(newExtent),
  xSpan: spanOfYears(2), // today and today minus one year
};

export default TimeSlider;
