import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import Icon from '../../shared/Icon';
import { IM_SEARCH } from '../../shared/iconConstants';
import SearchByEntities from './searchByEntities/SearchByEntities';

const getEntities = (selected) => {
  let entityTypes = [];
  if (selected !== undefined && selected.length > 0) {
    entityTypes = selected.split(',');
  }
  const entities = [
    { label: 'Addresses', type: 'address', checked: true },
    { label: 'Properties', type: 'property', checked: true },
    { label: 'Neighborhoods', type: 'neighborhood', checked: true },
    { label: 'Streets', type: 'street', checked: true },
    { label: 'Owners', type: 'owner', checked: true },
    { label: 'Google places', type: 'google', checked: true },
  ];
  for (let entity of entities) {
    if (entityTypes.indexOf(entity.type) === -1) {
      entity.checked = false;
    }
  }
  return entities;
};

const SearchBarLink = props => (
  <div className="col-xs-12">
    <h1>Discover city data about <strong>places</strong> in your community.</h1>
    <Link to={['/search?entities=', props.selectedEntities].join('')}>
      <form onSubmit={event => event.preventDefault()}>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Enter a keyword..."
            id="searchBox"
            defaultValue={props.text}
            onKeyUp={props.onKeyUp}
          />
          <span className="input-group-btn">
            <button className="btn btn-primary" type="button" aria-label="search"><Icon path={IM_SEARCH} size={16} /></button>
          </span>
        </div>
      </form>
    </Link>
    <SearchByEntities location={props.location} entities={getEntities(props.selectedEntities)} selectedEntities={props.selectedEntities} />
  </div>
);

SearchBarLink.propTypes = {
  selectedEntities: PropTypes.string,
};

SearchBarLink.defaultProps = {
  selectedEntities: '',
};

export default SearchBarLink;

