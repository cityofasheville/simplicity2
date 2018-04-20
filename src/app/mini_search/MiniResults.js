import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import SearchResultGroup from '../search/searchResults/SearchResultGroup';
import LoadingAnimation from '../../shared/LoadingAnimation';
import Error from '../../shared/Error';
import InCityMessage from '../InCityMessage'

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
    { label: 'Addresses', type: 'address', checked: true },
    { label: 'Properties', type: 'property', checked: true },
    { label: 'Neighborhoods', type: 'neighborhood', checked: true },
    { label: 'Streets', type: 'street', checked: true },
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

const getLink = (type, id, search, entities, label, originalSearch) => {
  switch (type) {
    case 'address':
      if (originalSearch) {
        return `/address?search=${originalSearch}&placeSearch=${search}&id=${id}&entities=${entities}&entity=address`;
      }
      return `/address?search=${search}&id=${id}&entities=${entities}&entity=address`;
    case 'property':
      return `/property?search=${search}&id=${id}&entities=${entities}&entity=property`;
    case 'street':
      return `/street?search=${search}&id=${id}&entities=${entities}&label=${label}&entity=street`;
    case 'neighborhood':
      return `/neighborhood?search=${search}&id=${id}&entities=${entities}&label=${label}&entity=neighborhood`;
    case 'permit':
      return `/development/detail?search=${search}&id=${id}&entities=${entities}&entity=permit`;
    case 'crime':
      return `/crime/detail?search=${search}&id=${id}&entities=${entities}&entity=crime`;
    case 'owner':
      return `/owner?search=${search}&id=${id}&entities=${entities}&entity=owner&view=list`;
    case 'place':
      return `/search/googlePlaceMatches?search=${search}&placeSearch=${id}&entities=${entities}`;
    default:
      return '/';
  }
};

const MiniResults = (props) => {
  if (props.data === undefined) {
    return null;
  }
  if (props.data.loading) {
    return <LoadingAnimation message='Searching...' />;
  }
  if (props.data.error) {
    return <Error message={props.data.error.message} />;
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
    <div className='row'>
      <div className='col-sm-12'>
        {
          formattedResults.length > 0 ?
          formattedResults[0].results.map((result, index) => (
            <div
              style={{
                width: '100%',
                margin: '0.25em 1em',
              }}
              key={index}
            >
              <div
                className='text-primary'
                style={{ display: 'inline-block', minWidth: '40%'}}
              >
                <a
                  href={getLink(result.type, result.id, props.searchText, props.selectedEntities, result.label, props.originalSearch)}
                  target='_blank'
                  rel='noopener noreferrer'
                  >
                  {result.label}
                </a>
              </div>
              <div
                style={{ display: 'inline-block', fontSize: '0.55em'}}
              >
                <InCityMessage
                  inTheCity={false}
                  text={(inOutBool) => inOutBool ? "In the city" : "Outside of the city"}
                  icon={false}
                />
              </div>
            </div>
          )) :
          props.searchText === undefined || props.searchText.length === 0 ?
            null :
            <div className='alert alert-warning alert-sm'>
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

MiniResults.propTypes = {
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
  options: ownProps => ({ variables: { searchString: ownProps.searchText.trim(), searchContexts: getEntitiesToSearch(ownProps.location.query.entities !== undefined ? getEntities(ownProps.location.query.entities) : getEntities('address,property,neighborhood,street,owner,google')) } }),
})(MiniResults);
