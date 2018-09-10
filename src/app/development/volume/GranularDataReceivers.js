import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { nest } from 'd3-collection';
import { Legend, ResponsiveOrdinalFrame } from 'semiotic';
import {
  colorScheme,
  groupHierachyOthers,
  histogramFromHierarchical,
  GET_PERMITS,
  openedOnlineRule,
  splitOrdinalByBool,
  groupStatuses,
} from './granularUtils';
import BooleanSplitMultiples from './BooleanSplitMultiples';
import LoadingAnimation from '../../../shared/LoadingAnimation';
import HorizontalLegend from '../../../shared/visualization/HorizontalLegend';
import PermitTypeMenus from './PermitTypeMenus';
import PermitVolCirclepack from './PermitVolCirclepack';
import StatusDistributionMultiples from './StatusDistributionMultiples';
// import StatusBars from './StatusBars';
import VolumeHistogram from './VolumeHistogram';
import DataModal from './DataModal';


class GranularDataReceivers extends React.Component {
  constructor() {
    super();

    this.state = {
      hierarchyLevels: [
        { name: 'permit_type', selectedCat: null },
        { name: 'permit_subtype', selectedCat: null },
        { name: 'permit_category', selectedCat: null },
      ],
      modalData: null
    };

    this.onMenuSelect = this.onMenuSelect.bind(this);
    this.onModalOpen = this.onModalOpen.bind(this);
    this.onModalClose = this.onModalClose.bind(this);
  }

  timeBuckets() {
    const includedDates = [];
    const oneDayMilliseconds = (24 * 60 * 60 * 1000);
    let dateToAdd = new Date(this.props.timeSpan[0]).getTime();
    const lastDate = new Date(this.props.timeSpan[1]).getTime();
    while (dateToAdd <= lastDate) {
      includedDates.push(new Date(dateToAdd));
      dateToAdd += oneDayMilliseconds;
    }
    return includedDates;
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

  onModalClose() {
    this.setState({
      modalData: null
    })
  }

  onModalOpen(inputData) {
    this.setState({
      modalData: inputData
    })
  }

  render() {
    return (<Query
      query={GET_PERMITS}
      variables={{
        date_field: this.props.dateField,
        after: new Date(this.props.timeSpan[0]),
        before: new Date(this.props.timeSpan[1]),
      }}
    >
      {({ loading, error, data }) => {
        if (loading) return <LoadingAnimation />;
        if (error) {
          console.log(error);
          return <div>Error :( </div>;
        }

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

        const wholeHierarchy = bigNest.object(data.permits);

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
        const histogramData = histogramFromHierarchical(
          data.permits,
          entriesHierarchy,
          includedDates,
        );


        const filteredStatuses = [];
        let maxRadius = 0;
        const numDates = includedDates.length
        const statusNest = nest().key(d => d.status_current)

        entriesHierarchy.forEach(hierarchyObj => {
          const rObj = Object.assign({}, hierarchyObj);
          rObj.values = groupStatuses(hierarchyObj.values)
          rObj.valuesByStatus = statusNest.entries(rObj.values).sort((a, b) => (b.values.length - a.values.length))
          const maxRadiusCandidate = rObj.valuesByStatus[0].values.length / numDates
          maxRadius = maxRadiusCandidate > maxRadius ? maxRadiusCandidate : maxRadius;
          filteredStatuses.push(rObj)
        })

        // TODO: do this in BooleanSplitMultiples instead
        const openedOnline = splitOrdinalByBool(histogramData, openedOnlineRule, 'openedOnline');

        // todo:
        // make boolean split multiples for paid vs outstanding fees by opened/updated date
        // console.log(entriesHierarchy)

        return (<div className="dashRows">
          {this.state.modalData && <DataModal data={this.state.modalData} closeModal={this.onModalClose} />}
          <div id="controls-n-summary" className="row" className="col-md-12">
            <PermitTypeMenus
              onSelect={this.onMenuSelect}
              parentHierarchyLevels={this.state.hierarchyLevels}
              wholeHierarchy={wholeHierarchy}
            />
            <div className="col-md-9">
              <h2>Daily</h2>
              {/* <VolumeHistogram
                data={histogramData}
                nodeColors={nodeColors}
              /> */}
              {/* Checkbox legend - more like checkboxes-- only show top 3 - 5 by volume by default */}
            </div>
            <div className="col-md-3 granularVolCirclepack">
              <h2>{`Total: ${entriesHierarchy.map(d => d.value).reduce((a, b) => a + b)}`}</h2>
              <PermitVolCirclepack
                data={{ key: 'root', children: entriesHierarchy }}
                colorKeys={nodeColors}
                onCircleClick={circleData => this.onModalOpen(circleData)}
              />
            </div>
            {/* TODO: move this into volume histogram and set distance from left by margins, not hard coded! */}
            <div className="col-md-10" style={{ left: 40 }}>
              <HorizontalLegend
                // label item has label and color
                labelItems={entriesHierarchy.map(entry => (
                  {
                    label: entry.key,
                    color: nodeColors[entry.key],
                  }
                ))}
              />
            </div>
          </div>
          <div
            id="openClosedIssued"
            className="row"
          >
            <h2>Status Distribution by {this.props.dateField  === 'applied_date' ? 'Opened' : 'Updated'} Date</h2>
            <StatusDistributionMultiples
              filteredStatuses={filteredStatuses}
              nodeColors={nodeColors}
              maxRadius={maxRadius}
              // TODO: THIS SHOULD REALLY BE SET ON StatusDistributionMultiples
              dateField={this.props.dateField}
              includedDates={includedDates}
            />
          </div>
          <div id="percentOnline" className="row">
            <h2>Online vs In Person</h2>
            {/* Make shared extent with FacetController after issue is fixed */}
            <BooleanSplitMultiples
              entriesHierarchy={entriesHierarchy}
              nodeColors={nodeColors}
              openedOnline={openedOnline}
            />
          </div>
        </div>);
      }
      }
    </Query>);
  }
}

export default GranularDataReceivers;
