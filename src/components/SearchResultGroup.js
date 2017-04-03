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
    this.state = { resultsToShow: 3, numResults: props.results.length };
    this.show3More = this.show3More.bind(this);
  }

  show3More() {
    this.setState({ resultsToShow: this.state.resultsToShow += 3 });
  }

  render() {
    return (
      <div className={['col-xs-12', styles.searchResultGroup].join(' ')}>
        <h3>
          <i className={['fa', this.props.icon].join(' ')}></i>
          {this.props.label}
          <span className="badge">{this.props.count}</span>
        </h3>
        {renderSearchResults(this.props.results, this.props.icon, this.props.label, this.state.resultsToShow)}
        {this.state.resultsToShow < this.state.numResults &&
          <Link onClick={this.show3More} className={stylesResult.searchResult}>
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
