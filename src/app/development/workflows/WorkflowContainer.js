import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { timeDay, timeMonday, timeMonth } from 'd3-time';
import { GET_WORKFLOW_TASKS } from '../volume/granularUtils';
import LoadingAnimation from '../../../shared/LoadingAnimation';
import Workflow from './Workflow';

// TODO: PUT THIS IN UTILS INSTEAD OF COPYING IT
// MAKE UTIL FILE SHARED WITH ALL DEVELOPMENT DASHBOARDS
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const WorkflowContainer = (props) => {
  return (<Query
    query={GET_WORKFLOW_TASKS}
    variables={{
      date_field: props.dateField,
      after: new Date(timeMonth.floor(new Date())),
      // before: new Date(props.timeSpan[1]),
    }}
  >
    {({ loading, error, data }) => {
      if (loading) return <LoadingAnimation />;
      if (error) {
        console.log(error);
        return <div>Error :( </div>;
      }

      // DO THIS BY MODULE
      const module = props.location.search.split('module=')[1];
      let filteredData = data.permit_tasks;
      let capitalizedModule;
      if (module) {
        capitalizedModule = capitalizeFirstLetter(module);
        filteredData = data.permit_tasks.filter(d => d.permit_group === capitalizedModule)
      }

      return (<div className="dashRows">
        <div>
          <Workflow
            data={filteredData}
          />
        </div>
      </div>);
    }}
  </Query>);
};

export default WorkflowContainer;
