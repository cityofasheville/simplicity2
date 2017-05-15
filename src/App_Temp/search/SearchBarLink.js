import React from 'react';
import { Link } from 'react-router';
import SearchByEntities from './searchByEntities/SearchByEntities';

const SearchBarLink = props => (
  <div className="col-xs-12">
    <Link to="/search">
      <form onSubmit={event => event.preventDefault()}>
        <p className="text-muted text-center lead">Discover city data about <strong>places</strong> in your community.</p>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Enter a keyword..."
            defaultValue={props.text}
            onKeyUp={props.onKeyUp}
          />
          <span className="input-group-btn">
            <button className="btn btn-primary" type="button"><i className="fa fa-search"></i></button>
          </span>
        </div>
      </form>
    </Link>
    <SearchByEntities />
  </div>
);

SearchBarLink.propTypes = {};

export default SearchBarLink;





