import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../shared/Icon';
import { IM_SHIELD3, IM_OFFICE, IM_ROAD, IM_USER, IM_USERS, IM_LOCATION, IM_HOME2, IM_QUESTION, IM_ARROW_RIGHT2 } from '../../../shared/iconConstants';
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

const getIcon = (type) => {
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
    default:
      return (<span style={{ marginRight: '5px' }}><Icon path={IM_QUESTION} size={26} /></span>);
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
            {getIcon(this.props.type)}
            {this.props.children}
            <div className="pull-right"><Icon path={IM_ARROW_RIGHT2} size={26} /></div>
          </div>
        </div>
      </a>
    );
  }
}

SearchResult.propTypes = {
  children: PropTypes.node,
  type: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
};

export default SearchResult;
