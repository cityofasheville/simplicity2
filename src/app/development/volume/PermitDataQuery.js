import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { GET_PERMITS } from './granularUtils';
import LoadingAnimation from '../../../shared/LoadingAnimation';
import VolumeDataReceivers from './VolumeDataReceivers';

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const PermitDataQuery = (props) => {
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

      const module = props.location.search.split('module=')[1];
      let filteredData = data.permits;
      let capitalizedModule;
      if (module) {
        // TODO: IF IT'S PLANNING MODULE, DON'T USE THE CATEGORY LEVEL
        capitalizedModule = capitalizeFirstLetter(module);
        filteredData = data.permits.filter(d => d.permit_group === capitalizedModule)
      }

      // if the URL is granular, then show granular data receivers
      // if the URL is status_volume, show status details

      return (<div className="dashRows">
        {module && <h2>Module: {capitalizedModule}</h2>}
        <div>
          <VolumeDataReceivers
            {...props}
            data={filteredData}
            module={module}
          />
        </div>
      </div>);
    }}
  </Query>);
};

export default PermitDataQuery;
