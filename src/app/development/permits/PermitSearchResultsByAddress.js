import React from 'react';
import { Link } from 'react-router';
import { graphql, Query } from 'react-apollo';
import gql from 'graphql-tag';
import LoadingAnimation from '../../../shared/LoadingAnimation';
import Error from '../../../shared/Error';

function PermitSearchResultsByAddress(props) {

  const addressQuery = gql`
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

  console.log('address lookup props', props);

  return (
    <div className="table-responsive" style={{"marginTop": "8px"}}>
      <table className="table table-hover table-bordered">
        <thead className="thead-dark">
          <tr>
            <th scope="col" style={{"width": "15%"}}>Permit Number</th>
            <th scope="col" style={{"width": "15%"}}>Applicant</th>
            <th scope="col" style={{"width": "15%"}}>Category</th>
            <th scope="col" style={{"width": "15%"}}>Type</th>
            <th scope="col" style={{"width": "40%"}}>Description</th>
          </tr>
        </thead>
        <tbody>
          <Query 
            query={addressQuery}
            variables={{ civicaddress_id: parseInt(props.data.civic_address_id) } }
          >
            {({ loading, error, data }) => {
              
              if (loading) {
                console.log('loading');
                return (
                  <tr key="loadingMessage">
                    <td colSpan="5"><LoadingAnimation message="Loading Permits" /></td>
                  </tr>
                );
              } 

              if (error) {
                console.log('error!', error);
                return <p>Problem!</p>;
              } 

              if (data.permits_by_address_realtime !== null) {

                const permitList = data.permits_by_address_realtime.map((permit, index) => {
                  return (
                    <tr key={index} title={`Permit ${permit.permit_number} for ${permit.applicant_name}`}>
                      <td><Link to={`/permits/${permit.permit_number}`} target="_blank" rel="noopener noreferrer">{permit.permit_number}</Link></td>
                      <td>{permit.applicant_name}</td>
                      <td>{permit.permit_category}</td>
                      <td>{permit.permit_type}</td>
                      <td>
                        <div style={{whiteSpace: "break-spaces", minWidth: "300px"}}>
                          {permit.permit_description}
                        </div>                      
                      </td>
                    </tr>
                  );
                });
  
                return permitList;
              }
             
              return (
                <tr key="emptyResults">
                  <td colSpan="5">No results found</td>
                </tr>
              );
              
            }}
          </Query>
        </tbody>
      </table>
    </div>
  ); 

};

export default PermitSearchResultsByAddress;
