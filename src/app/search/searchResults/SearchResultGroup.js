import React from 'react';
import { Link } from 'react-router';
import SearchResult from './SearchResult';
import styles from './searchResultGroup.css';
import stylesResult from './searchResult.css';

const renderSearchResults = (results, icon, label, resultsToShow) => (
  results.slice(0, resultsToShow).map(result => (
    <SearchResult
      key={result.id}
      id={result.id}
      type={result.type}
      icon={icon}
      label={result.label}
    >
      {result.label}
    </SearchResult>
  ))
);

class SearchResultGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = { resultsToShow: 3, numResults: props.results.length, focusedIndex: -1 };
    this.show3More = this.show3More.bind(this);
  }

  componentDidUpdate() {
    console.log('rying to focus', this.focusedItem);
    this.focusedItem.focus();
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
          <i className={['fa', this.props.icon].join(' ')}></i>
          {this.props.label}
          <span className="offscreen">Number of results</span>
          <span className="badge">{this.props.count}</span>
        </h2>
        {/*{renderSearchResults(this.props.results, this.props.icon, this.props.label, this.state.resultsToShow)}*/}
        {
          this.props.results.slice(0, this.state.resultsToShow).map((result, index) => (
            <SearchResult
              key={result.id}
              id={result.id}
              type={result.type}
              icon={this.props.icon}
              label={result.label}
              ref={this.state.focusedIndex === index ? (focusedItem) => { this.focusedItem = focusedItem; console.log(focusedItem); } : null}
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
                <i className={['fa fa-chevron-down pull-right', styles.searchResultArrowIcon].join(' ')}></i>
              </div>
            </div>
          </Link>
        }
      </div>
    );
  }
}

const resultsShape = {
  id: React.PropTypes.string,
  type: React.PropTypes.string,
  label: React.PropTypes.string,
};

SearchResultGroup.propTypes = {
  label: React.PropTypes.string,
  count: React.PropTypes.number,
  icon: React.PropTypes.string,
  results: React.PropTypes.arrayOf(React.PropTypes.shape(resultsShape)),
};

export default SearchResultGroup;
