import React from 'react';

const Search = () => (
  <div className="col-xs-12">
    <form>
      <input
        type="text"
        className="form-control search"
        placeholder="Search for an address, location, name or ID..."
      />
      <i className="fa fa-search fa-2x text-primary search-icon-in-search"></i>
      <i className="fa fa-caret-down fa-2x text-primary icon-in-search"></i>
    </form>
  </div>
);

Search.propTypes = {};

export default Search;





