import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import Icon from '../../shared/Icon';
import { IM_SEARCH } from '../../shared/iconConstants';
//import SearchByEntities from './searchByEntities/SearchByEntities';

const getEntities = (selected) => {
  let entityTypes = [];
  const entities = [
    { label: 'Addresses', type: 'address', checked: true },
    { label: 'Properties', type: 'property', checked: true },
    { label: 'Neighborhoods', type: 'neighborhood', checked: true },
    { label: 'Streets', type: 'street', checked: true },
    { label: 'Owners', type: 'owner', checked: true },
    { label: 'Google places', type: 'google', checked: true },
  ];
  if (selected !== undefined && selected !== 'undefined' && selected.length > 0) {
    entityTypes = selected.split(',');
  } else {
    return entities;
  }
  for (let entity of entities) {
    if (entityTypes.indexOf(entity.type) === -1) {
      entity.checked = false;
    }
  }
  return entities;
};

const SearchBarLink = props => (
  <div className="col-xs-12">
    <h2 id="search-instructions">Enter address for trash pickup day, property details, and more</h2>
    {/* <Link to={['/search?entities=', props.selectedEntities].join('')}> */}
    <Link to="/search">
      <form onSubmit={event => event.preventDefault()}>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search text..."
            id="searchBox"
            defaultValue={props.text}
            onKeyUp={props.onKeyUp}
            aria-label="Simplicity Search Box"
            aria-describedBy="search-instructions"
          />
          <span className="input-group-btn">
            <button className="btn btn-primary" type="button" aria-label="search"><Icon path={IM_SEARCH} size={16} /></button>
          </span>
        </div>
      </form>
    </Link>
    <div>
      <h3 className="text-center" style={{ marginBottom: '20px' }}><i>Or search by: owner, neighborhood, pin number, or street</i></h3>
    </div>
    {/* <SearchByEntities location={props.location} entities={getEntities(props.selectedEntities)} selectedEntities={props.selectedEntities} /> */}
  </div>
);

SearchBarLink.propTypes = {
  selectedEntities: PropTypes.string,
};

SearchBarLink.defaultProps = {
  selectedEntities: '',
};

export default SearchBarLink;

