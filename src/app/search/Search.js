import React from 'react';
import { graphql, compose } from 'react-apollo';
import { getSearchText } from './graphql/searchQueries';
import { updateSearchText } from './graphql/searchMutations';

import SearchBar from './SearchBar';

let timeout = null;

function Search (props) {
  console.log('Search props', props);
  return (
    <div>
      <div className="row">
        <SearchBar
          text={props.searchText.search || props.location.query.search}
          selectedEntities={props.location.query.entities}
          onKeyUp={(e) => {
            e.persist();
            clearTimeout(timeout);
            timeout = setTimeout(() => {
              console.log('debounced bit!', e.target.value);
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
      </div>
    </div>
  );
}

export default compose(
  graphql(updateSearchText, { name: 'updateSearchText' }),
  graphql(getSearchText, {
    props: ({ data: { searchText } }) => ({
      searchText,
    }),
  })
)(Search);
