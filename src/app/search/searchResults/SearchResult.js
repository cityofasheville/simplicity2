import React from 'react';
import PropTypes from 'prop-types';
import FaMapMarker from 'react-icons/lib/fa/map-marker';
import FaHome from 'react-icons/lib/fa/home';
import FaRoad from 'react-icons/lib/fa/road';
import FaBuildingO from 'react-icons/lib/fa/building-o';
import FaShield from 'react-icons/lib/fa/shield';
import FaUser from 'react-icons/lib/fa/user';
import FaQuestion from 'react-icons/lib/fa/question';
import FaChevronRight from 'react-icons/lib/fa/chevron-right';
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
      return (<FaMapMarker size={26} style={{ marginRight: '5px' }} />);
    case 'property':
      return (<FaHome size={26} style={{ marginRight: '5px' }} />);
    case 'street':
      return (<FaRoad size={26} style={{ marginRight: '5px' }} />);
    case 'neighborhood':
      return (<i className={['fa', 'fa-users', styles.searchResultIcon].join(' ')}></i>);
    case 'permit':
      return (<FaBuildingO size={26} style={{ marginRight: '5px' }} />);
    case 'crime':
      return (<FaShield size={26} style={{ marginRight: '5px' }} />);
    case 'owner':
      return (<FaUser size={26} style={{ marginRight: '5px' }} />);
    default:
      return (<FaQuestion size={26} style={{ marginRight: '5px' }} />);
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
            <div className="pull-right"><FaChevronRight size={26} /></div>
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
