import React from 'react';
import PropTypes from 'prop-types';
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

class SearchResult extends React.Component { // eslint-disable-line
  constructor(props) {
    super(props);
    this.focus = this.focus.bind(this);
  }

  focus() {
    this.link.focus();
  }

  // must be class not stateless component for the ref in SearchResultsGroup to work
  // also can't use the Link react router element or the focus() will not work
  render() {
    return (
      <a href={getLink(this.props.type, this.props.id, this.props.label)} className={styles.searchResult} ref={(link) => { this.link = link; }}>
        <div className={['form-group', styles.searchResultFormGroup].join(' ')}>
          <div className={['form-control', styles.searchResultDiv].join(' ')}>
            <i className={['fa', this.props.icon, styles.searchResultIcon].join(' ')}></i>
            {this.props.children}
            <i className={['fa fa-chevron-right pull-right', styles.searchResultArrowIcon].join(' ')}></i>
          </div>
        </div>
      </a>
    );
  }
}

SearchResult.propTypes = {
  children: PropTypes.node,
  icon: PropTypes.string,
  type: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
};

export default SearchResult;
