import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import { getSearchText } from './searchQueries';

import SearchBar from './SearchBar';

import { searchKeyUp } from './searchActions';

let timeout = null;

const Search = props => (
  <div>
    {console.log('search', props.searchText.search, props)}
    <div className="row">
      <SearchBar text={props.text || props.location.query.search} selectedEntities={props.location.query.entities} onKeyUp={props.onKeyUp} onSearchClick={props.onSearchClick} location={props.location} />
    </div>
  </div>
);

Search.propTypes = {
  text: PropTypes.string,
  onKeyUp: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => (
  {
    text: state.search.text,
  }
);

const mapDispatchToProps = dispatch => (
  {
    onKeyUp: (event) => {
      event.persist();
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        dispatch(searchKeyUp(event.target.value));
      }, 500);
    },
    onSearchClick: (value) => {
      dispatch(searchKeyUp(value));
    },
  }
);

//export default connect(mapStateToProps, mapDispatchToProps)(Search);

export default graphql(getSearchText, {
  props: ({ data: { searchText } }) => ({
    searchText,
  }),
})(Search);

