import React from 'react';
import SearchByEntity from './SearchByEntity';
import styles from './searchByEntities.css';

const SearchByEntities = props => (
  <ul className={styles.searchEntitiesUL}>
    {props.entities.map((entity, i) => (
      <li key={['entity', i].join('_')} className={entity.checked ? 'text-primary' : styles.unchecked}>
        <SearchByEntity entity={entity} />
      </li>
    ))}
  </ul>
);

const entityDataShape = {
  entityType: React.PropTypes.string,
  checked: React.PropTypes.bool,
};

SearchByEntities.propTypes = {
  entities: React.PropTypes.arrayOf(React.PropTypes.shape(entityDataShape)),
};

SearchByEntities.defaultProps = {
  entities: [
    { entityType: 'Neighborhoods', checked: true },
    { entityType: 'Streets', checked: true },
    { entityType: 'Addresses', checked: true },
    { entityType: 'Owners', checked: false },
    { entityType: 'Google places', checked: true },
    { entityType: 'Properties', checked: true },
  ],
};

export default SearchByEntities;
