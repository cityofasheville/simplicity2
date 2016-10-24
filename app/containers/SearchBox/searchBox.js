import React from 'react';
import { connect } from 'react-redux';
import styles from './searchBoxStyles.css';
import SearchResults from './SearchResults/searchResults';

export class SearchBox extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.state = { value: '', queryString: '' };
    this.localOnChange = this.localOnChange.bind(this);
  }

  localOnChange(e) {
    this.setState({
      value: e.currentTarget.value,
      queryString: e.currentTarget.value,
    });
  }

  render() {
    let searchResult = null;
    if (this.state.queryString.length > 2) {
      searchResult = <SearchResults searchContexts={['civicAddressId']} searchString={this.state.queryString} />;
    }
    return (
      <div className={styles.searchBox}>
        <input type="text" onChange={this.localOnChange} placeholder="Enter civic address id"></input>
        <hr />
        {searchResult}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { searchBox } = state;
  const props = {
    searchBox,
  };
  return props;
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBox);
