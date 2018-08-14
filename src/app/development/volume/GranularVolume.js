import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql, Query } from 'react-apollo';
import { histogram } from 'd3-array';
import { nest } from 'd3-collection';
import { DateTimePicker } from 'react-widgets';
import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import { ResponsiveOrdinalFrame } from 'semiotic';
import LoadingAnimation from '../../../shared/LoadingAnimation';
import PermitTypeMenus from './PermitTypeMenus';
import PermitVolCirclepack from './PermitVolCirclepack';
import Tooltip from '../../../shared/visualization/Tooltip';
import VolumeHistogram from './VolumeHistogram';


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
    const histFunc = histogram(this.props.data.permits)
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
    Moment.locale('en');
    momentLocalizer();

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

      TODO:
        props validation
        make opened/updated an option
        separate out graphql query
        bin by week if it's over 6 weeks, by month if it's over 1 year
        fix date issue-- have checkdate start at right place
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

    const wholeHierarchy = bigNest.object(this.props.data.permits);

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

    const datePickerStyle = {
      width: '25%',
      fontSize: '0.45em',
      display: 'inline-block',
      padding: '0% 2%',
    };

    return (<div>
      <h1>Permits Opened from <DateTimePicker
        value={this.state.timeSpan[0]}
        onChange={value => this.setState({ timeSpan: [value, this.state.timeSpan[1]] })}
        time={false}
        style={datePickerStyle}
      /> to <DateTimePicker
        style={datePickerStyle}
        value={this.state.timeSpan[1]}
        onChange={value => this.setState({ timeSpan: [this.state.timeSpan[0], value] })}
        time={false}
        /> </h1>
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
        <h2>Status Distribution by Opened Date</h2>
        <p>Click a box to see data details</p>
        <div
          style={{
            padding: '0 1%',
            textTransform: 'capitalize',
          }}
        >
          {entriesHierarchy.map((datum) => {
            // TODO:
            // roll them into other if there are more than 5
            // click to pop up modal
            // tooltip
            return (<div
              className="col-md-4"
              style={{ display: 'inline-block' }}
              key={datum.key}
            >
              <ResponsiveOrdinalFrame
                projection="horizontal"
                size={[300, 325]}
                responsiveWidth
                margin={{
                  top: 40,
                  right: 0,
                  bottom: 40,
                  left: 90,
                }}
                oPadding={5}
                oAccessor={d => d.status_current || 'No Status'}
                oLabel={(d) => {
                  const fontSize = 1 - (0.125 * d.split(' ').length);
                  return (
                    <text
                      textAnchor="end"
                      transform="rotate(-35)"
                      style={{ fontSize: `${fontSize}em` }}
                    >
                      {d}
                    </text>
                  );
                }}
                summaryType={{ type: 'boxplot', amplitude: new Date() }}
                summaryStyle={{
                  fill: nodeColors[datum.key],
                  stroke: nodeColors[datum.key],
                  fillOpacity: 0.65,
                }}
                rAccessor={d => new Date(d.applied_date)}
                rExtent={[includedDates[0], includedDates[includedDates.length - 1]]}
                pieceIDAccessor="key"
                axis={[
                  {
                    orient: 'bottom',
                    tickFormat: d => (
                      <text
                        textAnchor="end"
                        transform="rotate(-35)"
                        style={{ fontSize: '0.65em' }}
                      >
                        {new Date(d).toLocaleDateString(
                          'en-US',
                          { month: 'short', day: 'numeric' }
                        )}
                      </text>
                    ),
                  },
                ]}
                key={datum.key}
                data={datum.values}
                title={datum.key}
                hoverAnnotation
                tooltipContent={(d) => {
                  // Add text line that says "median date received is ____"
                  return <Tooltip
                    title={`${d.column.name} Total: ${d.summary.length}`}
                  />
                }}
                customClickBehavior={d => console.log(d)}
              />
            </div>
            );
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

const getPermitsQuery = gql`
  query getPermitsQuery($date_field: String!, $after: String, $before: String) {
    permits(date_field: $date_field, after: $after, before: $before) {
        applicant_name
        applied_date
        permit_category
        permit_description
        permit_group
        permit_number
        permit_subtype
        permit_type
        status_current
        status_date
        created_by
        building_value
        job_value
        total_project_valuation
        total_sq_feet
        fees
        paid
        balance
        invoiced_fee_total
        address
        comments {
          comment_seq_number
          comment_date
          comments
        }
    }
  }
`;

export default graphql(getPermitsQuery, {
  options: {
    variables: {
      date_field: 'applied_date',
      after: '2018-07-13',
      before: '2018-08-14',
    },
  },
})(GranularVolume);
