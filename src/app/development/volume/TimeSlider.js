import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveXYFrame } from 'semiotic';
import ErrorBoundary from '../../ErrorBoundary';
import { timeDay, timeMonday, timeWeek, timeMonth, timeYear } from 'd3-time';
import { whichD3TimeFunction } from './granularUtils';
import { debounce } from '../../../shared/visualization/visUtilities';

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

  determineNewExtent(e) {
    let newExtent = e;
    if (e) {

      let timeFunc = timeDay;
      if (this.props.snap) {
        timeFunc = whichD3TimeFunction(e);
        newExtent = [timeFunc.floor(e[0]), timeFunc.ceil(e[1])];
      }

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
      firstInputVal: newExtent[0],
      secondInputVal: newExtent[1],
    });
  }

  brushEnd(e) {
    const newExtent = this.determineNewExtent(e);
    this.props.onBrushEnd(newExtent);
    this.setState({
      brushExtent: newExtent,
      firstInputVal: newExtent[0],
      secondInputVal: newExtent[1],
    });
    console.log(this.state)
  }

  handleSubmit(e) {
    console.log('submit', this.state)
    e.preventDefault();
    this.brushEnd([ this.state.firstInputVal, this.state.secondInputVal ])
  }

  render() {
    const ticks = timeMonth.range(
      timeMonth.ceil(this.props.xSpan[0]),
      timeMonth.ceil(this.props.xSpan[1]),
    )
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
                    {new Date(d).toLocaleDateString(
                      'en-US',
                      {
                        month: 'short',
                        year: 'numeric',
                        timeZone: 'UTC'
                      },
                    )}
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
              <div className="form-group" style={{ display: 'inline-block', padding: '0 0.75em', whiteSpace: 'nowrap' }}>
                <label htmlFor="startdate" style={{ display: 'inline-block', padding: '0 1em 0 0' }}>From</label>
                <input
                  type="date"
                  id="startdate"
                  name="startdate"
                  className="form-control input-sm"
                  style={{ display: 'inline-block', width: '11em' }}
                  value={new Date(this.state.firstInputVal).toISOString().split('T')[0]}
                  onChange={(e) => {
                    const date = Date.parse(`${e.target.value} 00:00:01 GMT-0400`);
                    this.setState({
                      firstInputVal: date,
                    })
                  }}
                />
              </div>
              <div className="form-group" style={{ display: 'inline-block', padding: '0 1em', whiteSpace: 'nowrap' }}>
                <label htmlFor="enddate" style={{ display: 'inline-block', padding: '0 0.75em 0 0' }}>To</label>
                <input
                  type="date"
                  id="enddate"
                  name="enddate"
                  className="form-control input-sm"
                  style={{ display: 'inline-block', width: '11em' }}
                  value={new Date(this.state.secondInputVal).toISOString().split('T')[0]}
                  onChange={(e) => {
                    console.log(e.target.value)
                    const date = Date.parse(`${e.target.value} 23:59:59 GMT-0400`);
                    this.setState({
                      secondInputVal: date,
                    })
                  }}
                />
              </div>
              <input type="submit" value="Set Dates" className="btn btn-primary btn-sm" style={{ margin: '0 1em' }}/>
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
  snap: PropTypes.bool,
};

TimeSlider.defaultProps = {
  defaultBrushExtent: [
    timeWeek.offset(timeDay.floor(new Date()), -1).getTime(),
    timeDay.floor(new Date()).getTime(),
  ], // today and today minus thirty-one days
  onBrushEnd: newExtent => console.log(newExtent),
  xSpan: spanOfYears(2), // today and today minus one year
  snap: false,
};

export default TimeSlider;
