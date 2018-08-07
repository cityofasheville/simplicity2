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


function groupHierachyOthers(inputHierarchy) {
  const hierarchyToUse = inputHierarchy.slice(0, otherGroupCutoff);

  const others = [].concat(...inputHierarchy.slice(
    otherGroupCutoff,
    inputHierarchy.length - 1
  ).map(d => d.values));

  hierarchyToUse.push({
    key: 'Other',
    values: others,
    value: others.length,
  });
  return hierarchyToUse.sort((a, b) => b.value - a.value);
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

  ordinalFromHierarchical(entriesHierarchy, includedDates) {
    const histFunc = histogram(this.props.data.permits_by_address)
      .value(d => new Date(d.applied_date))
      .thresholds(includedDates);

    return [].concat(...entriesHierarchy
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

  onMenuSelect(e, levelIndex) {
    const newVal = e.target.value === 'null' ? null : e.target.value;
    const newLevels = [...this.state.hierarchyLevels];
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

    let firstIndexUnselected = this.state.hierarchyLevels.map(l => l.selectedCat).indexOf(null);
    if (firstIndexUnselected === -1) {
      // Hierarchy is just key: whatever, values: filteredData
      firstIndexUnselected = this.state.hierarchyLevels.length - 1;
    }

    // Current data separated into groups
    const bigNest = nest();
    for (let i = 0; i <= firstIndexUnselected; i++) {
      bigNest.key(d => d[this.state.hierarchyLevels[i].name]);
    }

    const wholeHierarchy = bigNest.object(this.props.data.permits_by_address);

    let filteredData = wholeHierarchy;
    for (let i = 0; i < firstIndexUnselected; i++) {
      filteredData = wholeHierarchy[this.state.hierarchyLevels[i].selectedCat];
    }

    let entriesHierarchy = Object.keys(filteredData).map(key => ({
      key,
      values: filteredData[key],
      value: filteredData[key].length,
    })).sort((a, b) => b.value - a.value);

    if (entriesHierarchy.length > otherGroupCutoff) {
      entriesHierarchy = groupHierachyOthers(entriesHierarchy);
    }

    // Determine what colors each key within that hierarchy should be
    const nodeColors = { root: 'none' };
    entriesHierarchy.forEach((hierarchyLevel, i) => {
      nodeColors[hierarchyLevel.key] = colorScheme[i];
    });

    const includedDates = this.timeBuckets();
    const ordinalData = this.ordinalFromHierarchical(entriesHierarchy, includedDates);

    const ordinalWithStatus = [];
    ordinalData.forEach((datum) => {
      const issued = Object.assign({}, datum);
      const notIssued = Object.assign({}, datum);
      // TODO: ONLY ASSIGN VALUES NECESSARY
      issued.values = [];
      notIssued.values = [];

      datum.values.forEach(datumValue => (datumValue.status_current === 'Issued' ?
        issued.values.push(datumValue)
        : notIssued.values.push(datumValue)));
      issued.count = issued.values.length;
      issued.issued = true;
      notIssued.count = notIssued.values.length;
      notIssued.issued = false;

      ordinalWithStatus.push(notIssued);
      ordinalWithStatus.push(issued);
    });

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
            data={{ key: 'root', children: entriesHierarchy }}
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
            {entriesHierarchy.map(datum => (
              <ResponsiveOrdinalFrame
                responsiveWidth
                key={datum.key}
                data={ordinalWithStatus.filter(d => d.key === datum.key)}
                title={datum.key}
                style={d => {
                  return {
                    fill: d.issued ? nodeColors[datum.key] : color(nodeColors[datum.key]).brighter(2)
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
