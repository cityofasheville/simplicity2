import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import { accessibility } from 'accessible-react-table';
import Icon from '../../../shared/Icon';
import {
  IM_SHIELD3,
  IM_OFFICE,
  IM_ROAD,
  IM_USER,
  IM_USERS,
  IM_LOCATION,
  IM_HOME2,
  IM_QUESTION,
  IM_GOOGLE,
  IM_SEARCH,
} from '../../../shared/iconConstants';
import styles from './searchResultGroup.css';

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

const getPlural = (type) => {
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

const SearchResultGroup = (props) => {
  const getIcon = (type) => {
    switch (type) {
      case 'address':
        return (
          <span style={{ marginRight: '5px' }}>
            <Icon path={IM_LOCATION} size={26} />
          </span>
        );
      case 'property':
        return (
          <span style={{ marginRight: '5px' }}>
            <Icon path={IM_HOME2} size={26} />
          </span>
        );
      case 'street':
        return (
          <span style={{ marginRight: '5px' }}>
            <Icon path={IM_ROAD} size={26} />
          </span>
        );
      case 'neighborhood':
        return (
          <span style={{ marginRight: '5px' }}>
            <Icon path={IM_USERS} size={26} />
          </span>
        );
      case 'permit':
        return (
          <span style={{ marginRight: '5px' }}>
            <Icon path={IM_OFFICE} size={26} />
          </span>
        );
      case 'crime':
        return (
          <span style={{ marginRight: '5px' }}>
            <Icon path={IM_SHIELD3} size={26} />
          </span>
        );
      case 'owner':
        return (
          <span style={{ marginRight: '5px' }}>
            <Icon path={IM_USER} size={26} />
          </span>
        );
      case 'place':
        return (
          <span style={{ marginRight: '5px' }}>
            <Icon path={IM_GOOGLE} size={26} />
          </span>
        );
      case 'search':
        return (
          <span style={{ marginRight: '5px' }}>
            <Icon path={IM_SEARCH} size={26} />
          </span>
        );
      default:
        return (
          <span style={{ marginRight: '5px' }}>
            <Icon path={IM_QUESTION} size={26} />
          </span>
        );
    }
  };

  const dataColumns = [
    {
      headerStyle: { boxShadow: 'none' },
      Header: (
        <h2 className="pull-left">
          {getIcon(props.data.label)}
          {getPlural(props.data.label)}
          <span className="offscreen">Number of results</span>
          <span className="badge">{props.data.results.length}</span>
          {props.data.label === 'place' && (
            <img
              src={require('./powered_by_google_on_white.png')}
              alt="Powered by Google"
              style={{ marginLeft: '20px' }}
            />
          )}
        </h2>
      ),
      accessor: 'label',
      Cell: row => (
        <span className="search-results-group__row-inner">
          <a
            className="search-results-group__link"
            href={getLink(
              row.original.type,
              row.original.id,
              props.searchText,
              props.selectedEntities,
              row.original.label,
              props.originalSearch
            )}
          >
            <span className="text-primary">
              {getIcon(row.original.type === 'place' ? 'search' : row.original.type)}
              {row.value}
            </span>
          </a>
          {props.data.label === 'place' && (
            <span className="text-primary">
              <a
                href={[
                  'https://www.google.com/maps/place/?q=place_id:',
                  row.original.place_id,
                ].join('')}
                target="_blank"
              >
                <span style={{ marginRight: '5px' }}>
                  <Icon path={IM_GOOGLE} size={26} />
                </span>
                {row.original.place_name}
              </a>
            </span>
          )}
        </span>
      ),
      Filter: ({ filter, onChange }) => (
        <input
          onChange={event => onChange(event.target.value)}
          value={filter ? filter.value : ''}
          placeholder="Filter results..."
          className="full-width"
        />
      ),
    },
  ];

  const AccessibleReactTable = accessibility(ReactTable);

  return (
    <div
      className={
        `${styles.searchResultGroup
        } search-results-group` +
        ` search-results-group-${
          props.data.label}`
      }
    >
      <AccessibleReactTable
        ariaLabel="Search Results"
        data={props.data.results}
        columns={dataColumns}
        showPagination={props.data.results.length > 5}
        defaultPageSize={props.data.results.length < 5 ? props.data.results.length : 5}
        filterable={props.data.results.length > 5}
        sortable={false}
        defaultFilterMethod={(filter, row) => {
          const id = filter.pivotId || filter.id;
          return row[id] !== undefined
            ? String(row[id])
              .toLowerCase()
              .indexOf(filter.value.toLowerCase()) > -1
            : true;
        }}
      />
    </div>
  );
};

const resultsShape = {
  id: PropTypes.string,
  type: PropTypes.string,
  label: PropTypes.string,
};

const groupShape = {
  label: PropTypes.string,
  type: PropTypes.string,
  results: PropTypes.arrayOf(PropTypes.shape(resultsShape)),
};

SearchResultGroup.propTypes = {
  data: PropTypes.shape(groupShape),
  searchText: PropTypes.string,
  selectedEntities: PropTypes.string,
};

export default SearchResultGroup;
