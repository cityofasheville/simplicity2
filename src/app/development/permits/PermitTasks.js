import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import LoadingAnimation from '../../../shared/LoadingAnimation';
import { capitalizeFirstLetter } from '../../utils';

const GET_TASKS_FOR_PERMIT = gql`
query getTasksQuery($permit_numbers: [String]) {
  permit_tasks(permit_numbers: $permit_numbers) {
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
    comments
    is_completed
    is_active
    assigned_date
    assigned_user
    process_history_sequence_number
  }
}`


const getDate = d => new Date(d) .toLocaleDateString('en-us')

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

      let steps = data.permit_tasks.slice();

      if (steps.length === 0) {
        return (<div>No actions have been taken on this permit application.</div>)
      }

      steps.sort((a, b) => {
        return new Date(b.current_status_date).getTime() - new Date(a.current_status_date).getTime();
      });


      return (<div className="row table-responsive" id="PermitTasks">
        <div className="col-sm-12">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Task</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {steps.map((step, i) => {
                let stepClass = '';
                if (step.is_active) {
                  stepClass = 'warning';
                }
                if (step.is_completed) {
                  stepClass = 'info';
                }
                return (<tr className={stepClass} key={`${step.task}-${i}`}>
                  <td>{getDate(step.current_status_date)}</td>
                  <td>{step.task}</td>
                  <td>{step.task_status}</td>
                </tr>)
              })}
            </tbody>
          </table>
        </div>
      </div>);
    }}
  </Query>);
};

export default PermitTasks;
