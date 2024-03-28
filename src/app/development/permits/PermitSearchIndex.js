import React from 'react';
import { Link } from 'react-router'
import { graphql, compose } from 'react-apollo';
import { getSearchText } from '../../search/graphql/searchQueries';
import { updateSearchText } from '../../search/graphql/searchMutations';

import PermitSearchWrapper from './PermitSearchWrapper';
import PermitSearchBar from './PermitSearchBar';


function PermitSearchIndex(props) {

  return(
    <div style={{paddingTop: "32px"}}>
      <h1 className="">Development &amp; Permit Search</h1>
      {/* <PermitSearchWrapper /> */}
      <PermitSearchBar 
        // text={props.searchText.search || props.location.query.search}
        // selectedEntities={props.location.query.entities}
        onKeyUp={(e) => {
          e.persist();
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            props.updateSearchText({
              variables: {
                text: e.target.value,
              },
            });
          }, 500);
        }}
        onSearchClick={text => props.updateSearchText({
          variables: {
            text,
          },
        })}
        location={props.location}
      />
      {/* <h2 style={{ fontSize: '1.5rem', marginTop: '2rem' }}>
        Don't know the application ID? 
      </h2>
      <Link to="/permits">Search our map and filter by date</Link> */}
    </div>
  );

}

export default PermitSearchIndex;