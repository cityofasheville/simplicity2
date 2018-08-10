import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from "react-apollo";
import { graphql } from 'react-apollo';
import { nest } from 'd3-collection';
import { histogram } from 'd3-array';
import { ResponsiveOrdinalFrame } from 'semiotic';
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
  if (inputHierarchy.length <= otherGroupCutoff) {
    return inputHierarchy;
  }
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

function splitOrdinalByBool(inputData, matchTestFunc, nameTrue) {
  // const statusTestFunc = d => d.status_current === 'Issued';
  // const statusBoolKey = 'issued';
  // const histWithStatus = splitOrdinalByBool(histogramData, statusTestFunc, statusBoolKey);
  const splitOrdinal = [];
  inputData.forEach((datum) => {
    const matchy = Object.assign({}, datum);
    matchy[nameTrue] = true;
    const notMatchy = Object.assign({}, datum);
    notMatchy[nameTrue] = false;

    matchy.values = [];
    notMatchy.values = [];

    datum.values.forEach(datumValue => (matchTestFunc(datumValue) ?
      matchy.values.push(datumValue)
      : notMatchy.values.push(datumValue)));

    matchy.count = matchy.values.length;
    notMatchy.count = notMatchy.values.length;

    splitOrdinal.push(notMatchy);
    splitOrdinal.push(matchy);
  });

  return splitOrdinal;
}

function boxWhisker({ data, rScale, adjustedSize, margin }) {
  const renderedPieces = [];
  const keys = Object.keys(data);
  console.log(data)

  keys.forEach((key) => {
    const column = data[key];
    const firstDatum = column.pieceData[0];

    // Each ordinal value/status has one bar associated
    // Each bar has an array of individual data points
    // Render each point as a dot
    // Render a box a la box and whisker
    // Box is transparent, whole thing glows when hovered
    // Hover event

    //Calculate individual start and width of each graphical band
    // const birthDate = rScale(column.pieces.data.startDate);
    // const termStart = rScale(firstDatum.start);
    // const termEnd = rScale(firstDatum.end);
    // const deathDate = rScale(firstDatum.death);
    // const preTermWidth = termStart - birthDate;
    // const termWidth = termEnd - termStart;
    // const postTermWidth = deathDate - termEnd;
//
//     //You can return an array of graphics or an array of objects with extra data (see the Waterfall chart demo)
    const markObject = (
      <g key={`piece-${key}`}>
        <rect
          fill="#00a2ce"
          width={column.width}
          height={column.width}
          x={firstDatum.scaledValue}
          y={column.x}
        />
        {/* <rect */}
        {/*   fill="#4d430c" */}
        {/*   width={termWidth} */}
        {/*   height={column.width} */}
        {/*   x={termStart} */}
        {/*   y={column.x} */}
        {/* /> */}
        {/* <rect */}
        {/*   fill="#b6a756" */}
        {/*   width={postTermWidth} */}
        {/*   height={column.width} */}
        {/*   x={termEnd} */}
        {/*   y={column.x} */}
        {/* /> */}
      </g>
    );

    renderedPieces.push(markObject);
  });

  return renderedPieces;
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

  histogramFromHierarchical(entriesHierarchy, includedDates) {
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
    this.state.hierarchyLevels.forEach((level, i) => {
      if (level.selectedCat) { filteredData = filteredData[level.selectedCat]; }
      if (level.selectedCat && i === this.state.hierarchyLevels.length - 1) {
        const rObj = {};
        rObj[level.selectedCat] = filteredData;
        filteredData = rObj;
      }
    });

    // Named entries hierarchy because it's the equivalent of nest().entries(data)
    let entriesHierarchy = Object.keys(filteredData).map(key => ({
      key,
      values: filteredData[key],
      value: filteredData[key].length,
    })).sort((a, b) => b.value - a.value);

    entriesHierarchy = groupHierachyOthers(entriesHierarchy);

    // Determine what colors each key within that hierarchy should be
    const nodeColors = { root: 'none' };
    const theseColors = firstIndexUnselected % 2 !== 0 ? colorScheme.slice().reverse() : colorScheme;
    entriesHierarchy.forEach((hierarchyLevel, i) => {
      nodeColors[hierarchyLevel.key] = theseColors[i];
    });

    const includedDates = this.timeBuckets();
    const histogramData = this.histogramFromHierarchical(entriesHierarchy, includedDates);

    const statusNest = nest().key(d => d.status_current);
    const entriesHierarchyStatusNest = entriesHierarchy.map((entry) => {
      const rObj = Object.assign({}, entry);
      rObj.values = statusNest.entries(entry.values)
        .map((v) => {
          const rVal = Object.assign({}, v);
          rVal.startDate = new Date(v.values.sort((a, b) => Date.parse(a.applied_date) - Date.parse(b.applied_date))[0].applied_date).getTime();
          return rVal;
        });
      return rObj;
    });

    /********************/
    return (<div>
      <h1>Permits Opened from {`${new Date(includedDates[0]).toLocaleDateString('en-US', dateOptions)} to ${new Date(includedDates[includedDates.length - 1]).toLocaleDateString('en-US', dateOptions)}`}</h1>
      <div id="controls-n-summary" className="row">
        <PermitTypeMenus
          onSelect={this.onMenuSelect}
          parentHierarchyLevels={this.state.hierarchyLevels}
          wholeHierarchy={wholeHierarchy}
        />
        <div className="col-md-9">
          <h2>Daily</h2>
          <VolumeHistogram
            data={histogramData}
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
        <h2>Status by Opened Date</h2>
        <div
          style={{
            display: 'flex',
            padding: '0 1%',
            textTransform: 'capitalize',
          }}
        >
          {entriesHierarchyStatusNest.map((datum) => {
            console.log(datum.values);

            return (<ResponsiveOrdinalFrame
              type="bar"
              projection="horizontal"
              size={[185, 300]}
              margin={{
                top: 40,
                right: 20,
                bottom: 30,
                left: 60,
              }}
              oPadding={1}
              oAccessor="key"
              oLabel
              rAccessor="startDate"
              rExtent={[includedDates[0].getTime(), includedDates[includedDates.length - 1].getTime()]}
              pieceIDAccessor="key"
              axis={[
                {
                  orient: 'bottom',
                  tickFormat: d => (
                    <text
                      textAnchor="end"
                      transform="rotate(-35)"
                      style={{ fontSize: '0.70em' }}
                    >
                      {new Date(d).toLocaleDateString(
                        'en-US',
                        { month: 'short', day: 'numeric' }
                      )}
                    </text>
                  ),
                },
              ]}
              responsiveWidth
              key={datum.key}
              data={datum.values}
              title={datum.key}
              style={(d) => ({ fill: nodeColors[datum.key] })}
            />);
          })}
        </div>
      </div>
      <div id="taskVol">
        <h2>Tasks</h2>
      </div>
      <div id="inspections">
        <h2>Inspections</h2>
      </div>
      <div id="percentOnline">
        <h2>Percent Opened Online</h2>
      </div>
      <div id="permitFees">
        <h2>Fees</h2>
      </div>
    </div>);
  }
}

// comments {
//   comment_seq_number
//   comment_date
//   comments
// }
const getPermitsQuery = gql`
  query getPermitsQuery($civicaddress_id: Int!, $radius: Int, $after: String) {
    permits_by_address(civicaddress_id: $civicaddress_id, radius: $radius, after: $after) {
        address
        applicant_name
        applied_date
        civic_address_id
        permit_category
        permit_description
        permit_group
        permit_number
        permit_subtype
        permit_type
        status_current
        status_date
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
