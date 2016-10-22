import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import messages from './searchBoxMessages';
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
    console.log(`The query string is ${this.state.queryString}`);
    let searchResult = null;
    if (this.state.queryString.length > 2) {
      searchResult = <SearchResults contexts={['civicAddressId']} searchString={this.state.queryString} />;
    }
    return (
      <div className={styles.searchBox}>
        <h3><FormattedMessage {...messages.header} /></h3>
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
