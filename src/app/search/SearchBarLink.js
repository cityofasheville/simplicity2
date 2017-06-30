import React from 'react';
import { Link } from 'react-router';
import Icon from '../../shared/Icon';
import { IM_SEARCH } from '../../shared/iconConstants';
import SearchByEntities from './searchByEntities/SearchByEntities';

const SearchBarLink = props => (
  <div className="col-xs-12">
    <h1>Discover city data about <strong>places</strong> in your community.</h1>
    <Link to="/search">
      <form onSubmit={event => event.preventDefault()}>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Enter a keyword..."
            defaultValue={props.text}
            onKeyUp={props.onKeyUp}
          />
          <span className="input-group-btn">
            <button className="btn btn-primary" type="button" aria-label="search"><Icon path={IM_SEARCH} size={16} /></button>
          </span>
        </div>
      </form>
    </Link>
    <SearchByEntities />
  </div>
);

SearchBarLink.propTypes = {};

export default SearchBarLink;





