import React from 'react';

const SearchResults = props => (
  <div className="">
    <h1>Search Results</h1>
    { props.children }
  </div>
);

SearchResults.propTypes = {
  children: React.PropTypes.node,
};

export default SearchResults;
