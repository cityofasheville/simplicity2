import React from 'react';

import SearchResultGroup from './SearchResultGroup';

const SearchResults = props => (
  <div className="row">
    {
      props.results.map(resultGroup => (
        <SearchResultGroup
          key={resultGroup.label}
          label={resultGroup.label}
          count={resultGroup.results.length}
          icon={resultGroup.icon}
          results={resultGroup.results}
        />
      ))
    }
  </div>
);

const resultsShape = {
  label: React.PropTypes.string,
  icon: React.PropTypes.string,
  results: React.PropTypes.array,
};


SearchResults.propTypes = {
  results: React.PropTypes.arrayOf(React.PropTypes.shape(resultsShape)),
};

export default SearchResults;
