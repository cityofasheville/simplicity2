import React from 'react';
import PropTypes from 'prop-types';

import SearchResultGroup from './SearchResultGroup';

const SearchResults = props => (
  <div className="row">
    {
      props.results.map(resultGroup => (
        <SearchResultGroup
          key={resultGroup.label}
          data={resultGroup}
        />
      ))
    }
  </div>
);

const resultsShape = {
  label: PropTypes.string,
  type: PropTypes.string,
  results: PropTypes.array,
};


SearchResults.propTypes = {
  results: PropTypes.arrayOf(PropTypes.shape(resultsShape)),
};

export default SearchResults;
