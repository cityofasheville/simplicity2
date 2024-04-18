import React from 'react';
import { Link } from 'react-router';
import { graphql, Query } from 'react-apollo';
import gql from 'graphql-tag';
import LoadingAnimation from '../../../shared/LoadingAnimation';
import PermitSearchResultsTable from './PermitSearchResultsTable';

import Error from '../../../shared/Error';

function PermitSearchResultsByAddress(props) {

  const addressQuery = gql`
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
      civic_address_id:
      address
      x
      y
    }
  }`;

  console.log('address lookup props', props);

  return (
    <div className="table-responsive" style={{"marginTop": "8px"}}>
      <table className="table table-hover table-bordered">
        <thead className="thead-dark">
          <tr>
            <th scope="col" style={{"width": "15%"}}>Permit NumberRRR</th>
            <th scope="col" style={{"width": "15%"}}>Applicant</th>
            <th scope="col" style={{"width": "15%"}}>Category</th>
            <th scope="col" style={{"width": "15%"}}>Type</th>
            <th scope="col" style={{"width": "40%"}}>Description!!</th>
          </tr>
        </thead>
        <tbody>
          <Query 
            query={addressQuery}
            variables={{ civicaddress_id: parseInt(props.civicAddressID) } }
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

                return <PermitSearchResultsTable data={data.permits_by_address_realtime} />;

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
  
                // return permitList;
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
