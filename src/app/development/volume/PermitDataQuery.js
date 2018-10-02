import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { GET_PERMITS } from './granularUtils';
import { URLSearchParams } from 'react-router';
import LoadingAnimation from '../../../shared/LoadingAnimation';
import GranularDataReceivers from './GranularDataReceivers';


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
      // use query params to filter for modules

      return (<div className="dashRows">
        <div>
          <GranularDataReceivers
            data={data.permits}
            includedDates={includedDates}
          />
        </div>
      </div>);
    }}
  </Query>);
};

export default PermitDataQuery;
