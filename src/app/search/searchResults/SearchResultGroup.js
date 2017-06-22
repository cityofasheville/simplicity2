import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import FaMapMarker from 'react-icons/lib/fa/map-marker';
import FaHome from 'react-icons/lib/fa/home';
import FaRoad from 'react-icons/lib/fa/road';
import FaBuildingO from 'react-icons/lib/fa/building-o';
import FaShield from 'react-icons/lib/fa/shield';
import FaUser from 'react-icons/lib/fa/user';
import FaQuestion from 'react-icons/lib/fa/question';
import FaChevronDown from 'react-icons/lib/fa/chevron-down';
import SearchResult from './SearchResult';
import styles from './searchResultGroup.css';
import stylesResult from './searchResult.css';

class SearchResultGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = { resultsToShow: 3, numResults: props.results.length, focusedIndex: -1 };
    this.show3More = this.show3More.bind(this);
  }

  componentDidUpdate() {
    this.focusedItem.focus();
  }

  getIcon(icon) {
    switch (icon) {
      case 'fa-map-marker':
        return (<FaMapMarker size={26} style={{ marginRight: '5px' }} />);
      case 'fa-home':
        return (<FaHome size={26} style={{ marginRight: '5px' }} />);
      case 'fa-road':
        return (<FaRoad size={26} style={{ marginRight: '5px' }} />);
      case 'fa-users':
        return (<i className={['fa', 'fa-users', styles.searchResultIcon].join(' ')}></i>);
      case 'fa-building-o':
        return (<FaBuildingO size={26} style={{ marginRight: '5px' }} />);
      case 'fa-shield':
        return (<FaShield size={26} style={{ marginRight: '5px' }} />);
      case 'fa-user':
        return (<FaUser size={26} style={{ marginRight: '5px' }} />);
      default:
        return (<FaQuestion size={26} style={{ marginRight: '5px' }} />);
    }
  }

  show3More(ev) {
    if (ev.nativeEvent.screenX === 0 &&
      ev.nativeEvent.screenY === 0 &&
      ev.nativeEvent.clientX === 0 &&
      ev.nativeEvent.clientY === 0
    ) {
      // then "click" activated by enter key
      this.setState({ focusedIndex: this.state.resultsToShow });
    } else {
      this.setState({ focusedIndex: -1 });
    }
    this.setState({ resultsToShow: this.state.resultsToShow += 3 });
  }

  // the javascript:void(0) is for screenreaders/letting link be tabbable without href
  render() {
    return (
      <div className={['col-xs-12', styles.searchResultGroup].join(' ')}>
        <h2>
          {this.getIcon(this.props.icon)}
          {this.props.label}
          <span className="offscreen">Number of results</span>
          <span className="badge">{this.props.count}</span>
        </h2>
        {
          this.props.results.slice(0, this.state.resultsToShow).map((result, index) => (
            <SearchResult
              key={result.id}
              id={result.id}
              type={result.type}
              label={result.label}
              ref={this.state.focusedIndex === index ? (focusedItem) => { this.focusedItem = focusedItem; } : null}
            >
              {result.label}
            </SearchResult>
          ))
        }
        {this.state.resultsToShow < this.state.numResults &&
          <Link onClick={this.show3More} to="javascript:void(0)" className={stylesResult.searchResult}>
            <div className="form-group">
              <div className={['form-control', stylesResult.searchResultDiv].join(' ')}>
                More
                <div className="pull-right"><FaChevronDown size={26} /></div>
              </div>
            </div>
          </Link>
        }
      </div>
    );
  }
}

const resultsShape = {
  id: PropTypes.string,
  type: PropTypes.string,
  label: PropTypes.string,
};

SearchResultGroup.propTypes = {
  label: PropTypes.string,
  count: PropTypes.number,
  icon: PropTypes.string,
  results: PropTypes.arrayOf(PropTypes.shape(resultsShape)),
};

export default SearchResultGroup;
