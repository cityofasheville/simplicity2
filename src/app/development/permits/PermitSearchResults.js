import React from 'react';
import { Link } from 'react-router';
import { graphql, Query } from 'react-apollo';
import gql from 'graphql-tag';
import LoadingAnimation from '../../../shared/LoadingAnimation';
import Error from '../../../shared/Error';
import PermitSearchResultsAddresses from './PermitSearchResultsAddresses';

function PermitSearchResults(props) {

  const addressQuery = gql`
  query searchQuery($searchString: String!, $searchContexts: [String]) {
    search(searchString: $searchString, searchContexts: $searchContexts) {
      results {
        ... on AddressResult {
            civic_address_id
            address
            zipcode
        }
      }
    }
  }`;

  const permitQuery = gql`
  query getPermitsQuery($permit_numbers: String) {
    permit_realtime(permit_number: $permit_numbers) {
      permit_number
      permit_group
      permit_type
      permit_subtype
      permit_category
      permit_description
      applicant_name
      application_name
      status_current
      status_date
      technical_contact_name
      contractor_names
    }
  }`;

  return (
    <Query 
      query={props.searchTarget === 'permit' ? permitQuery : addressQuery}
      variables={props.searchTarget === 'permit' ? { permit_numbers: props.searchText } : { searchString: props.searchText, searchContexts: ["address"] } }
    >
      {({ loading, error, data }) => {
        if (loading) {
          console.log('loading');
          return <LoadingAnimation />;
        } 
        if (error) {
          console.log('error!', error);
          return <p>Problem!</p>;
        } 
        console.log(data);
        let results;
        if (props.searchTarget === 'permit') {
          results = <p><Link to={`/permits/${data.permit_realtime.permit_number}`}>{data.permit_realtime.permit_number} - {data.permit_realtime.application_name}</Link></p>;
        }
        else {
          results = <PermitSearchResultsAddresses data={data.search[0].results} />;
          // results = <p>Address</p>;
        }

        return results;
      }}
    </Query>
  ); 

};

export default PermitSearchResults;
