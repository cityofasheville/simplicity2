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
  const module = props.location.query ? props.location.query.module : null;
  let permitGroups = ['Permits', 'Planning', 'Services'];
  if (module) {
    permitGroups = module.split(',').map(m => capitalizeFirstLetter(m))
  }

  return (<Query
    query={GET_PERMITS}
    variables={{
      date_field: props.dateField,
      after: new Date(props.timeSpan[0]),
      before: new Date(props.timeSpan[1]),
      permit_groups: permitGroups,
    }}
  >
    {({ loading, error, data }) => {
      if (loading) return <LoadingAnimation />;
      if (error) {
        console.log(error);
        return <div>Error :( </div>;
      }
      return (<div className="dashRows">
        {module && module.length === 1 && <h2>Module: {permitGroups[0]}</h2>}
        {module && module.length > 1 && <h2>Modules: {permitGroups.join(', ')}</h2>}
        <div>
          <VolumeDataReceivers
            {...props}
            data={data.permits}
            module={module}
          />
        </div>
      </div>);
    }}
  </Query>);
};

export default PermitDataQuery;
