import React from 'react';
import { Link } from 'react-router';


const SearchBarLink = props => (
  <div className="col-xs-12">
    <Link to="/search">
      <form onSubmit={event => event.preventDefault()}>
        <input
          type="text"
          className="form-control search-bar"
          placeholder="Search for an address, location, name or ID..."
        />
        <i className="fa fa-search fa-2x text-primary search-icon-in-search"></i>
        <i className="fa fa-caret-down fa-2x text-primary icon-in-search"></i>
      </form>
    </Link>
  </div>
);

SearchBarLink.propTypes = {};



export default SearchBarLink;





