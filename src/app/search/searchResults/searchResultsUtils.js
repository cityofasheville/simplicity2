import React from 'react';
import gql from 'graphql-tag';
import { IM_SHIELD3, IM_OFFICE, IM_ROAD, IM_USER, IM_USERS, IM_LOCATION, IM_HOME2, IM_QUESTION, IM_GOOGLE, IM_SEARCH } from '../../../shared/iconConstants';
import Icon from '../../../shared/Icon';


export const searchQuery = gql`
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

export const getResultType = (type) => {
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

export const getEntities = (selected) => {
  const entityTypes = selected.split(',');
  const entities = [
    { label: 'Addresses', type: 'address', checked: true },
    { label: 'Properties', type: 'property', checked: true },
    { label: 'Neighborhoods', type: 'neighborhood', checked: true },
    { label: 'Streets', type: 'street', checked: true },
    { label: 'Owners', type: 'owner', checked: true },
    { label: 'Google places', type: 'google', checked: true },
  ];
  // return all if none
  if (selected === undefined || selected === 'undefined' || selected.length === 0) {
    return entities;
  }
  for (let entity of entities) {
    if (entityTypes.indexOf(entity.type) === -1) {
      entity.checked = false;
    }
  }
  return entities;
};

export const getEntitiesToSearch = (entities) => {
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

export const getLink = (type, id, search, entities, label, originalSearch) => {
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

export const getPlural = (type) => {
  switch (type) {
    case 'address':
      return 'Addresses';
    case 'property':
      return 'Properties';
    case 'owner':
      return 'Owners';
    default:
      return [type.charAt(0).toUpperCase(), type.slice(1), 's'].join('');
  }
};

export const formatSearchResults = (search) => {
  const formattedResults = [];
  for (let context of search) {
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
        });
    }
  }
  return formattedResults;
};

export const getIcon = (type) => {
  switch (type) {
    case 'address':
      return (<span style={{ marginRight: '5px' }}><Icon path={IM_LOCATION} size={26} /></span>);
    case 'property':
      return (<span style={{ marginRight: '5px' }}><Icon path={IM_HOME2} size={26} /></span>);
    case 'street':
      return (<span style={{ marginRight: '5px' }}><Icon path={IM_ROAD} size={26} /></span>);
    case 'neighborhood':
      return (<span style={{ marginRight: '5px' }}><Icon path={IM_USERS} size={26} /></span>);
    case 'permit':
      return (<span style={{ marginRight: '5px' }}><Icon path={IM_OFFICE} size={26} /></span>);
    case 'crime':
      return (<span style={{ marginRight: '5px' }}><Icon path={IM_SHIELD3} size={26} /></span>);
    case 'owner':
      return (<span style={{ marginRight: '5px' }}><Icon path={IM_USER} size={26} /></span>);
    case 'place':
      return (<span style={{ marginRight: '5px' }}><Icon path={IM_GOOGLE} size={26} /></span>);
    case 'search':
      return (<span style={{ marginRight: '5px' }}><Icon path={IM_SEARCH} size={26} /></span>);
    default:
      return (<span style={{ marginRight: '5px' }}><Icon path={IM_QUESTION} size={26} /></span>);
  }
};
