import React from 'react';
import { timeDay, timeWeek, timeMonth } from 'd3-time';
import PermitsTableWrapper from './PermitsTableWrapper';
import TimeSlider from '../volume/TimeSlider';
import ErrorBoundary from '../../../shared/ErrorBoundary';


class PermitsIndex extends React.Component {

  constructor(props) {
    super(props);

    let defaultExtent;
    let currentUrlParams = new URLSearchParams(window.location.search);

    if (currentUrlParams.has('rangeFrom') && currentUrlParams.has('rangeThrough')) {

      if (isNaN(currentUrlParams.get('rangeFrom')) || isNaN(currentUrlParams.get('rangeThrough'))) {
        defaultExtent = [
          this.props.initialBrushExtent[0],
          this.props.initialBrushExtent[1],
        ];  
        currentUrlParams.set('rangeFrom', this.props.initialBrushExtent[0]);
        currentUrlParams.set('rangeThrough', this.props.initialBrushExtent[1]);

        if (history.pushState) {
          let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?${currentUrlParams}`;
          window.history.pushState({path: newurl}, '', newurl);
        }

      } else {

        const rangeOverhead = timeDay.count(currentUrlParams.get('rangeThrough'), this.props.spanUpperLimit);
        const rangeUnderhead = timeDay.count(this.props.spanLowerLimit, currentUrlParams.get('rangeFrom'));

        if (rangeOverhead <= 0 || rangeUnderhead <= 0) {
          defaultExtent = [
            this.props.initialBrushExtent[0],
            this.props.initialBrushExtent[1],
          ];  
        } else {
          defaultExtent = [
            currentUrlParams.get('rangeFrom'),
            currentUrlParams.get('rangeThrough'),
          ];  
        }
      }

    } else if (currentUrlParams.has('range') && currentUrlParams.get('range').toLowerCase() === 'oneyearback') {
      defaultExtent = [
        timeMonth.offset(timeDay.floor(new Date()), -12).getTime(),
        timeDay.floor(new Date()).getTime(),
      ];
      
    } else {
      defaultExtent = [
        this.props.initialBrushExtent[0],
        this.props.initialBrushExtent[1],
      ];
    }

    currentUrlParams.set('rangeFrom', defaultExtent[0]);
    currentUrlParams.set('rangeThrough', defaultExtent[1]);
    currentUrlParams.delete('range');

    if (history.pushState) {
      let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?${currentUrlParams}`;
      window.history.pushState({path: newurl}, '', newurl);
    }

    this.state = {
      timeSpan: defaultExtent,
    };

    this.onDateRangeChange = this.onDateRangeChange.bind(this);
  }

  onDateRangeChange(newExtent) {
    let currentUrlParams = new URLSearchParams(window.location.search);
    currentUrlParams.set('rangeFrom', newExtent[0]);
    currentUrlParams.set('rangeThrough', newExtent[1]);

    if (history.pushState) {
      let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?${currentUrlParams}`;
      window.history.pushState({path: newurl}, '', newurl);
    }

    this.setState({
      timeSpan: newExtent,
    });
  }

  render() {
    return (
      <div className="container">
        <h1>All Permit Applications</h1>
        <hr />
        <h2 style={{marginTop: "32px"}}>Filter Permits by Date Applied</h2>
        <ErrorBoundary>
          <TimeSlider
            onBrushEnd={(newExtent) => {
              this.onDateRangeChange(newExtent);
            }}
            defaultBrushExtent={this.state.timeSpan}
            spanLowerLimit={this.props.spanLowerLimit}
            spanUpperLimit={this.props.spanUpperLimit}
            xSpan={2}
          />
          <PermitsTableWrapper
            // Defaults are fine for now
            after={this.state.timeSpan[0]}
            before={this.state.timeSpan[1]}
            permit_groups={['Permits', 'Planning']}
          />
        </ErrorBoundary>
      </div>
    );
  }
}

PermitsIndex.defaultProps = {
  initialBrushExtent: [
    timeMonth.offset(timeDay.floor(new Date()), -1).getTime(),
    timeDay.floor(new Date()).getTime(),
  ], 
  spanUpperLimit: timeDay.floor(new Date()).getTime(),
  spanLowerLimit: timeDay.floor(new Date(Date.UTC(1999, 0, 1))).getTime(),
};

export default PermitsIndex;
