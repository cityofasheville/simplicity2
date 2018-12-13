import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import LoadingAnimation from '../../../shared/LoadingAnimation';
import ProjectsTable from './ProjectsTable';

const GET_PROJECTS = gql`
  query getPermitsQuery($date_field: String!, $after: String, $permit_groups: [String]) {
    permits(date_field: $date_field, after: $after, permit_groups: $permit_groups) {
      applicant_name
      applied_date
      permit_category
      permit_description
      permit_group
      permit_number
      permit_subtype
      permit_type
      status_current
      status_date
      created_by
      building_value
      job_value
      total_project_valuation
      total_sq_feet
      fees
      paid
      balance
      invoiced_fee_total
      address
      comments {
        comment_seq_number
        comment_date
        comments
      }
    }
  }
`;


const ProjectsTableWrapper = (props) => (
  <Query
    query={GET_PROJECTS}
    variables={{
      date_field: 'applied_date',
      after: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
      permit_groups: ['Planning'],
    }}
  >
    {({ loading, error, data }) => {
      if (loading) return <LoadingAnimation />;
      if (error) {
        console.log(error);
        return <div>Error :( </div>;
      }


      const filteredData = data.permits.filter(d => {
        let typeOfInterest = false;
        Object.values(props.projectTypes).forEach(type => {
          // ASSUMING THEY ARE ALL PLANNING
          if (d.permit_type === type.permit_type && d.permit_subtype === type.permit_subtype) {
            typeOfInterest = typeOfInterest || true;
          }
        })
        return typeOfInterest;
      })

      return (<ProjectsTable {...props} data={filteredData} />);
    }}
  </Query>
);

export default ProjectsTableWrapper;
