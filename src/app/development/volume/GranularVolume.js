import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { nest } from 'd3-collection';
import { color } from 'd3-color';
import { histogram } from 'd3-array';
import { FacetController, ResponsiveOrdinalFrame } from 'semiotic';
import LoadingAnimation from '../../../shared/LoadingAnimation';
import PermitTypeMenus from './PermitTypeMenus';
import PermitVolCirclepack from './PermitVolCirclepack';
import VolumeHistogram from './VolumeHistogram';
import Tooltip from '../../../shared/visualization/Tooltip';


const colorScheme = [
  '#B66DFF',
  '#DB6D00',
  '#006DDB',
  '#FF6DB6',
  '#920000',
  '#01b0b0',
  '#2fe12f',
  '#004949',
  '#6DB6FF',
  '#490092',
  '#920000',
  '#006DDB',
  '#490092',
  '#FF6DB6',
  '#DB6D00',
  '#2fe12f',
  '#01b0b0',
  '#6DB6FF',
  '#FFBDDB',
];

const otherGroupCutoff = 5;
// Standard date format for comparison
const dateOptions = {
  // weekday: 'short',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

function selectHierarchy(filteredData, selectedLevels, rollup = false) {
  let useLevels = selectedLevels;
  if (typeof selectedLevels === 'string') {
    useLevels = [selectedLevels];
  }
  const thisNest = nest();
  useLevels.forEach(level => thisNest.key(d => d[level]));

  if (rollup) {
    thisNest.rollup(d => d.length);
  }
  return thisNest
    .entries(filteredData);
}

function groupHierachyOthers(inputHierarchy, rolledUp = false) {
  const hierarchyToUse = inputHierarchy.slice(0, otherGroupCutoff);
  if (rolledUp) {
    const others = [].concat(...inputHierarchy.slice(
      otherGroupCutoff,
      inputHierarchy.length - 1
    ).map(d => d.value))
      .reduce((a, b) => a + b);

    hierarchyToUse.push({
      key: 'Other',
      value: others,
    });
    return hierarchyToUse.sort((a, b) => b.value - a.value);
  }

  const others = [].concat(...inputHierarchy.slice(
    otherGroupCutoff,
    inputHierarchy.length - 1
  ).map(d => d.values));

  hierarchyToUse.push({
    key: 'Other',
    values: others,
  });
  return hierarchyToUse.sort((a, b) => b.values.length - a.values.length);
}


class GranularVolume extends React.Component {
  constructor() {
    super();

    this.state = {
      timeSpan: [new Date(2018, 6, 1), new Date()],
      hierarchyLevels: [
        { name: 'permit_type', selectedCat: null },
        { name: 'permit_subtype', selectedCat: null },
        { name: 'permit_category', selectedCat: null },
      ],
    };

    this.onMenuSelect = this.onMenuSelect.bind(this);
  }

  adjustTimespan(newTimeSpan) {
    this.setState({ timeSpan: newTimeSpan });
  }

  timeBuckets() {
    const includedDates = [];
    const oneDayMilliseconds = (24 * 60 * 60 * 1000);
    let dateToAdd = new Date(this.state.timeSpan[0]).getTime();
    const lastDate = new Date(this.state.timeSpan[1]).getTime();
    while (dateToAdd <= lastDate) {
      includedDates.push(new Date(dateToAdd));
      dateToAdd += oneDayMilliseconds;
    }
    return includedDates;
  }

  ordinalFromHierarchical(unrolledHierarchy, includedDates) {
    const histFunc = histogram(this.props.data.permits_by_address)
      .value(d => new Date(d.applied_date))
      .thresholds(includedDates);

    return [].concat(...unrolledHierarchy
      .map((hierarchyType) => {
        const binnedValues = histFunc(hierarchyType.values);
        return includedDates.map((thisDate) => {
          const bin = binnedValues.find(v => new Date(v.x0).toLocaleDateString('en-US', dateOptions) === new Date(thisDate).toLocaleDateString('en-US', dateOptions));
          const binLength = bin ? bin.length : 0;
          return {
            key: hierarchyType.key,
            count: binLength,
            binStartDate: thisDate,
            values: bin || [],
          };
        });
      }));
  }

  filterData() {
    // Filter based on what is selected in dropdowns
    return this.props.data.permits_by_address.filter((d) => {
      let use = true;
      this.state.hierarchyLevels.forEach((level) => {
        if (!level.selectedCat) { return; }
        use = use && d[level.name] === level.selectedCat;
      });
      return use;
    });
  }

  onMenuSelect(e, levelIndex) {
    const newVal = e.target.value === 'null' ? null : e.target.value;
    const newLevels = [...this.state.hierarchyLevels];
    // console.log(newLevels, levelIndex)
    newLevels[levelIndex].selectedCat = newVal;
    for (let changeIndex = newLevels.length - 1; changeIndex > levelIndex; changeIndex--) {
      newLevels[changeIndex].selectedCat = null;
    }
    this.setState({ hierarchyLevels: newLevels });
  }

  render() {
    if (this.props.data.loading) {
      return <LoadingAnimation />;
    }

    if (this.props.data.error) {
      console.log(this.props.data.error);
      return (<div>
        Error :(
      </div>);
    }

    /*
      TO ASK:
        Should menus show all types or show other?  Or indicate type has been rolled into other?
        Or should we do checkboxes like the other one instead of making "other"?
        Is this the right date field to use?

      TODO:
        props validation
        separate out graphql query
        timepicker
        bin by week if it's over 6 weeks, by month if it's over 1 year
        fix date issue-- have checkdate start at right place
        start in on small multiples
        hover behavior-- shared?
        allow users to drill into permits with click/modal behavior
        update URL to allow bookmarking
    */

    // All data to use for dropdowns
    const bigNest = nest();
    this.state.hierarchyLevels.forEach(level => bigNest.key(d => d[level.name]));
    const wholeHierarchy = bigNest.object(this.props.data.permits_by_address);

    // Filtered by what's actually showing now
    const filteredData = this.filterData();

    let firstIndexUnselected = this.state.hierarchyLevels.map(l => l.selectedCat).indexOf(null);
    if (firstIndexUnselected === -1) {
      // Hierarchy is just key: whatever, values: filteredData
      firstIndexUnselected = this.state.hierarchyLevels.length - 1;
    }

    // Are we viewing permit type, subtype, or category?
    const selectedLevel = this.state.hierarchyLevels[firstIndexUnselected].name;

    // For circlepack
    let rolledHierarchy = selectHierarchy(filteredData, selectedLevel, true)
      .sort((a, b) => b.value - a.value);

    // Data sorted into as many levels as are selected
    let unrolledHierarchy = selectHierarchy(filteredData, selectedLevel)
      .sort((a, b) => b.values.length - a.values.length);

    if (rolledHierarchy.length > otherGroupCutoff) {
      rolledHierarchy = groupHierachyOthers(rolledHierarchy, true);
      unrolledHierarchy = groupHierachyOthers(unrolledHierarchy);
    }

    // Determine what colors each key within that hierarchy should be
    const nodeColors = { root: 'none' };
    unrolledHierarchy.forEach((hierarchyLevel, i) => {
      nodeColors[hierarchyLevel.key] = colorScheme[i];
    });

    const includedDates = this.timeBuckets();
    const ordinalData = this.ordinalFromHierarchical(unrolledHierarchy, includedDates);

    // status_current = Issued
    const issuedOrdinal = ordinalData.map((datum) => {
      const rObj = Object.assign({}, datum);
      rObj.values = datum.values.filter(val => val.status_current === 'Issued');
      rObj.count = rObj.values.length;
      rObj.issued = true;
      return rObj;
    });
    const notIssuedOrdinal = ordinalData.map((datum) => {
      const rObj = Object.assign({}, datum);
      rObj.values = datum.values.filter(val => val.status_current !== 'Issued');
      rObj.count = rObj.values.length;
      rObj.issued = false;
      return rObj;
    });
    const ordinalWithStatus = notIssuedOrdinal.concat(issuedOrdinal);

    return (<div>
      <h1>Permit Volume for {`${new Date(includedDates[0]).toLocaleDateString('en-US', dateOptions)} to ${new Date(includedDates[includedDates.length - 1]).toLocaleDateString('en-US', dateOptions)}`}</h1>
      <div id="controls-n-summary" className="row">
        <PermitTypeMenus
          onSelect={this.onMenuSelect}
          parentHierarchyLevels={this.state.hierarchyLevels}
          wholeHierarchy={wholeHierarchy}
        />
        <div className="col-md-9">
          <h2>Daily</h2>
          <VolumeHistogram
            data={ordinalData}
            nodeColors={nodeColors}
          />
          {/* Checkbox legend - more like checkboxes-- only show top 3 - 5 by volume by default */}
        </div>
        <div className="col-md-3 granularVolCirclepack">
          <h2>Total</h2>
          <PermitVolCirclepack
            data={{ key: 'root', values: rolledHierarchy }}
            colorKeys={nodeColors}
          />
        </div>
      </div>
      <div
        id="openClosedIssued"
      >
        <h2>Issued or Not</h2>
        <div
          style={{
            display: 'flex',
            padding: '0 1%',
            textTransform: 'capitalize',
          }}
        >
          <FacetController
            size={[185, 185]}
            margin={{
              top: 40,
              right: 10,
              bottom: 10,
              left: 25,
            }}
            oPadding={1}
            oAccessor="binStartDate"
            rAccessor="count"
            type="bar"
            pieceIDAccessor="key"
            axis={[
              {
                orient: 'left',
                tickFormat: d => (
                  <text
                    textAnchor="end"
                    style={{ fontSize: '0.70em' }}
                  >
                    {d}
                  </text>
                ),
              },
            ]}
            hoverAnnotation
            tooltipContent={(d) => {
              const pieces = d.type === 'column-hover' ? d.pieces : [d.data];
              const title = new Date(pieces[0].binStartDate).toLocaleDateString('en-US', dateOptions);

              const textLines = pieces.map(piece => ({
                text: `${piece.issued ? 'Issued' : 'Not Issued'}: ${piece.count}`,
                color: nodeColors[piece.key],
              })).reverse();

              return (<Tooltip
                title={title}
                textLines={textLines}
              />);
            }}
          >
            {/* foreach permit type showing (see menus for logic) */}
            {unrolledHierarchy.map(unroll => (
              // colors are shades of unroll key
              <ResponsiveOrdinalFrame
                responsiveWidth
                key={unroll.key}
                data={ordinalWithStatus.filter(d => d.key === unroll.key)}
                title={unroll.key}
                style={d => {
                  return {
                    fill: d.issued ? nodeColors[unroll.key] : color(nodeColors[unroll.key]).brighter(2)
                  };
                }}
              />
            ))}
          </FacetController>
        </div>
      </div>
      <div id="permitValue">
        <h2>Value</h2>
      </div>
      <div id="permitFees">
        <h2>Fees</h2>
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
      after: 'Jun 30 2018',
    },
  },
})(GranularVolume);
