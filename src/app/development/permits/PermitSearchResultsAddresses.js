import React from 'react';
import PermitSearchResultsByAddress from './PermitSearchResultsByAddress'
// import { Link } from 'react-router';
// import { graphql, Query } from 'react-apollo';
// import gql from 'graphql-tag';
// import LoadingAnimation from '../../../shared/LoadingAnimation';
// import Error from '../../../shared/Error';

function PermitSearchResultsAddress(props) {

  const addressList = props.data.map((result, index) => {
    return <PermitSearchResultsByAddress key={index} data={result} />
    // return <li key={index}>{result.address} | {result.civic_address_id} | {result.zipcode}</li>
  })

  return (
    <ul>
      {addressList}
    </ul>
  ); 

};


export default PermitSearchResultsAddress;
