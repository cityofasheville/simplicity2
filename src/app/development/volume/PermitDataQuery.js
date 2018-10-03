import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { GET_PERMITS } from './granularUtils';
import LoadingAnimation from '../../../shared/LoadingAnimation';
import GranularDataReceivers from './GranularDataReceivers';
import StatusDistributionMultiples from './StatusDistributionMultiples';

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const PermitDataQuery = (props) => {
  const includedDates = [];
  const oneDayMilliseconds = (24 * 60 * 60 * 1000);
  let dateToAdd = new Date(props.timeSpan[0]).getTime() + oneDayMilliseconds;
  const lastDate = new Date(props.timeSpan[1]).getTime();
  while (dateToAdd <= lastDate) {
    includedDates.push(new Date(dateToAdd));
    dateToAdd += oneDayMilliseconds;
  }

  return (<Query
    query={GET_PERMITS}
    variables={{
      date_field: props.dateField,
      after: new Date(props.timeSpan[0]),
      before: new Date(props.timeSpan[1]),
    }}
  >
    {({ loading, error, data }) => {
      if (loading) return <LoadingAnimation />;
      if (error) {
        console.log(error);
        return <div>Error :( </div>;
      }

      let filteredData = data.permits;
      let capitalizedModule;
      if (props.module) {
        // TODO: IF IT'S PLANNING MODULE, DON'T USE THE CATEGORY LEVEL
        capitalizedModule = capitalizeFirstLetter(props.module);
        filteredData = data.permits.filter(d => d.permit_group === capitalizedModule)
      }

      // if the URL is granular, then show granular data receivers
      // if the URL is status_volume, show status details

      return (<div className="dashRows">
        {props.module && <h2>Module: {capitalizedModule}</h2>}
        <div>
          <GranularDataReceivers
            data={filteredData}
            includedDates={includedDates}
          />
        </div>
      </div>);
    }}
  </Query>);
};

export default PermitDataQuery;
