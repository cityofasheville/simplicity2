import React from 'react';
import { Link } from 'react-router';
import styles from './searchResult.css';

const getLink = (type, id, label) => {
  switch (type) {
    case 'address':
      return `/address?label=${label}&id=${id}`;
    case 'property':
      return `/property?label=${label}&id=${id}`;
    case 'street':
      return `/street?label=${label}&id=${id}`;
    case 'neighborhood':
      return `/neighborhood?label=${label}&id=${id}`;
    case 'permit':
      return `/development/detail?label=${label}&id=${id}`;
    case 'crime':
      return `/crime/detail?label=${label}&id=${id}`;
    case 'owner':
      return `/owner?label=${label}&id=${id}`;
    default:
      return '/';
  }
};

const SearchResult = props => (
  <Link to={getLink(props.type, props.id, props.label)} className={styles.searchResult}>
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
  label: React.PropTypes.string,
};

export default SearchResult;
