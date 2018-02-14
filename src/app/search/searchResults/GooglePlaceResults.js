import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import SearchResultGroup from './SearchResultGroup';
import LoadingAnimation from '../../../shared/LoadingAnimation';

const getEntitiesToSearch = () => (
  ['address']
);

const GooglePlaceResults = (props) => {
  if (props.data === undefined) {
    return <div className="alert alert-info alert-sm">No results found.</div>;
  }
  if (props.data.loading) {
    return <LoadingAnimation message="Searching..." />;
  }
  if (props.data.error) {
    return (
      <div className="row">
        <div className="col-sm-12">
          <div className="alert alert-warning alert-sm">
            {props.data.error.message}
          </div>
        </div>
      </div>
    );
  }

  const formattedResults = [];
  for (let context of props.data.search) {
    if (context !== null && context.results.length > 0) {
      formattedResults.push(
        {
          label: 'address',
          results: context.results.map(result => (
            {
              label: [result.address, result.zipcode].join(', '),
              type: 'address',
              id: result.civic_address_id,
            }
          )),
        }
      );
    }
  }

  const renderResults = () => {
    if (formattedResults[0].results.length === 0) {
      return (
        <div className="alert alert-info alert-sm">
        No results found.
      </div>
      );
    }
    if (formattedResults[0].results.length === 1) {
     browserHistory.push(['/address', '?entity=address', '&id=', formattedResults[0].results[0].id, '&label=', props.placeSearch, '&hideNavbar=', props.location.query.hideNavbar, '&search=', props.location.query.search, '&entities=', props.location.query.entities].join(''));
    }
    return (
      <div>
        <h2>Multiple addresses found</h2>
        <p>
          <i>{props.location.query.placeSearch}</i>, the address from Google associated with the search <i>{props.location.query.search}</i>, returned multiple results in SimpliCity. Explore the potential matches below.
        </p>
        {formattedResults.map((resultGroup, index) => (
          <SearchResultGroup
            key={[resultGroup.label, index].join('_')}
            data={resultGroup}
            searchText={props.location.query.placeSearch}
            selectedEntities={props.location.query.entities}
            originalSearch={props.location.query.search}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="row">
      <div className="col-sm-12">
        {
          renderResults()
        }
      </div>
    </div>
  );
};

const resultsShape = {
  label: PropTypes.string,
  type: PropTypes.string,
  results: PropTypes.array,
};

GooglePlaceResults.propTypes = {
  results: PropTypes.arrayOf(PropTypes.shape(resultsShape)),
  searchText: PropTypes.string,
  placeSearch: PropTypes.string,
};

const searchQuery = gql`
  query searchQuery($searchString: String!, $searchContexts: [String]) {
    search(searchString: $searchString, searchContexts: $searchContexts) {
      type
      results {
        type
        ... on AddressResult {
          civic_address_id
          address
          zipcode
        }
      }
    }
  }
`;

export default graphql(searchQuery, {
  skip: ownProps => (!ownProps.location.query.placeSearch),
  options: ownProps => ({ variables: { searchString: ownProps.location.query.placeSearch, searchContexts: getEntitiesToSearch() } }),
})(GooglePlaceResults);
