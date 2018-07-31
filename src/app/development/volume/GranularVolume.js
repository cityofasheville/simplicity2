import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { nest } from 'd3-collection';
import { histogram } from 'd3-array';
import { ResponsiveOrdinalFrame } from 'semiotic';
import LoadingAnimation from '../../../shared/LoadingAnimation';
import ZoomableCirclepack from './ZoomableCirclepack';
import { colorSchemes } from '../../../shared/visualization/colorSchemes';


const colorScheme = colorSchemes.bright_colors.concat(colorSchemes.bright_colors_2);

class GranularVolume extends React.Component {
  constructor() {
    super();

    this.state = {
      timeSpan: [new Date(2018, 6, 1), new Date()],
      focusNodeOrderedPath: [
        // { level: 'permit_group', selected: null },
        { level: 'permit_type', selected: true },
        { level: 'permit_subtype', selected: null },
        { level: 'permit_category', selected: null },
      ],
    }
  }

  adjustTimespan(newTimeSpan) {
    this.setState({ timeSpan: newTimeSpan });
  }

  allDataHierarchy() {
    const thisNest = nest();
    this.state.focusNodeOrderedPath.map(d => d.level)
      .forEach(level => thisNest.key(d => d[level]));
    return thisNest
      .rollup(d => d.length)
      .entries(this.props.data.permits_by_address);
  }

  // TODO: COLLAPSE THESE TWO METHODS INTO ONE

  selectedHierarchy(levelsToUse) {
    const thisNest = nest();
    levelsToUse.forEach(level => thisNest.key(d => d[level]));
    return thisNest
      .entries(this.props.data.permits_by_address);
  }


  render() {
    if (this.props.data.loading) {
      return <LoadingAnimation />;
    }

    const nestedData = this.allDataHierarchy();

    const selectedLevels = this.state.focusNodeOrderedPath
      .filter(nodeLevel => nodeLevel.selected)
      .map(nodeLevel => nodeLevel.level);

    const currentHierarchy = this.selectedHierarchy(selectedLevels);

    const nodeColors = {};
    currentHierarchy.forEach((hierarchyLevel, i) => {
      nodeColors[hierarchyLevel.key] = colorScheme[i];
    });

    const histFunc = histogram(this.props.data.permits_by_address)
      .value(d => new Date(d.applied_date));

    // TODO: THIS SHOULD BE BY DAY
    const ordinalData = [].concat(...currentHierarchy
      .map(hierarchyType => histFunc(hierarchyType.values).map(bin => ({
        key: hierarchyType.key,
        count: bin.length,
        binStartDate: bin.x0,
      }))));

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
        {/* Checkbox legend - more like checkboxes-- only show top 3 - 5 by volume by default */}
        <div className="col-md-9">
          <ResponsiveOrdinalFrame
            responsiveWidth
            data={ordinalData}
            size={[500, 200]}
            projection="vertical"
            type="bar"
            oLabel
            oAccessor="binStartDate"
            oPadding={5}
            rAccessor="count"
            style={d => ({ fill: nodeColors[d.key] })}
          />
        </div>
        <div className="col-md-3">
          <ZoomableCirclepack
            data={{ key: 'root', values: nestedData }}
            highlightLevel={selectedLevels.length}
            colorKeys={nodeColors}
          />
        </div>
      </div>
      <div id="permitValue">
        <h2>Value</h2>
      </div>
      <div id="permitFees">
        <h2>Fees</h2>
      </div>
      <div id="openClosedIssued">
        <h2>Open, Closed, Issued</h2>
      </div>
      <div id="inspections">
        <h2>Inspections</h2>
      </div>
      <div id="pacVolume">
        <h2>PAC Traffic</h2>
      </div>
      <div id="percentOnline">
        <h2>Percent Opened Online</h2>
      </div>
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
