import React from 'react';
import { timeDay, timeWeek, timeMonth } from 'd3-time';
import PermitsTableWrapper from './PermitsTableWrapper';
import TimeSlider from '../volume/TimeSlider';
import ErrorBoundary from '../../../shared/ErrorBoundary';
// import PermitSearchBar from './PermitSearchBar';


class PermitsIndex extends React.Component {
  constructor(props) {
    super(props);
    // const now = timeDay.floor(new Date());
    // this.initialBrushExtent = [
    //   this.props.initialBrushExtent,
    //   now.getTime(),
    // ];
    console.log(props);
    this.state = {
      timeSpan: this.props.initialBrushExtent,
    };
  }

  // onDateRangeChange(filter) {
  //   let newParams = '';
  //   if (filter.length > 0) {
  //     newParams = `${filter
  //       .map(filterObj => `${filterObj.id}=${filterObj.value}`)
  //       .join('&')}`;
  //   }
  //   window
  //     .history
  //     .pushState(
  //       {},
  //       '',
  //       `${location.pathname}${newParams.length > 0 ? '?' : ''}${newParams}${location.hash}`
  //     );
  //   this.setState({
  //     filtered: filter,
  //   });
  // }

  // componentDidMount() {

  // }

  render() {
    return (
      <div className="container">
        <h1>All Permit Applications</h1>
        <hr />
        {/* <h2>Look Up an Existing Application</h2>
        <PermitSearchBar /> */}
        <h2 style={{marginTop: "32px"}}>Filter Permits by Date Applied</h2>
        <ErrorBoundary>
          <TimeSlider
            onBrushEnd={newExtent => this.setState({
              timeSpan: newExtent,
            })}
            defaultBrushExtent={this.state.timeSpan}
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
    timeMonth.offset(timeDay.floor(new Date()), -3).getTime(),
    timeDay.floor(new Date()).getTime(),
  ], // today and today minus 3 months
};

export default PermitsIndex;
