import React from 'react';
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
          <button className="btn btn-primary" type="button" aria-label="search"><i className="fa fa-search"></i></button>
        </span>
      </div>
      <SearchByEntities />
    </form>
  </div>
);

SearchBar.propTypes = {
  text: React.PropTypes.string,
  onKeyUp: React.PropTypes.func,
};



export default SearchBar;

