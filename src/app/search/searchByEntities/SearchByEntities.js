import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import SearchByEntity from './SearchByEntity';
import styles from './searchByEntities.css';

const SearchByEntities = (props) => {
  const refreshLocation = (entity) => {
    let newSelected = '';
    const curSelected = (props.location.query.entities || props.selectedEntities).split(',');
    const alreadySelected = curSelected.indexOf(entity) > -1;
    if (alreadySelected) {
      newSelected = curSelected.filter(ent => ent !== entity);
    } else {
      newSelected = [curSelected, entity].join(',').replace(/(^,)|(,$)/g, '');
    }
    browserHistory.push([props.location.pathname, '?search=', document.getElementById('searchBox').value, '&entities=', newSelected, '&hideNavbar=', props.location.query.hideNavbar].join(''));
  };

  return (
    <div>
      <span className="offscreen">Entities to search by</span>
      <ul className={styles.searchEntitiesUL}>
        {props.entities.map((entity, i) => (
          <li key={['entity', i].join('_')} className={entity.checked ? 'text-primary' : styles.unchecked}>
            <SearchByEntity entity={entity} onClick={() => refreshLocation(entity.type)} />
          </li>
        ))}
      </ul>
    </div>
  );
};

const entityDataShape = {
  label: PropTypes.String,
  entityType: PropTypes.string,
  checked: PropTypes.bool,
};

SearchByEntities.propTypes = {
  entities: PropTypes.arrayOf(PropTypes.shape(entityDataShape)),
  selectedEntities: PropTypes.string,
};

SearchByEntities.defaultProps = {
  entities: [
    { label: 'Neighborhoods', type: 'neighborhood', checked: true },
    { label: 'Streets', type: 'street', checked: true },
    { label: 'Addresses', type: 'address', checked: true },
    { label: 'Properties', type: 'property', checked: true },
    { label: 'Owners', type: 'owner', checked: true },
    //{ label: 'Google places', type: 'google', checked: true },
  ],
  selectedEntities: '',
};

export default SearchByEntities;

