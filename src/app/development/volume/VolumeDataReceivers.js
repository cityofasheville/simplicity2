import React from 'react';
import PropTypes from 'prop-types';
// import DataModal from './DataModal';
import HierarchicalSelect from './HierarchicalSelect';
import GranularDash from './GranularDash';
import StatusDash from './StatusDash';
import { dateDisplayOptsFuncMaker } from './granularUtils';


class VolumeDataReceivers extends React.Component {
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
      selectedHierarchyLevel,
    });
  }

  render() {
    const timeFormatter = dateDisplayOptsFuncMaker(this.props.timeSpan);
    const whichDash = this.props.location.pathname
      .split('/development')[1]
      .split('_volume')[0]
      .replace('/', '')

    return (<div className="dashRows">
      {/* {this.state.modalData && <DataModal
        data={this.state.modalData}
        closeModal={this.onModalClose}
      />} */}
      <div
        className="row col-md-12"
      >
        <HierarchicalSelect
          data={this.props.data}
          onFilterSelect={this.onHierarchySelect}
        />
      </div>
      {whichDash === 'granular' &&
        <GranularDash
          {...this.props}
          selectedNodes={this.state.selectedNodes}
          selectedData={this.state.selectedData}
          timeFormatter={timeFormatter}
        />
      }
      {whichDash === 'status' &&
        <StatusDash
          {...this.props}
          selectedNodes={this.state.selectedNodes}
          timeFormatter={timeFormatter}
        />
      }
    </div>);
  }
}

export default VolumeDataReceivers;
