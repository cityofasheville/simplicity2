import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveXYFrame } from 'semiotic';
import ErrorBoundary from '../../ErrorBoundary';
import { timeDay, timeMonday, timeWeek, timeMonth, timeYear } from 'd3-time';
import { whichD3TimeFunction } from './granularUtils';
import { debounce } from '../../../shared/visualization/visUtilities';

function spanOfYears(numYears) {
  return [
    timeYear.offset(new Date(), -1 * numYears).getTime(),
    new Date().getTime(),
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

  determineNewExtent(e, snap = true) {
    let newExtent = e;
    if (e) {
      // Snap to something reasonable
      const daySpan = timeDay.count(e[0], e[1]);
      const timeFunc = snap ? whichD3TimeFunction(e) : timeDay

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

  handleSubmit(e) {
    e.preventDefault();
    this.brushEnd([ this.state.firstInputVal, this.state.secondInputVal ], false)
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
              },
            ]}
            interaction={{
              during: this.brushDuring,
              end: this.brushEnd,
              brush: 'xBrush',
              extent: this.state.brushExtent,
            }}
          />
          <div style={{ textAlign: 'center', width: '100%' }}>
            <form onSubmit={this.handleSubmit} className="form-inline">
              <div className="form-group col-sm-5">
                <label htmlFor="startdate" style={{ display: 'inline-block', padding: '0 1em 0 0' }}>From:</label>
                <input
                  type="date"
                  id="startdate"
                  name="startdate"
                  className="form-control"
                  style={{ display: 'inline-block', maxWidth: '70%' }}
                  value={new Date(this.state.firstInputVal).toISOString().split('T')[0]}
                  onChange={(e) => {
                    this.setState({
                      firstInputVal: new Date(e.target.value),
                    })
                  }}
                />
              </div>
              <div className="form-group col-sm-5">
                <label htmlFor="enddate" style={{ display: 'inline-block', padding: '0 1em 0 0' }}>To:</label>
                <input
                  type="date"
                  id="enddate"
                  name="enddate"
                  className="form-control"
                  style={{ display: 'inline-block', maxWidth: '70%' }}
                  value={new Date(this.state.secondInputVal).toISOString().split('T')[0]}
                  onChange={(e) => {
                    this.setState({
                      secondInputVal: new Date(e.target.value),
                    })
                  }}
                />
              </div>
              <input type="submit" value="Set Date Range" className="btn btn-primary btn-md col-sm-2"/>
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
    timeWeek.offset(new Date(), -1).getTime(),
    new Date().getTime(),
  ], // today and today minus thirty-one days
  onBrushEnd: newExtent => console.log(newExtent),
  xSpan: spanOfYears(2), // today and today minus one year
};

export default TimeSlider;
