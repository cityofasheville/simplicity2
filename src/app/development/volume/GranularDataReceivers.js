import React from 'react';
import PropTypes from 'prop-types';
import {
  stackedHistogramFromNodes,
  GET_PERMITS,
} from './granularUtils';
import BooleanSplitMultiples from './BooleanSplitMultiples';
import LoadingAnimation from '../../../shared/LoadingAnimation';
import PermitVolCirclepack from './PermitVolCirclepack';
import VolumeHistogram from './VolumeHistogram';
import DataModal from './DataModal';
import HierarchicalSelect from './HierarchicalSelect'


class GranularDataReceivers extends React.Component {
  constructor(props) {
    super(props);

    // this.onModalOpen = this.onModalOpen.bind(this);
    // this.onModalClose = this.onModalClose.bind(this);
    this.state = {
      selectedData: this.props.data,
      selectedNodes: null,
      selectedHierarchyLevel: null,
      // modalData: null,
    };

    this.onHierarchySelect = this.onHierarchySelect.bind(this);
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

  onHierarchySelect(selectedData, selectedNodes, selectedHierarchyLevel) {
    this.setState({
      selectedData,
      selectedNodes,
      selectedHierarchyLevel
    });
  }

  render() {
    const histData = this.state.selectedNodes ?
      stackedHistogramFromNodes(this.state.selectedNodes, this.props.includedDates) :
      [];
    const totalCount = this.state.selectedData.length;

    return (<div className="dashRows">
      {/* {this.state.modalData && <DataModal data={this.state.modalData} closeModal={this.onModalClose} />} */}
      <div
        className="row col-md-12"
      >
        <HierarchicalSelect
          data={this.props.data}
          onFilterSelect={this.onHierarchySelect}
        />
      </div>
      <div
        id="controls-n-summary"
        className="row col-md-12"
      >
        <div className="col-md-9">
          <h2>Daily</h2>
            <VolumeHistogram
              data={histData}
            />
        </div>
        <div className="col-md-3 granularVolCirclepack">
        <h2>{`Total: ${totalCount}`}</h2>
        {this.state.selectedNodes ?
          (<PermitVolCirclepack
            data={{ key: 'root', values: this.state.selectedNodes }}
            colorKeys={{}}
            // onCircleClick={circleData => this.onModalOpen(circleData)}
          />) :
        <LoadingAnimation />
        }
      </div>
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
