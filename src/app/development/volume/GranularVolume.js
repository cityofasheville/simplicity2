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
import { labelOrder } from '../../../shared/visualization/visUtilities';


const colorScheme = colorSchemes.bright_colors.concat(colorSchemes.bright_colors_2);
const otherGroupCutoff = 7;
    // Standard date format for comparison
    const dateOptions = {
      // weekday: 'short',
      year: '2-digit',
      month: 'short',
      day: 'numeric',
    };

class GranularVolume extends React.Component {
  constructor() {
    super();

    this.state = {
      timeSpan: [new Date(2018, 6, 1), new Date()],
      hierarchyLevels: [
        { name: 'permit_type', selectedCat: 'Residential' },
        { name: 'permit_subtype', selectedCat: 'Trade' },
        { name: 'permit_category', selectedCat: null },
      ]
    }
  }

  adjustTimespan(newTimeSpan) {
    this.setState({ timeSpan: newTimeSpan });
  }

  selectedHierarchy(filteredData, selectedLevel, rollup = false) {
    const thisNest = nest().key(d => d[selectedLevel.name])
    if (rollup) {
      thisNest.rollup(d => d.length);
    }
    return thisNest
      .entries(filteredData);
  }

  groupHierachyOthers(inputHierarchy, rolledUp = false) {
    const hierarchyToUse = inputHierarchy.slice(0, otherGroupCutoff);

    if (rolledUp) {
      const others = [].concat(...inputHierarchy.slice(
        otherGroupCutoff,
        inputHierarchy.length - 1
      ).map(d => d.value))
        .reduce((a, b) =>  a + b)

      hierarchyToUse.push({
        key: 'Other',
        value: others,
      })

      return hierarchyToUse.sort((a, b) => b.value - a.value);
    }

    const others = [].concat(...inputHierarchy.slice(
      otherGroupCutoff,
      inputHierarchy.length - 1
    ).map(d => d.values));

    hierarchyToUse.push({
      key: 'Other',
      values: others,
    })

    return hierarchyToUse.sort((a, b) => b.values.length - a.values.length);
  }

  timeBuckets() {
    // What dates are we even including?
    const includedDates = this.props.data.permits_by_address
      .map(d => new Date(d.applied_date))
      .sort((a, b) => a - b)
      .map(d => d.toLocaleDateString('en-US', dateOptions))
      .filter((d, i, a) => a.indexOf(d) === i)
      .map(d => new Date(d));

    const includedDatesMilliseconds = includedDates.map(d => d.getTime());
    let checkDate = includedDatesMilliseconds[0];
    // TODO: have checkdate start at query date-- maybe just fill an array with all the dates until we're at the end date?

    while (checkDate < includedDatesMilliseconds[includedDatesMilliseconds.length - 1]) {
      if (includedDatesMilliseconds.indexOf(checkDate) < 0) {
        includedDates.push(new Date(checkDate));
      }
      checkDate += (24 * 60 * 60 * 1000);
    }
    return includedDates.sort((a, b) => a - b);
  }

  ordinalFromHierarchical(unrolledHierarchy, includedDates) {
    const histFunc = histogram(this.props.data.permits_by_address)
      .value(d => new Date(d.applied_date))
      .thresholds(includedDates);

    return [].concat(...unrolledHierarchy
      .map((hierarchyType) => {
        const binnedValues = histFunc(hierarchyType.values);
        return binnedValues.map(bin => ({
          key: hierarchyType.key,
          count: bin.length,
          binStartDate: new Date(bin.x0),
        }));
      }));
  }

  filterData() {
    // Filter based on what is selected in dropdowns
    return this.props.data.permits_by_address.filter(d => {
      let use = true;
      this.state.hierarchyLevels.forEach(level => {
        if (!level.selectedCat) { return; }
        use = use && d[level.name] === level.selectedCat;
      })
      return use;
    });
  }

  render() {
    if (this.props.data.loading) {
      return <LoadingAnimation />;
    }

    const bigNest = nest()
    this.state.hierarchyLevels.forEach(level => bigNest.key(d => d[level.name]))
    const wholeHierarchy = bigNest.object(this.props.data.permits_by_address)

    console.log(wholeHierarchy)

    const filteredData = this.filterData();

    let lastIndexUnselected = this.state.hierarchyLevels.map(l => l.selectedCat).lastIndexOf(null);
    if (lastIndexUnselected === -1) {
      // Hierarchy is just key: whatever, values: filteredData
      lastIndexUnselected = this.state.hierarchyLevels.length - 1;
    }

    // Are we viewing permit type, subtype, or category?
    const selectedLevel = this.state.hierarchyLevels[lastIndexUnselected];

    // For circlepack
    let rolledHierarchy = this.selectedHierarchy(filteredData, selectedLevel, true)
      .sort((a, b) => b.value - a.value);

    // Data sorted into as many levels as are selected
    let unrolledHierarchy = this.selectedHierarchy(filteredData, selectedLevel)
      .sort((a, b) => b.values.length - a.values.length);

    if (rolledHierarchy.length > otherGroupCutoff) {
      rolledHierarchy = this.groupHierachyOthers(rolledHierarchy, true);
      unrolledHierarchy = this.groupHierachyOthers(unrolledHierarchy);
    }

    // Determine what colors each key within that hierarchy should be
    const nodeColors = { root: 'none' };
    unrolledHierarchy.forEach((hierarchyLevel, i) => {
      nodeColors[hierarchyLevel.key] = colorScheme[i];
    });

    const includedDates = this.timeBuckets();
    const ordinalData = this.ordinalFromHierarchical(unrolledHierarchy, includedDates);

    return (<div>
      <h1>Permit Volume II</h1>
      <div id="vol-controls" className="row">
        {/* Permit hierarchy filter buttons */}
        <div style={{ margin: '1%' }} >
          {this.state.hierarchyLevels.map((level, i, array) => {
            // If the level before it has no selection, don't show it
            if (i > 0 && array[i - 1].selectedCat === null) {
              return null;
            }
            let keyLevel = wholeHierarchy;
            for (let index = 0; index < i; index ++) {
              keyLevel = keyLevel[array[index].selectedCat]
              console.log(level.name, keyLevel)
            }

            console.log(level.name, Object.keys(keyLevel))

            // If the value is not null, make it a selected dropdown
            // If someone changes the selected dropdown of one earlier in the array, the later one's value should be cleared
            return (<div
              style={{
                display: 'inline-block',
                padding: '0 1%',
                textTransform: 'capitalize',
              }}
              key={level.name}
            >
            <p>{`${level.name.replace('_', ' ')}: `}</p>
            <select
              name={level.name}
              onChange={e => console.log(e)}
            >
              <option value="null"></option>
              {Object.keys(keyLevel).map(key => (
                <option
                  value={key}
                  selected={key === level.selectedCat}
                >
                  {key}
                </option>
              ))}
            </select>
            </div>)
          }
          )}
        </div>
        {/* Checkbox legend - more like checkboxes-- only show top 3 - 5 by volume by default */}
        <div className="col-md-9">
          <h3>Daily Volume for {`${new Date(includedDates[0]).toLocaleDateString('en-US', dateOptions)} to ${new Date(includedDates[includedDates.length - 1]).toLocaleDateString('en-US', dateOptions)}`}</h3>
          <ResponsiveOrdinalFrame
            responsiveWidth
            data={ordinalData}
            size={[500, 200]}
            projection="vertical"
            type="bar"
            margin={{
              top: 10,
              right: 10,
              bottom: 60,
              left: 20,
            }}
            oLabel={(d) => {
              const dateString = new Date(d).toLocaleDateString('en-US', dateOptions);
              return (
                <text
                  textAnchor={'end'}
                  transform={'rotate(-45)'}
                  style={{ fontSize: '0.75em' }}
                >
                  {dateString}
                </text>
              )
            }}
            oAccessor="binStartDate"
            oPadding={5}
            rAccessor="count"
            style={d => ({ fill: nodeColors[d.key] })}
          />
        </div>
        <div className="col-md-3 granularVolCirclepack">
          <h3>Total Volume</h3>
          <ZoomableCirclepack
            data={{ key: 'root', values: rolledHierarchy }}
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
      after: 'Jun 30 2018',
    },
  },
})(GranularVolume);
