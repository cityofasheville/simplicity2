import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import { Link } from 'react-router';
import { accessibility } from 'accessible-react-table';
import Icon from '../../../shared/Icon';
import styles from './searchResultGroup.css';
import { getLink, getPlural, getIcon } from './searchResultsUtils';
import { IM_GOOGLE } from '../../../shared/iconConstants';
import * as poweredByGoogle from './powered_by_google_on_white.png';

const SearchResultGroup = (props) => {
  const dataColumns = [
    {
      headerStyle: { boxShadow: 'none' },
      Header: <h2 className="pull-left">
        {getIcon(props.data.label)}
        {getPlural(props.data.label)}
        <span className="offscreen">Number of results</span>
        <span className="badge">{props.data.results.length}</span>
        {props.data.label === 'place' &&
          <img src={poweredByGoogle} alt="Powered by Google" style={{ marginLeft: '20px' }}></img>
        }
      </h2>,
      accessor: 'label',
      Cell: row => (
        <span className="search-results-group__row-inner">
          <Link className="search-results-group__link" to={getLink(row.original.type, row.original.id, props.searchText, props.selectedEntities, row.original.label, props.originalSearch)}>
            <span className="text-primary">
              {getIcon(row.original.type === 'place' ? 'search' : row.original.type)}
              {row.value}
            </span>
          </Link>
          {props.data.label === 'place' &&
            <span className="text-primary">
              <a
                href={['https://www.google.com/maps/place/?q=place_id:', row.original.place_id].join('')}target="_blank"
              >
                <span style={{ marginRight: '5px' }}><Icon path={IM_GOOGLE} size={26} /></span>{row.original.place_name}
              </a>
            </span>
          }
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
    <div className={styles.searchResultGroup + ' search-results-group' + ' search-results-group-'+props.data.label }>
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
          return row[id] !== undefined ? String(row[id]).toLowerCase().indexOf(filter.value.toLowerCase()) > -1 : true;
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
