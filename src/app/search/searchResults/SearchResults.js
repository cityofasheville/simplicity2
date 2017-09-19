import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import SearchResultGroup from './SearchResultGroup';
import LoadingAnimation from '../../../shared/LoadingAnimation';

const getResultType = (type) => {
  switch (type) {
    case 'address':
    case 'civicAddressId':
      return 'address';
    case 'property':
    case 'pin':
      return 'property';
    default:
      return type;
  }
};

const getEntitiesToSearch = (entities) => {
  const entitiesToSearch = [];
  for (let entity of entities) {
    if (entity.checked) {
      if (entity.type === 'address') {
        entitiesToSearch.push('address');
        entitiesToSearch.push('civicAddressId');
      } else if (entity.type === 'property') {
        entitiesToSearch.push('pin');
        entitiesToSearch.push('property');
      } else if (entity.type === 'neighborhood') {
        entitiesToSearch.push('neighborhood');
      } else if (entity.type === 'street') {
        entitiesToSearch.push('street');
      } else if (entity.type === 'owner') {
        entitiesToSearch.push('owner');
      } else if (entity.type === 'google') {
        entitiesToSearch.push('google');
      }
    }
  }
  return entitiesToSearch;
};

const SearchResults = (props) => {
  if (props.data.loading) {
    return <LoadingAnimation message="Searching..." />;
  }
  if (props.data.error) {
    if (props.data.error.message !== 'GraphQL error: TypeError: Cannot read property \'length\' of undefined' && props.data.error.message !== 'GraphQL error: TypeError: Cannot read property \'filter\' of undefined') {
      return <p>{props.data.error.message}</p>;
    }
    return (
      <div className="row">
        <div className="col-sm-12">
          <div className="alert alert-info alert-sm">
            Enter a search term above to get results
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
          label: getResultType(context.results[0].type),
          results: context.results.map((result) => {
            switch (result.type) {
              case 'address':
              case 'civicAddressId':
                return {
                  label: [result.address, result.zipcode].join(', '),
                  type: 'address',
                  id: result.civic_address_id,
                };
              case 'property':
              case 'pin':
                return {
                  label: [[result.pinnum, result.pinnumext, ' -- '].join(''), result.address, ', ', result.zipcode].join(''),
                  type: 'property',
                  id: [result.pinnum, result.pinnumext].join(''),
                };
              default:
                return result;
            }
          }),
        }
      );
    }
  }
  return (
    <div className="row">
      <div className="col-sm-12">
        {
          formattedResults.length > 0 ?
          formattedResults.map(resultGroup => (
            <SearchResultGroup
              key={resultGroup.label}
              data={resultGroup}
            />
          )) :
          props.searchText === undefined || props.searchText.length === 0 ?
            <div className="alert alert-info alert-sm">
              Enter a search term above to get results
            </div> :
            <div className="alert alert-warning alert-sm">
              No results found. Try a different search term
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
};

const mapStateToProps = (state, ownProps) => (
  {
    searchText: state.search.text,
    searchEntities: state.searchByEntities.entities,
  }
);

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
          pinnumext
          address
          city
          zipcode
        }
      }
    }
  }
`;

const SearchResultsWithData = graphql(searchQuery, {
  options: ownProps => ({ variables: { searchString: ownProps.searchText || '', searchContexts: getEntitiesToSearch(ownProps.searchEntities) } }),
})(SearchResults);

export default connect(mapStateToProps)(SearchResultsWithData);
