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

      // Grab just completed ones, order by date completed, make timeline?
      // Needs to allow fork
      // Should also be annotated dagre?
      const steps = data.permit_tasks
        // .filter(d => d.is_active === true || d.is_completed === true)
        .sort((a, b) => {
          return new Date(b.current_status_date).getTime() - new Date(a.current_status_date).getTime()
        })


      const uniqueDates = steps
        .map(step => getDate(step.current_status_date))
        .filter((date, index, inputDates) => inputDates.indexOf(date) === index)

      const stepsByDate = {};
      steps.forEach(step => {
        const stepDate = getDate(step.current_status_date);
        if (!stepsByDate[stepDate]) {
          stepsByDate[stepDate] = [];
        }
        stepsByDate[stepDate].push(step)
      })

      return (<div className="row detailsFieldset__details-listings">
        {uniqueDates.map(date => (<div key={date} className="form-group form-group--has-content col-sm-2">
          <div className="form-group__inner">
            <div className="form-group__label">{date}</div>
            {stepsByDate[date].map(step => (<div key={`${date}-${step.task}`}>
              <div><span>{step.task}:</span><span className="pull-right">{step.task_status}</span></div>
            </div>))}
          </div>
        </div>))}
      </div>);
    }}
  </Query>);
};

export default PermitTasks;
