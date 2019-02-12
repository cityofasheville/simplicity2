import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import LoadingAnimation from '../../../shared/LoadingAnimation';


// Make query based on URL, render sub components depending on query results

const GET_PERMIT = gql`
  query getPermitsQuery($permit_numbers: [String]) {
    permits(permit_numbers: $permit_numbers) {
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

const Permit = (props) => (
  <Query
    query={GET_PERMIT}
    variables={{
      // permit_numbers: ['19-00773PZ']
      permit_numbers: [props.routeParams.id],
    }}
  >
    {({ loading, error, data }) => {
      if (loading) return <LoadingAnimation />;
      if (error || data.permits.length === 0) {
        console.log(error);
        return <div>Error :( </div>;
      }
      if (data.permits.length > 1) {
        console.log('This is not quite right: ', data)
      }

      const thisPermit = data.permits[0];
      const specialFields = [
        'permit_description',
        'address',
        'permit_number',
      ];

      return (<div className="container">
        <h1>{`${thisPermit.permit_description} at ${thisPermit.address}`}</h1>
        <span>{`Record number ${thisPermit.permit_number}`}</span>
        {Object.keys(thisPermit)
          .filter(d => specialFields.indexOf(d === -1))
          .map(d => (<div key={d}>{`${d}: ${thisPermit[d]}`}</div>))
        }
      </div>);
    }}
  </Query>
);

export default Permit;
