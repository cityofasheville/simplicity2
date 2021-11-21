import React from 'react';
import PermitSearchResultsByAddress from './PermitSearchResultsByAddress'

function PermitSearchResultsAddress(props) {

  if (props.data === null) {
    return <p>No results found</p>;
  }

  if (!props.data.length) {
    return <p>No results found</p>;
  }

  const addressList = props.data.map((result, index) => {

    const addressButtonStyle = (parseInt(result.civic_address_id) === parseInt(props.showPermitsForID)) ? 'active' : '';
    
    return (
      <li key={index}>
        <button 
          type="button" 
          title={`View permits for ${result.address}`}
          data-address={result.civic_address_id} 
          className={`list-group-item list-group-item-action ${addressButtonStyle}`} 
          onClick={props.handleAddressSelection}
        >
          {result.address}, {result.zipcode} (ID: {result.civic_address_id})
        </button>
        {parseInt(result.civic_address_id) === parseInt(props.showPermitsForID) &&
          <PermitSearchResultsByAddress key={index} civicAddressID={result.civic_address_id} />      
        }
      </li>
    );
  })

  return addressList; 
};

export default PermitSearchResultsAddress;
