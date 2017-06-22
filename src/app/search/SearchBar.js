import React from 'react';
import PropTypes from 'prop-types';
import FaSearch from 'react-icons/lib/fa/search';
import SearchByEntities from './searchByEntities/SearchByEntities';

const SearchBar = props => (
  <div className="col-xs-12">
    <h1>Discover city data about <strong>places</strong> in your community.</h1>
    <form onSubmit={event => event.preventDefault()}>
      <div className="input-group">
        <label htmlFor="searchBox" className="offscreen">Search terms</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter a keyword..."
          defaultValue={props.text}
          onKeyUp={props.onKeyUp}
          id="searchBox"
          name="searchBox"
        />
        <span className="input-group-btn">
          <button className="btn btn-primary" type="button" aria-label="search"><FaSearch /></button>
        </span>
      </div>
      <SearchByEntities />
    </form>
  </div>
);

SearchBar.propTypes = {
  text: PropTypes.string,
  onKeyUp: PropTypes.func,
};



export default SearchBar;

