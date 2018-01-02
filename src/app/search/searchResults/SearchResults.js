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

const getEntities = (selected) => {
  if (selected === undefined || selected.length === 0) {
    return [];
  }
  const entityTypes = selected.split(',');
  const entities = [
    { label: 'Neighborhoods', type: 'neighborhood', checked: true },
    { label: 'Streets', type: 'street', checked: true },
    { label: 'Addresses', type: 'address', checked: true },
    { label: 'Properties', type: 'property', checked: true },
    { label: 'Owners', type: 'owner', checked: true },
    { label: 'Google places', type: 'google', checked: true },
  ];
  for (let entity of entities) {
    if (entityTypes.indexOf(entity.type) === -1) {
      entity.checked = false;
    }
  }
  return entities;
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
        entitiesToSearch.push('place');
      }
    }
  }
  return entitiesToSearch;
};

const SearchResults = (props) => {
  if (props.data === undefined) {
    return <div className="alert alert-info alert-sm">Enter a search term above to get results</div>;
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
                  label: [[result.pinnum, ' -- '].join(''), result.address, ', ', result.zipcode].join(''),
                  type: 'property',
                  id: result.pinnum,
                };
              case 'street':
                return {
                  label: result.zip_code === null ? result.full_street_name : [result.full_street_name, result.zip_code].join(', '),
                  type: 'street',
                  id: result.centerline_ids.join(','),
                };
              case 'neighborhood':
                return {
                  label: result.name,
                  type: 'neighborhood',
                  id: result.nbhd_id,
                };
              case 'owner':
                return {
                  label: result.ownerName,
                  type: 'owner',
                  id: result.pinnums.join(','),
                };
              case 'place':
                return {
                  label: result.address,
                  type: 'place',
                  id: result.address,
                  place_name: result.placeName,
                  place_id: result.place_id,
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

const mapStateToProps = (state, ownProps) => (
  {
    //searchText: state.search.text,
    searchEntities: ownProps.location.query.entities !== undefined ? getEntities(ownProps.location.query.entities) : getEntities('address,property,neighborhood,street,owner,google'),
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

const SearchResultsWithData = graphql(searchQuery, {
  skip: ownProps => (!ownProps.searchText),
  options: ownProps => ({ variables: { searchString: ownProps.searchText, searchContexts: getEntitiesToSearch(ownProps.searchEntities) } }),
})(SearchResults);

export default connect(mapStateToProps)(SearchResultsWithData);
