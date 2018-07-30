import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { nest } from 'd3-collection';
import LoadingAnimation from '../../../shared/LoadingAnimation';
import ZoomableCirclepack from './ZoomableCirclepack';
import { ResponsiveXYFrame } from 'semiotic';


class GranularVolume extends React.Component {
  constructor() {
    super();

    this.state = {
      timeSpan: [new Date(2017, 7, 1), new Date()],
      focusNodeOrderedPath: [
        { level: 'permit_group', selected: null },
        { level: 'permit_type', selected: null },
        { level: 'permit_subtype', selected: null },
        { level: 'permit_category', selected: null },
      ], // the node whose children have focus
    };
  }

  adjustTimespan(newTimeSpan) {
    this.setState({ timeSpan: newTimeSpan });
  }

  allDataHierarchy() {
    let thisNest = nest();
    this.state.focusNodeOrderedPath.map(d => d.level).forEach(level => thisNest = thisNest.key(d => d[level]));
    return thisNest
      .rollup(d => d.length)
      .entries(this.props.data.permits_by_address);
  }

  selectedHierarchy(levelsToUse) {
    let thisNest = nest();
    levelsToUse.forEach(level => thisNest = thisNest.key(d => d[level]));
    return thisNest
      .entries(this.props.data.permits_by_address);
  }


  render() {
    if (this.props.data.loading) {
      return <LoadingAnimation />;
    }

    const nestedData = this.allDataHierarchy();

    const lineData = this.selectedHierarchy(['permit_group']);

    console.log(lineData)

    return (<div>
      <h1>Permit Volume II</h1>
      <div id="vol-controls" className="row">
        {/* Permit hierarchy filter buttons */}
        <div style={{ margin: '1%' }} >
          {this.state.focusNodeOrderedPath.map(pathOption =>
            // if it and the pathoption before it has a value, then show it
            (<div
              style={{
                display: 'inline-block',
                padding: '0 1%',
                textTransform: 'capitalize',
              }}
              key={pathOption.level}
            >
              {pathOption.level.replace('_', ' ')}: dropdown here
            </div>)
          )}
        </div>
        {/* Checkbox legend - more like checkboxes */}
        {/* zoomable circlepack that reflects permit hierarchy buttons */}
        <div className="col-md-3">
          <ZoomableCirclepack
            data={{ key: 'root', values: nestedData }}
          />
        </div>
        <div className="col-md-9">
          {/* brushable histogram that reflects time picker-- label brush with annotation?  add timespan to title of all graphs and page? */}
          {/* <ResponsiveXYFrame */}
          {/*   title="All Years" */}
          {/*   responsiveWidth */}
          {/*   size={[1000, 200]} */}
          {/*   margin={{ */}
          {/*     top: 40, */}
          {/*     bottom: 60, */}
          {/*     left: 50, */}
          {/*     right: 40, */}
          {/*   }} */}
          {/*   lines={lineData} */}
          {/*   lineDataAccessor="values" */}
          {/*   lineType="line" */}
          {/*   xAccessor={d => new Date(d.applied_date)} */}
          {/*   yAccessor="volume" */}
          {/*   yExtent={[0, undefined]} */}
          {/*   xExtent={this.timeSpan} */}
          {/*   lineStyle={d => ({ stroke: d.coordinates[0].color, strokeWidth: 2 })} */}
          {/*   axes={[ */}
          {/*     { */}
          {/*       orient: 'bottom', */}
          {/*       tickFormat: d => new Date(d).getFullYear(), */}
          {/*       tickValues: this.years, */}
          {/*     }, */}
          {/*   ]} */}
          {/*   interaction={{ */}
          {/*     end: this.brushEnd, */}
          {/*     brush: 'xBrush', */}
          {/*     extent: this.state.brushExtent, */}
          {/*   }} */}
          {/* /> */}
        </div>
      </div>
      <div id="permitValue">
        <h2>Value</h2>
      </div>
      {/* Value Section */}
      {/* Fees Section */}
      {/* Open, Closed, Issued Section */}
      {/* Percent Opened Online Section */}
      {/* Inspections by Type */}
      {/* PAC by type */}
    </div>);
  }
}

// TODO: PROPS VALIDATION

const getPermitsQuery = gql`
  query getPermitsQuery($civicaddress_id: Int!, $radius: Int, $after: String) {
    permits_by_address(civicaddress_id: $civicaddress_id, radius: $radius, after: $after) {
        permit_number
        permit_group
        permit_type
        permit_subtype
        permit_category
        permit_description
        applicant_name
        applied_date
        status_current
        status_date
        civic_address_id
        address
        x
        y
    }
  }
`;

export default graphql(getPermitsQuery, {
  options: {
    variables: {
      civicaddress_id: 9688,
      radius: 52800,
      after: 'Jul 01 2018',
    },
  },
})(GranularVolume);
