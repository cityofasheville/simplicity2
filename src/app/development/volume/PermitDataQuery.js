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


class PermitDataQuery extends React.Component {
  /*
    This component fetches data from the graphql server based on the timespan
  */
  constructor() {
    super();
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
    // Maybe this belongs elsewhere in the lifecycle?
    const includedDates = [];
    const oneDayMilliseconds = (24 * 60 * 60 * 1000);
    let dateToAdd = new Date(this.props.timeSpan[0]).getTime();
    const lastDate = new Date(this.props.timeSpan[1]).getTime();
    while (dateToAdd <= lastDate) {
      includedDates.push(new Date(dateToAdd));
      dateToAdd += oneDayMilliseconds;
    }

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
          <div>
            <GranularDataReceivers
              data={data.permits}
              includedDates={includedDates}
            />
          </div>
        </div>);
      }
      }
    </Query>);
  }
}

export default PermitDataQuery;
