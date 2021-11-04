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
        applied_date
        permit_description
    }
  }`;

  console.log('address lookup props', props);

  return (
    <Query 
      query={addressQuery}
      variables={{ civicaddress_id: parseInt(props.data.civic_address_id) } }
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
        const permitList = data.permits_by_address_realtime.map((permit, index) => {
          return <li key={index}><Link to={`/permits/${permit.permit_number}`}>{permit.permit_number}</Link></li>
        });
        let results;
        // if (props.searchTarget === 'permit') {
        //   results = <p><Link to={`/permits/${data.permit_realtime.permit_number}`}>{data.permit_realtime.permit_number} - {data.permit_realtime.application_name}</Link></p>;
        // }
        // else {
          // results = <PermitSearchResultsAddress data={data.search[0].results} />;
          results = <div>{props.data.address}, {props.data.zipcode}<ul>{permitList}</ul></div>;
        // }

        
       
        return results;
        
      }}
    </Query>
  ); 

};

export default PermitSearchResultsByAddress;
