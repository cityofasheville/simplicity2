import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import {
  GET_PERMITS,
} from './granularUtils';
import LoadingAnimation from '../../../shared/LoadingAnimation';
import DataModal from './DataModal';
import HierarchicalSelect from './HierarchicalSelect'
import GranularDataReceivers from './GranularDataReceivers'


class PermitDataFilter extends React.Component {
  /*
    This component fetches data from the graphql server based on the timespan
    It renders the select component, which allows the user to choose what data to
    display in child visualiations
  */
  constructor(props) {
    super(props);

    // Maybe this belongs elsewhere in the lifecycle?
    this.includedDates = [];
    const oneDayMilliseconds = (24 * 60 * 60 * 1000);
    let dateToAdd = new Date(this.props.timeSpan[0]).getTime();
    const lastDate = new Date(this.props.timeSpan[1]).getTime();
    while (dateToAdd <= lastDate) {
      this.includedDates.push(new Date(dateToAdd));
      dateToAdd += oneDayMilliseconds;
    }

    this.state = {
      selectedData: null,
      selectedNodes: null,
      selectedHierarchyLevel: null,
      // modalData: null,
    };

    this.onHierarchySelect = this.onHierarchySelect.bind(this);
    // this.onModalOpen = this.onModalOpen.bind(this);
    // this.onModalClose = this.onModalClose.bind(this);
  }

  onHierarchySelect(selectedData, selectedNodes, selectedHierarchyLevel) {
    this.setState({
      selectedData,
      selectedNodes,
      selectedHierarchyLevel
    });
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

        return (<div className="dashRows">
          {/* {this.state.modalData &&
            // Maybe this needs to be moved?
            <DataModal
              data={this.state.modalData}
              closeModal={this.onModalClose}
            />
          } */}
          <div
            className="row col-md-12"
          >
            <HierarchicalSelect
              data={data.permits}
            />
          </div>
          <div>
            {/* <GranularDataReceivers
              currentData={this.state.currentData}
            /> */}
          </div>
        </div>);
      }
      }
    </Query>);
  }
}

export default PermitDataFilter;
