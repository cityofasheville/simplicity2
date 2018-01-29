import React from 'react';
import { graphql, compose } from 'react-apollo';
import { getSearchText, updateSearchText } from './searchQueries';

import SearchBar from './SearchBar';

let timeout = null;

const Search = props => (
  <div>
    <div className="row">
      <SearchBar
        text={props.searchText.search || props.location.query.search}
        selectedEntities={props.location.query.entities}
        onKeyUp={(e) => {
          e.persist();
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            props.updateSearchText({
              variables: {
                searchText: e.target.value,
              },
            });
          }, 500);
        }}
        onSearchClick={text => props.updateSearchText({
          variables: {
            searchText: text,
          },
        })}
        location={props.location}
      />
    </div>
  </div>
);

export default compose(
  graphql(updateSearchText, { name: 'updateSearchText' }),
  graphql(getSearchText, {
    props: ({ data: { searchText } }) => ({
      searchText,
    }),
  })
)(Search);

