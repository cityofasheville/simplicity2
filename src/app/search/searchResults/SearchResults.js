import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import SearchResultGroup from './SearchResultGroup';
import LoadingAnimation from '../../../shared/LoadingAnimation';
import Error from '../../../shared/Error';
import {
  formatSearchResults,
  getEntities,
  getEntitiesToSearch,
} from './searchResultsUtils';


const SearchResults = (props) => {
  if (props.data === undefined) {
    return <div className="alert alert-info alert-sm">Enter a search term above to get results</div>;
  }
  if (props.data.loading) {
    return <LoadingAnimation message="Searching..." />;
  }
  if (props.data.error) {
    return <Error message={props.data.error.message} />;
  }

  const formattedResults = formatSearchResults(props.data.search);

  return (
    <div className="row">
      <div className="col-sm-12">
        {
          formattedResults.length > 0 ?
          formattedResults.map((resultGroup, index) => (
            <SearchResultGroup
              key={[resultGroup.label, index].join('_')}
              data={resultGroup}
              searchText={props.searchText}
              selectedEntities={props.location.query.entities}
            />
          )) :
          props.searchText === undefined || props.searchText.length === 0 ?
            <div className="alert alert-info alert-sm">
              Enter a search term above to get results
            </div> :
            <div className="alert alert-warning alert-sm">
              No results found. Try a different search term and/or different search type selections.
            </div>
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

SearchResults.propTypes = {
  results: PropTypes.arrayOf(PropTypes.shape(resultsShape)),
  searchText: PropTypes.string,
  searchEntities: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, type: PropTypes.string, check: PropTypes.bool })),
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
        ... on PropertyResult {
          pinnum
          address
          city
          zipcode
        }
        ... on StreetResult {
          full_street_name
          zip_code
          centerline_ids
        }
        ... on NeighborhoodResult {
          name
          nbhd_id
        }
        ... on OwnerResult {
          ownerName: name
          pinnums
        }
        ... on PlaceResult {
          type
          placeName: name
          id
          place_id
          address
          types
        }
      }
    }
  }
`;

export default graphql(searchQuery, {
  skip: ownProps => (!ownProps.searchText || ownProps.searchText.trim().length < 4),
  options: ownProps => ({ variables: { searchString: ownProps.searchText.trim(), searchContexts: getEntitiesToSearch((ownProps.location.query.entities !== undefined && ownProps.location.query.entities !== '') ? getEntities(ownProps.location.query.entities) : getEntities('address,property,neighborhood,street,owner,google')) } }),
})(SearchResults);
