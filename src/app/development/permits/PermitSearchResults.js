import React from 'react';
import { Link } from 'react-router';
import { graphql, Query } from 'react-apollo';
import gql from 'graphql-tag';
import LoadingAnimation from '../../../shared/LoadingAnimation';
// import Error from '../../../shared/Error';
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
    <section title="Search Results" style={{marginTop: '32px', marginBottom: '16px'}}>
      <h2>Search Results for {props.searchText} ({props.searchTarget})</h2>
      <ol className="list-group" style={{"listStyleType": "none"}}>
        <Query 
          query={props.searchTarget === 'permit' ? permitQuery : addressQuery}
          variables={props.searchTarget === 'permit' ? { permit_numbers: props.searchText } : { searchString: props.searchText, searchContexts: ["address"] } }
        >
          {({ loading, error, data }) => {
            if (loading) {
              console.log('loading');
              return <LoadingAnimation message={`Loading ${props.searchTarget}...`} />;
            } 
            if (error) {
              console.log('error!', error);
              return <p>{`There was a problem loading ${props.searchTarget}`} </p>;
            } 
            console.log(data);
            let results;
            if (props.searchTarget === 'permit') {
              if (data.permit_realtime !== null) {
                results = 
                  <li className="list-group-item">
                    <Link to={`/permits/${data.permit_realtime.permit_number}`}>
                      {data.permit_realtime.permit_number} - {data.permit_realtime.application_name}
                    </Link>
                  </li>
                ;
              }
              else {
                results = <p>No results found</p>;
              }
            }
            else {
              results = <PermitSearchResultsAddresses showPermitsForID={props.showPermitsForID} data={data.search[0].results} handleAddressSelection={props.handleAddressSelection} />;
            }
            return results;
          }}
        </Query>
      </ol>
    </section>
  ); 
};

export default PermitSearchResults;
