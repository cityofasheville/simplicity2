import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import LoadingAnimation from '../../../shared/LoadingAnimation';
import { capitalizeFirstLetter } from '../../utils';

const GET_TASKS_FOR_PERMIT = gql`
query getTasksQuery($permit_numbers: [String]) {
  permit_tasks(permit_numbers: $permit_numbers) {
    process_code
    task
    task_status
    current_status_date
    step_number
    relation_sequence_id
    parent_task_name
    user_name
    user_id
    user_department
    due_date
    record_date
    comments
    is_completed
    is_active
    assigned_date
    assigned_user
    assigned_department
    process_history_sequence_number
    internal_record_id
  }
}`

const PermitTasks = (props) => {
  return (<Query
    query={GET_TASKS_FOR_PERMIT}
    variables={{
      permit_numbers: [props.routeParams.id],
    }}
  >
    {({ loading, error, data }) => {
      if (loading) return <LoadingAnimation />;
      if (error) {
        console.log(error);
        return <div>Error :( </div>;
      }

      // Grab just completed ones, order by date completed, make timeline?
      // Needs to allow fork
      // Should also be annotated dagre?
      const steps = data.permit_tasks
        // .filter(d => d.is_active === true || d.is_completed === true)
        .sort((a, b) => {
          return new Date(a.current_status_date).getTime() - new Date(b.current_status_date).getTime()
        })
      console.log(data.permit_tasks, steps)

      return (<div className="dashRows">
        <div>
          Foo!
        </div>
      </div>);
    }}
  </Query>);
};

export default PermitTasks;
