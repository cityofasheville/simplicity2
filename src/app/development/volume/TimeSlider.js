import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveXYFrame } from 'semiotic';
import moment from 'moment';
import { timeDay, timeWeek, timeMonth, timeYear } from 'd3-time';
import ErrorBoundary from '../../../shared/ErrorBoundary';

class TimeSlider extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      brushExtent: this.props.defaultBrushExtent,
      firstInputVal: this.props.defaultBrushExtent[0],
      secondInputVal: this.props.defaultBrushExtent[1],
      spanEnd: this.props.spanEnd,
      xSpan: [
        timeYear.offset(this.props.spanEnd, -1 * this.props.xSpan).getTime(),
        this.props.spanEnd,
      ],
      initialParamsChecked: false,
    };

    this.determineNewExtent = this.determineNewExtent.bind(this);
    this.brushDuring = this.brushDuring.bind(this);
    this.brushEnd = this.brushEnd.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  determineNewExtent(e, snap = false) {
    let newExtent = e;
    let newSpan = this.state.xSpan;

    // If someone just clicked on the timeline there might not be an e
    if (e) {

      // When brushing stops (brushEnd calls with snap=true), snap to "whole time" (drop the decimal part)
      if (snap) {
        const timeFunc = timeDay;
        newExtent = [timeFunc.floor(e[0]).getTime(), timeFunc.ceil(e[1]).getTime()];
      }

      let selectedRange = timeDay.count(newExtent[0], newExtent[1]);
      let spanRange = timeDay.count(this.state.xSpan[0], this.state.xSpan[1]);
      let rangeDiff = spanRange - selectedRange;
      let rangeOverhead = timeDay.count(newExtent[1], this.props.spanUpperLimit);
      let rangeUnderhead = timeDay.count(this.props.spanLowerLimit, newExtent[0]);

      if (rangeOverhead <= 0 || rangeUnderhead <= 0) {
        return {
          extent: this.state.brushExtent,
          span: newSpan
        };
      }

      // Don't allow ranges bigger or smaller (i.e. negative) than allowed, just reset to "last good" value
      if (selectedRange > this.props.maxDaysAllowedToQuery || +newExtent[0] >= +newExtent[1]) {
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
      // Don't allow date ranges starting before AND ending after the current span
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

      // Selected date above current span ceiling?
        // Is selected date above permitted upper limit for span?
      // if (+newExtent[1] > +this.state.xSpan[1]) {
      //   if (+newExtent[1] > +this.props.spanUpperLimit) {
      //     newExtent[1] = this.props.spanUpperLimit;
      //   }
      //   newExtent[1] = this.state.xSpan[1];
      // }
      // Start date selected is before start of current span
      if (+newExtent[0] < +this.state.xSpan[0]) {

        // Is new start date valid for existing data? (e.g. > 1999-ish)
        // - if no, just reset to "last good" values as above
        // If valid, does it create a span larger than our max range? (e.g. over 2 years)
        // - if yes, set end date and span end = [new start] + [max range]
        // - if no, keep end date and reset span start/end (leave space before start and after end? like (maxRange - selectedDateRange) / 2)

        // newExtent[0] = this.state.xSpan[0];
      }
      

    } else {
      // If there isn't an e value
      newExtent = this.state.brushExtent;
    }
    return {
      extent: newExtent,
      span: newSpan
    };
  }

  brushDuring(e) {
    const newRanges = this.determineNewExtent(e, false);
    this.setState({
      brushExtent: newRanges.extent,
      firstInputVal: newRanges.extent[0],
      secondInputVal: newRanges.extent[1],
    });
  }

  brushEnd(e, snap = true) {
    const newRanges = this.determineNewExtent(e, snap);
    this.props.onBrushEnd(newRanges.extent);
    this.setState({
      brushExtent: newRanges.extent,
      firstInputVal: newRanges.extent[0],
      secondInputVal: newRanges.extent[1],
      xSpan: newRanges.span,
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

  componentDidMount() {
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

  render() {
    const ticks = timeMonth.range(
      timeMonth.ceil(this.state.xSpan[0]),
      timeMonth.ceil(this.state.xSpan[1]),
    );
    // TODO: Use hover annotation and fake lines to make tooltip
    return (
      <div
        className="brushedChart"
        style={{ width: '100%', margin: '2em 0' }}
      >
        <ErrorBoundary>
          <div>
            <form onSubmit={this.handleSubmit} className="timepicker-dropdown">
              <div
                className="timepicker-input-item"
              >
                <label
                  htmlFor="startdate"
                  // style={{ display: 'inline-block', padding: '0 0.25em 0 0' }}
                >
                  From
                </label>
                <input
                  type="date"
                  id="startdate"
                  name="startdate"
                  className="form-control input-sm"
                  // style={{ display: 'inline-block', width: '11em' }}
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
                className="timepicker-input-item"
              >
                <label
                  htmlFor="enddate"
                >
                  through
                </label>
                <input
                  type="date"
                  id="enddate"
                  name="enddate"
                  className="form-control input-sm"
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
                className="btn btn-primary btn-sm timepicker-input-item"
              />
            </form>
          </div>
          {document.documentElement.clientWidth > 600 &&
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
                    style={{ fontSize: '0.70em' }}
                    transform="rotate(-45)"
                  >
                    {moment.utc(d).format('MMM YY')}
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
          />}
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
  spanLowerLimit: timeDay.floor(new Date(Date.UTC(1999, 6, 1))).getTime(),
  maxDaysAllowedToQuery: 730,
  xSpan: 2, // in years
};

export default TimeSlider;
