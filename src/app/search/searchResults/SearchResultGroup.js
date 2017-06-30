import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import Icon from '../../../shared/Icon';
import { IM_SHIELD3, IM_OFFICE, IM_ROAD, IM_USER, IM_USERS, IM_LOCATION, IM_HOME2, IM_QUESTION, IM_ARROW_RIGHT2, IM_ARROW_DOWN2 } from '../../../shared/iconConstants';
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

  getIcon(type) {
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
          {this.getIcon(this.props.type)}
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
                <div className="pull-right"><Icon path={IM_ARROW_DOWN2} size={26} /></div>
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
  type: PropTypes.string,
  results: PropTypes.arrayOf(PropTypes.shape(resultsShape)),
};

export default SearchResultGroup;
