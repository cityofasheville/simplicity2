import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveXYFrame } from 'semiotic';
import moment from 'moment';
import { timeDay, timeWeek, timeMonth, timeYear } from 'd3-time';
import ErrorBoundary from '../../ErrorBoundary';

function spanOfYears(numYears) {
  return [
    timeYear.offset(timeDay.floor(new Date()), -1 * numYears).getTime(),
    timeDay.floor(new Date()).getTime(),
  ];
}

class TimeSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      brushExtent: this.props.defaultBrushExtent,
      firstInputVal: this.props.defaultBrushExtent[0],
      secondInputVal: this.props.defaultBrushExtent[1],
    };
    this.determineNewExtent = this.determineNewExtent.bind(this);
    this.brushDuring = this.brushDuring.bind(this);
    this.brushEnd = this.brushEnd.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  determineNewExtent(e, snap = false) {
    let newExtent = e;
    if (e) {
      // If someone just clicked on the timeline there might not be an e

      // if (snap) {
      //   const timeFunc = whichD3TimeFunction(e);
      //   console.log(timeDay.floor(new Date()))
      //   newExtent = [timeFunc.floor(e[0]), timeFunc.ceil(e[1])];
      //   console.log(newExtent)
      // }

      // Don't let the new extent be outside of our timeline
      if (+newExtent[1] > +this.props.xSpan[1]) {
        newExtent[1] = this.props.xSpan[1];
      }
      if (+newExtent[0] < +this.props.xSpan[0]) {
        newExtent[0] = this.props.xSpan[0];
      }
    } else {
      // If there isn't an e value
      newExtent = this.state.brushExtent;
    }
    return newExtent;
  }

  brushDuring(e) {
    const newExtent = this.determineNewExtent(e);
    this.setState({
      brushExtent: newExtent,
      firstInputVal: newExtent[0],
      secondInputVal: newExtent[1],
    });
  }

  brushEnd(e, snap = true) {
    const newExtent = this.determineNewExtent(e, snap);
    this.props.onBrushEnd(newExtent);
    this.setState({
      brushExtent: newExtent,
      firstInputVal: newExtent[0],
      secondInputVal: newExtent[1],
    });
  }

  handleSubmit(e = false) {
    // Can also trigger handle submit manually
    if (e) {
      e.preventDefault();
    }
    this.brushEnd([
      this.state.firstInputVal,
      this.state.secondInputVal,
    ], false);
  }

  render() {
    const ticks = timeMonth.range(
      timeMonth.ceil(this.props.xSpan[0]),
      timeMonth.ceil(this.props.xSpan[1]),
    );
    // TODO: Use hover annotation and fake lines to make tooltip
    return (
      <div
        className="brushedChart"
        style={{ width: '100%', margin: '2em 0' }}
      >
        <ErrorBoundary>
          <ResponsiveXYFrame
            responsiveWidth
            margin={{
              top: 20,
              right: 5,
              bottom: 50,
              left: 25,
            }}
            size={[1000, 85]}
            xAccessor={d => d}
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
                    {moment.utc(d).format('MM/YYYY')}
                  </text>
                ),
                tickValues: ticks,
              },
            ]}
            interaction={{
              during: this.brushDuring,
              end: this.brushEnd,
              brush: 'xBrush',
              extent: this.state.brushExtent,
            }}
          />
          <div className="visualization-title">
            <form onSubmit={this.handleSubmit} style={{ textAlign: 'center' }}>
              <div
                className="form-group"
                style={{ display: 'inline-block', padding: '0 0.75em', whiteSpace: 'nowrap' }}
              >
                <label
                  htmlFor="startdate"
                  style={{ display: 'inline-block', padding: '0 1em 0 0' }}
                >
                  From
                </label>
                <input
                  type="date"
                  id="startdate"
                  name="startdate"
                  className="form-control input-sm"
                  style={{ display: 'inline-block', width: '11em' }}
                  value={moment.utc(new Date(this.state.firstInputVal)).format('YYYY-MM-DD')}
                  onChange={(e) => {
                    if (!moment(new Date(e.target.value)).isValid()) {
                      return;
                    }
                    const date = moment.utc(new Date(e.target.value))
                      .hour(0).minute(0).seconds(1)
                      .valueOf();

                    this.setState({
                      firstInputVal: date,
                    });
                  }}
                />
              </div>
              <div
                className="form-group"
                style={{ display: 'inline-block', padding: '0 1em', whiteSpace: 'nowrap' }}
              >
                <label
                  htmlFor="enddate"
                  style={{ display: 'inline-block', padding: '0 0.75em 0 0' }}
                >
                  To
                </label>
                <input
                  type="date"
                  id="enddate"
                  name="enddate"
                  className="form-control input-sm"
                  style={{ display: 'inline-block', width: '11em' }}
                  value={moment.utc(new Date(this.state.secondInputVal)).format('YYYY-MM-DD')}
                  onChange={(e) => {
                    if (!moment(new Date(e.target.value)).isValid()) {
                      return;
                    }
                    const date = moment.utc(new Date(e.target.value))
                      .hour(23).minute(59).seconds(59)
                      .valueOf();

                    this.setState({
                      secondInputVal: date,
                    });
                  }}
                />
              </div>
              <input
                type="submit"
                value="Set Dates"
                className="btn btn-primary btn-sm"
                style={{ margin: '0 1em' }}
              />
            </form>
          </div>
        </ErrorBoundary>
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
    timeWeek.offset(timeDay.floor(new Date()), -1).getTime(),
    timeDay.floor(new Date()).getTime(),
  ], // today and today minus thirty-one days
  onBrushEnd: newExtent => console.log(newExtent),
  xSpan: spanOfYears(2), // today and today minus one year
};

export default TimeSlider;
