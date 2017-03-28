import React from 'react';
import { Link } from 'react-router';
import styles from './searchResult.css';

const getLink = (type, id) => {
  switch (type) {
    case 'address':
      return `/locations/address?id=${id}`;
    case 'property':
      return `/locations/property?id=${id}`;
    case 'street':
      return `/locations/street?id=${id}`;
    case 'neighborhood':
      return `/locations/neighborhood?id=${id}`;
    case 'permit':
      return `/topics/development/detail?id=${id}`;
    case 'crime':
      return `/topics/crime/detail?id=${id}`;
    default:
      return '/';
  }
};

const SearchResult = props => (
  <Link to={getLink(props.type, props.id)} className={styles.searchResult}>
    <div className={['form-group', styles.searchResultFormGroup].join(' ')}>
      <div className={['form-control', styles.searchResultDiv].join(' ')}>
        <i className={['fa', props.icon, styles.searchResultIcon].join(' ')}></i>
        {props.children}
        <i className={['fa fa-chevron-right pull-right', styles.searchResultArrowIcon].join(' ')}></i>
      </div>
    </div>
  </Link>
);

SearchResult.propTypes = {
  children: React.PropTypes.node,
  icon: React.PropTypes.string,
  type: React.PropTypes.string,
  id: React.PropTypes.string,
};

export default SearchResult;
