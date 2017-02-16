import React from 'react';

const SearchBar = props => (
  <div className="col-xs-12">
    <form onSubmit={event => event.preventDefault()}>
      <input
        type="text"
        className="form-control search-bar"
        defaultValue={props.text}
        autoFocus
        placeholder="Search for an address, location, name or ID..."
        onKeyUp={props.onKeyUp}
      />
      <i className="fa fa-search fa-2x text-primary search-icon-in-search"></i>
      <i className="fa fa-caret-down fa-2x text-primary icon-in-search"></i>
    </form>
  </div>
);

SearchBar.propTypes = {
  text: React.PropTypes.string,
  onKeyUp: React.PropTypes.func,
};



export default SearchBar;

