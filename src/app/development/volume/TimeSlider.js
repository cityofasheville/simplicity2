import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveXYFrame } from 'semiotic';
import moment from 'moment';
import { timeDay, timeWeek, timeMonth, timeYear } from 'd3-time';
import ErrorBoundary from '../../../shared/ErrorBoundary';
// import { format, getTime, isValid, set } from "date-fns";

class TimeSlider extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      brushExtent: this.props.defaultBrushExtent,
      firstInputVal: this.props.defaultBrushExtent[0],
      secondInputVal: this.props.defaultBrushExtent[1],
      selectedTimespan: 0,
      xSpan: [
        timeYear.offset(this.props.spanEnd, -1 * this.props.xSpan).getTime(),
        this.props.spanEnd,
      ],
      initialParamsChecked: false,
      sliderWidth: window.innerWidth,
    };

    this.determineNewExtent = this.determineNewExtent.bind(this);
    this.brushDuring = this.brushDuring.bind(this);
    this.brushEnd = this.brushEnd.bind(this);
    this.handleTimespanSelection = this.handleTimespanSelection.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateWindowWidth = this.updateWindowWidth.bind(this);
  }

  determineNewExtent(proposedExtent, snap = false) {
    let newExtent = proposedExtent;
    let newSpan = this.state.xSpan;

    // If someone just clicked on the timeline there might not be an e
    if (proposedExtent) {

      // When brushing stops (brushEnd invokes with snap=true), snap to "whole time" (drop the decimal part)
      if (snap) {
        const timeFunc = timeDay;
        newExtent = [timeFunc.ceil(proposedExtent[0]).getTime(), timeFunc.floor(proposedExtent[1]).getTime()];
      }

      
      let selectedRange = timeDay.count(newExtent[0], newExtent[1]);
      let spanRange = timeDay.count(this.state.xSpan[0], this.state.xSpan[1]);
      let rangeDiff = spanRange - selectedRange;

      // measure the amount of available valid date range input (in days) after selected end date and before selected start date
      let rangeOverhead = timeDay.count(newExtent[1], parseInt(this.props.spanUpperLimit));
      let rangeUnderhead = timeDay.count(this.props.spanLowerLimit, newExtent[0]);

      // if either value is negative, then input is out of range; revert to default values
      if (rangeOverhead < 0 || rangeUnderhead < 0) {
        return {
          extent: this.state.brushExtent,
          span: newSpan
        };
      }

      // Don't allow ranges bigger or smaller (i.e. negative) than allowed, just reset to "last good" value
      if (+selectedRange > +this.props.maxDaysAllowedToQuery || +newExtent[0] >= +newExtent[1]) {
        console.log(`Date range too big or small. Max range is ${this.props.maxDaysAllowedToQuery} days. Min range is 1 day.`);
        newExtent = this.state.brushExtent;
        // no need to change the existing span
      }

      // Don't allow dates before or after defined limits
      else if (+newExtent[0] < +this.props.spanLowerLimit || +newExtent[1] > +this.props.spanUpperLimit) {
        console.log(`Selected date(s) are out of bounds.`);
        newExtent = this.state.brushExtent;
        // no need to change the existing span
      }

      // Don't allow date ranges starting before AND ending after the current span (i.e. longer than the span)
      // Set the start and end dates to match the start and end of the span
      // NOTE: if this.props.maxDaysAllowedToQuery >= this.state.xSpan, this condition will never happen (the first condition will fire instead)
      else if (+newExtent[0] < +this.state.xSpan[0] && +newExtent[1] > +this.state.xSpan[1]) {
        newExtent = this.state.brushExtent;
        // no need to change the existing span
      }

      // If only the end date is outside span limit
      else if (+newExtent[0] > +this.state.xSpan[0] && +newExtent[1] > +this.state.xSpan[1]) {
        if (+newExtent[1] > +this.props.spanUpperLimit) {
          newExtent[1] = this.props.spanUpperLimit;
          newSpan = [
            timeYear.offset(this.props.spanUpperLimit, -1 * this.props.xSpan).getTime(),
            this.props.spanUpperLimit,
          ];
        }
        else {
          if (rangeDiff / 2 <= rangeOverhead) {
            newSpan = [
              timeDay.offset(newExtent[0], -1 * (rangeDiff / 2)).getTime(),
              timeDay.offset(newExtent[1], (rangeDiff / 2)).getTime(),
            ];
          }
          else {
            newSpan = [
              timeDay.offset(newExtent[0], -1 * (rangeDiff - rangeOverhead)).getTime(),
              timeDay.offset(newExtent[1], rangeOverhead).getTime(),
            ];
          }
        }
      }    

      // If only the start date is outside span limit
      else if (+newExtent[0] < +this.state.xSpan[0] && +newExtent[1] < +this.state.xSpan[1]) {
        if (+newExtent[0] < +this.props.spanLowerLimit) {
          newExtent[0] = this.props.spanLowerLimit;
          newSpan = [
            this.props.spanLowerLimit,
            timeYear.offset(this.props.spanLowerLimit, this.props.xSpan).getTime(),
          ];
        }
        else {
          if (rangeDiff / 2 <= rangeUnderhead) {
            newSpan = [
              timeDay.offset(newExtent[0], -1 * (rangeDiff / 2)).getTime(),
              timeDay.offset(newExtent[1], (rangeDiff / 2)).getTime(),
            ];
          }
          else {
            newSpan = [
              timeDay.offset(newExtent[0], -1 * rangeUnderhead).getTime(),
              timeDay.offset(newExtent[1], (rangeDiff - rangeUnderhead)).getTime(),
            ];
          }
        }
      }

    // If there isn't an e value
    } else {
      newExtent = this.state.brushExtent;
    }

    return {
      extent: newExtent,
      span: newSpan
    };
  }

  brushDuring(proposedExtent) {
    const newRanges = this.determineNewExtent(proposedExtent, false);
    this.setState({
      brushExtent: newRanges.extent,
      firstInputVal: newRanges.extent[0],
      secondInputVal: newRanges.extent[1],
      // selectedTimespan: 0,
    });
  }

  brushEnd(proposedExtent, snap = true, daysBack = 0) {
    const newRanges = this.determineNewExtent(proposedExtent, snap);
    this.props.onBrushEnd(newRanges.extent);
    this.setState({
      brushExtent: newRanges.extent,
      firstInputVal: newRanges.extent[0],
      secondInputVal: newRanges.extent[1],
      xSpan: newRanges.span,
      selectedTimespan: daysBack,
    });
  }

  handleTimespanSelection(daysBack) {
    if (daysBack === 0) {
      this.setState({
        selectedTimespan: 0,
      });
      return;
    }
    const proposedExtent = [
      timeDay.offset(this.props.spanEnd, -1 * daysBack).getTime(),
      this.props.spanEnd,
    ];
    const newRanges = this.determineNewExtent(proposedExtent, true);
    // this.props.onBrushEnd(newRanges.extent, true, daysBack);
    this.setState({
      brushExtent: newRanges.extent,
      firstInputVal: newRanges.extent[0],
      secondInputVal: newRanges.extent[1],
      xSpan: newRanges.span,
      selectedTimespan: daysBack,
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

  updateWindowWidth() {
    const timelineContainer = document.getElementById("timeline-container");
    this.setState({
      sliderWidth: timelineContainer.offsetWidth,
    });
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateWindowWidth);
    this.updateWindowWidth();
    if (!this.state.initialParamsChecked) {
      const initialParams = this.determineNewExtent(this.state.defaultBrushExtent, false);
      this.setState({
        brushExtent: initialParams.extent,
        firstInputVal: initialParams.extent[0],
        secondInputVal: initialParams.extent[1],
        xSpan: initialParams.span,
        initialParamsChecked: true,
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowWidth);
  }

  render() {
    // const ticks = timeMonth.range(
    //   timeMonth.ceil(this.state.xSpan[0]),
    //   timeMonth.ceil(this.state.xSpan[1]),
    // );

    let timeFunc = timeYear;
    if (this.props.tickMeasure === 'month') { 
      timeFunc = timeMonth;
    } else if (this.props.tickMeasure === 'week') {
      timeFunc = timeWeek;
    }
    let tickGap = this.props.initialTickGap;
    let ticks = timeFunc.range(
      timeFunc.ceil(this.state.xSpan[0]),
      timeFunc.ceil(this.state.xSpan[1]),
      tickGap
    );

    let tickCount = ticks.length;

    // Figure out how many pixels each tick mark would get
    let tickRatio = this.state.sliderWidth / tickCount;

    // if each tick mark lacks adequate pixel width, we'll increase the tick interval (tickGap)
    if (tickRatio < this.props.minimumTickWidth) {
      // If we double the current tick interval, we'll halve the number of tick marks in our tick array
      let newTickCount = tickCount / 2;
      let newTickRatio = this.state.sliderWidth / newTickCount;
      tickGap++;

      // Figure out which tick interval would yield an adequate gap betweek tick marks, then rebuild the tick array using the new gap
      while (newTickRatio < this.props.minimumTickWidth) {
        newTickCount = newTickCount / 2;
        newTickRatio = this.state.sliderWidth / newTickCount;
        tickGap++;
      }

      ticks = timeFunc.range(
        timeFunc.ceil(this.state.xSpan[0]),
        timeFunc.ceil(this.state.xSpan[1]),
        tickGap
      );
    }

    let tickFormat = "yyyy";
    if (this.props.tickMeasure === 'month') {
      tickFormat = "MMM yyyy";
    } else if (this.props.tickMeasure === 'week') {
      tickFormat = "MMM dd";
    }

    // TODO: Use hover annotation and fake lines to make tooltip
    return (
      <div
        className="brushedChart"
        style={{ width: '100%', margin: '0' }}
      >
        <ErrorBoundary>
          <div>
            <form onSubmit={this.handleSubmit} className="timepicker-dropdown">
              <div className="timepicker-input-item">
                <label
                  htmlFor="startdate"
                  style={{ marginBottom: '0', padding: '0 0.25em 0 0' }}
                >
                  From
                </label>
                <input
                  type="date"
                  id="startdate"
                  name="startdate"
                  className="form-control input-sm"
                  // style={{ display: 'inline-block', width: '11em' }}
                  value={moment.utc(new Date(parseInt(this.state.firstInputVal))).format('YYYY-MM-DD')}
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
              <div className="timepicker-input-item">
                <label
                  htmlFor="enddate"
                  style={{ marginBottom: '0', padding: '0 0.25em 0 0' }}
                >
                  Through
                </label>
                <input
                  type="date"
                  id="enddate"
                  name="enddate"
                  className="form-control input-sm"
                  value={moment.utc(new Date(parseInt(this.state.secondInputVal))).format('YYYY-MM-DD')}
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
              <div className="timepicker-input-item">
                <select value={this.state.selectedTimespan} className='form-control input-sm' onChange={(e) => {
                  console.log(e.currentTarget.value);
                  this.handleTimespanSelection(e.currentTarget.value);
                }}>
                  <option value={0}>Choose timespan</option>
                  <option value={30}>Last 30 days</option>
                  <option value={180}>Last 6 months</option>
                  <option value={365}>Last year</option>
                </select>
              </div>

              <input
                type="submit"
                value="Set Dates"
                className="btn btn-primary btn-sm timepicker-input-item"
              />
            </form>
          </div>
          <div id='timeline-container'>
            <ResponsiveXYFrame
              responsiveWidth
              margin={{
                top: 20,
                right: 10,
                bottom: 50,
                left: 25,
              }}
              size={[1000, 75]}
              xAccessor={d => d}
              yAccessor={() => 0}
              xExtent={this.state.xSpan}
              axes={[
                {
                  orient: 'bottom',
                  tickFormat: d => (
                    <text
                      textAnchor="middle"
                      style={{ fontSize: '0.70em', left: '-14px'}}
                      transform="rotate(-45)"
                    >
                      {moment.utc(d).format(tickFormat)}
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
          </div>
        </ErrorBoundary>
      </div>
    );
  }
}

TimeSlider.propTypes = {
  // defaultBrushExtent: PropTypes.arrayOf(PropTypes.number),
  onBrushEnd: PropTypes.func,
  xSpan: PropTypes.number,
};

TimeSlider.defaultProps = {
  defaultBrushExtent: [
    timeWeek.offset(timeDay.floor(new Date()), -1).getTime(),
    timeDay.floor(new Date()).getTime(),
  ], 
  onBrushEnd: newExtent => console.log(newExtent),
  spanEnd: timeDay.floor(new Date()).getTime(),
  spanUpperLimit: timeDay.floor(new Date()).getTime(),
  spanLowerLimit: timeDay.floor(new Date(Date.UTC(1999, 0, 1))).getTime(),
  maxDaysAllowedToQuery: 730,
  minimumTickWidth: 25,
  initialTickGap: 1,
  tickMeasure: 'year',
  xSpan: 2, // in years
};

export default TimeSlider;
