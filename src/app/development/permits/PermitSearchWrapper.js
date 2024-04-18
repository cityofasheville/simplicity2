import React, { useState, useEffect } from 'react';
import { Query } from 'react-apollo';
import { Link } from 'react-router';
import SuggestSearch from '../../search/SuggestSearch';
import SearchResultGroup from '../../search/searchResults/SearchResultGroup';
import LoadingAnimation from '../../../shared/LoadingAnimation';
import gql from 'graphql-tag';
import { formatSearchResults } from '../../search/searchResults/searchResultsUtils';

import PermitSearchResultsTable from './PermitSearchResultsTable';


  const addressPermitQuery = gql`
  query get_permits_by_address ($civicaddress_id: Int!) {
    permits_by_address(civicaddress_id: $civicaddress_id) {
      application_name
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
      civic_address_id
      address
      x
      y
    }
  }`;

const addressQuery = gql`
query searchQuery($searchString: String!, $searchContexts: [String]) {
  search(searchString: $searchString, searchContexts: $searchContexts) {
      results {
          ... on AddressResult {
              civic_address_id
              address
          }
      }
  }
}`;

const otherAddressQuery = gql`
query {
  addresses(civicaddress_ids: ["21696"]) {
    address
    street_maintenance
  }
}`;

const permitsByAddressQuery = gql`
query get_permits_by_address ($civicaddress_id: Int!) {
  permits_by_address_realtime(civicaddress_id: $civicaddress_id) {
      permit_number
      applicant_name
      permit_type
      permit_category
      applied_date
      permit_description
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

const permitFormat = /^\d{2}-\d{5}(s|S|pz|pZ|Pz|PZ){0,1}$/;

function SuggestSearchWrapper() {
  const [userQuery, setUserQuery] = useState('');
  const [isPermit, setIsPermit] = useState(false);

  useEffect(() => {
    if (userQuery.search(permitFormat) !== -1) {
      setIsPermit(true);
    }
  }, [userQuery]);

  return (
    <>
      <section style={{margin: "32px 0"}}>
        <SuggestSearch 
          setUserQuery={setUserQuery} 
          debounceInterval={100}
          suggestWithGeocoder={false}
          suggestWithSimplicity={true}
          simplicitySuggestValue='id'
          suggestionEntities={['address']}
        />
      </section>

      {userQuery.length > 2 && !isPermit && (
        <Query 
          query={addressQuery}
          errorPolicy="all"
          variables={{ searchString: `${userQuery}`, searchContexts: ['civicAddressId'] } }
        >
          {({ loading, error, data }) => {
            
            if (loading) {
              return null;
            } 

            if (error) {
              return (
                <div className="alert alert-danger alert-sm">
                  <span style={{fontSize: '1.25rem'}}>
                    There was an error fetching the address.
                  </span>
                  <hr style={{margin: '0'}} />
                  <p style={{marginTop: '12px'}}>
                    {error.graphQLErrors.map(({ message }, i) => (
                      <span key={i}>{message}</span>
                    ))}
                  </p>                
                </div>
              );
            } 

            if (data?.search[0]?.results === null) {
              return null;
            } 

            if (data.search[0].results.length !== 1) {
              return (
                <div className="alert alert-warning alert-sm">
                  The results for "{userQuery}" may be unexpected. One address was expected and instead we got {data.search[0].results.length}.
                  Try a different search term, either by manually entering a civic address ID or selecting an address suggestion.
                </div>
              );
            } 

            return (
              <h2>Permits for {data.search[0].results[0].address}</h2>
            );
          }}
        </Query>
      )}

      {userQuery.length > 2 && (
        <Query 
          query={isPermit ? permitQuery : addressPermitQuery}
          errorPolicy="all"
          variables={isPermit ? { permit_numbers: userQuery } : { civicaddress_id: parseInt(userQuery) } }
        >
          {({ loading, error, data }) => {
            
            if (loading) {
              return (
                <div style={{display:'flex', justifyContent: 'center'}}>
                  <LoadingAnimation />
                </div>                    
              );
            } 

            if (error) {
              return (
                <div className="alert alert-danger alert-sm">
                  <span style={{fontSize: '1.25rem'}}>
                    There was an error fetching results.
                  </span>
                  <hr style={{margin: '0'}} />
                  <p style={{marginTop: '12px'}}>
                    {error.graphQLErrors.map(({ message }, i) => (
                      <span key={i}>{message}</span>
                    ))}
                  </p>                
                </div>
              );
            } 

            console.log('permits_by_address', data);


            if (isPermit) {
              if (data.permit_realtime !== null) {
                return ( 
                  <p className="list-group-item">
                    <Link to={`/permits/${data.permit_realtime.permit_number}`}>
                      {data.permit_realtime.permit_number} - {data.permit_realtime.application_name}
                    </Link>
                  </p>
                );
              }
              else {
                return (<p>No results found</p>);
              }
            } else {
              if (data.permits_by_address !== null) {

                // const permitList = data.permits_by_address_realtime.map((permit, index) => {
                //   return (
                //     <tr key={index} title={`Permit ${permit.permit_number} for ${permit.applicant_name}`}>
                //       <td><Link to={`/permits/${permit.permit_number}`} title="View permit application details">{permit.permit_number}</Link></td>
                //       <td>{permit.applicant_name}</td>
                //       <td>{permit.permit_category}</td>
                //       <td>{permit.permit_type}</td>
                //       <td>
                //         <div style={{whiteSpace: "break-spaces", minWidth: "300px"}}>
                //           {permit.permit_description}
                //         </div>                      
                //       </td>
                //     </tr>
                //   );
                // });
                console.log(data);

                return <PermitSearchResultsTable data={data.permits_by_address} />;
  
              //   return (
              //     <div className="table-responsive" style={{"marginTop": "8px"}}>
              //       <table className="table table-hover table-bordered">
              //         <thead className="thead-dark">
              //           <tr>
              //             <th scope="col" style={{"width": "15%"}}>Permit Number</th>
              //             <th scope="col" style={{"width": "15%"}}>Applicant</th>
              //             <th scope="col" style={{"width": "15%"}}>Category</th>
              //             <th scope="col" style={{"width": "15%"}}>Type</th>
              //             <th scope="col" style={{"width": "40%"}}>Description!!</th>
              //           </tr>
              //         </thead>
              //         <tbody>
              //           {permitList}
              //         </tbody>
              //       </table>     
              //     </div>
              //   );
              }
            }
            
            return (
              <div className="alert alert-warning alert-sm">
                No results were found for "{userQuery}". 
                Try a different search term, either by manually entering a civic address ID or selecting an address suggestion.
              </div>
            );
          }}
        </Query>
      )}
    </>
  );
}

export default SuggestSearchWrapper;