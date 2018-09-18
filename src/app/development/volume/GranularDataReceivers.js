import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { Legend, ResponsiveOrdinalFrame } from 'semiotic';
import {
  stackedHistogramFromHierarchical,
  GET_PERMITS,
} from './granularUtils';
import BooleanSplitMultiples from './BooleanSplitMultiples';
import LoadingAnimation from '../../../shared/LoadingAnimation';
import HorizontalLegend from '../../../shared/visualization/HorizontalLegend';
import PermitVolCirclepack from './PermitVolCirclepack';
import VolumeHistogram from './VolumeHistogram';
import DataModal from './DataModal';
import HierarchicalSelect from './HierarchicalSelect'


class GranularDataReceivers extends React.Component {
  constructor(props) {
    super(props);

    // Maybe this belongs elsewhere in the lifecycle?
    // Or on the timeline thing
    this.includedDates = [];
    const oneDayMilliseconds = (24 * 60 * 60 * 1000);
    let dateToAdd = new Date(this.props.timeSpan[0]).getTime();
    const lastDate = new Date(this.props.timeSpan[1]).getTime();
    while (dateToAdd <= lastDate) {
      this.includedDates.push(new Date(dateToAdd));
      dateToAdd += oneDayMilliseconds;
    }

    // this.onModalOpen = this.onModalOpen.bind(this);
    // this.onModalClose = this.onModalClose.bind(this);
  }

  // onModalClose() {
  //   this.setState({
  //     modalData: null
  //   })
  // }
  //
  // onModalOpen(inputData) {
  //   this.setState({
  //     modalData: inputData
  //   })
  // }

  render() {
    return (<div className="dashRows">
      {/* {this.state.modalData && <DataModal data={this.state.modalData} closeModal={this.onModalClose} />} */}
      <div
        id="controls-n-summary"
        className="row col-md-12"
      >
        <div className="col-md-9">
          <h2>Daily</h2>
            {/* <VolumeHistogram
              data={[]}
              nodeColors={{}}
            /> */}
        </div>
        {/* {
          this.state.hierarchicalData ?
            (<div className="col-md-3 granularVolCirclepack">
              <h2>{`Total: ${this.state.hierarchicalData.map(d => d.value).reduce((a, b) => a + b)}`}</h2>
              <PermitVolCirclepack
                data={{ key: 'root', children: this.state.hierarchicalData }}
                colorKeys={nodeColors}
                onCircleClick={circleData => this.onModalOpen(circleData)}
              />
            </div>) :
            <LoadingAnimation />
        } */}
        {/* TODO: move this into volume histogram and set distance from left by margins, not hard coded! */}
        {/* <div className="col-md-10" style={{ left: 40 }}>
          <HorizontalLegend
            // label item has label and color
            labelItems={this.state.hierarchicalData.map(entry => (
              {
                label: entry.key,
                color: nodeColors[entry.key],
              }
            ))}
          />
        </div> */}
      </div>
      <div id="percentOnline" className="row">
        <h2>Online vs In Person</h2>
        {/* Make shared extent with FacetController after issue is fixed */}
        {/* {
          this.state.histogramData ?
            <LoadingAnimation /> :
            <BooleanSplitMultiples
              histogramData={this.state.histogramData}
              entriesHierarchy={this.state.hierarchicalData}
              nodeColors={nodeColors}
            />
        } */}
      </div>
    </div>);
  }
}

export default GranularDataReceivers;
