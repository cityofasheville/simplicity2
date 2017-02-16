import React from 'react';
import SearchResult from './SearchResult';


const renderSearchResults = (results, icon, resultsToShow) => (
  results.slice(0, resultsToShow).map(result => (
    <SearchResult
      key={result.id}
      id={result.id}
      type={result.type}
      icon={icon}
    >
      {result.label}
    </SearchResult>
  ))
);

class SearchResultGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = { resultsToShow: 3 };
    this.show3More = this.show3More.bind(this);
  }

  show3More() {  
    this.setState({ resultsToShow: this.state.resultsToShow += 3 });
  }

  render() {
    return (
      <div className="col-xs-12">
        <h3>
          <i className={['fa', this.props.icon, 'search-result-group-icon'].join(' ')}></i>
          {this.props.label}
          <span className="badge search-result-group-count">{this.props.count}</span>
        </h3>
        {renderSearchResults(this.props.results, this.props.icon, this.state.resultsToShow)}
        <button onClick={this.show3More} className="col-xs-12 search-result more">
          More
          <i className="fa fa-chevron-down search-result-arrow-icon"></i>
        </button>
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
