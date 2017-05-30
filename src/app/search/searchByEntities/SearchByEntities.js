import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SearchByEntity from './SearchByEntity';
import { toggleSearchByEntity } from './searchByEntitiesActions';
import styles from './searchByEntities.css';

const SearchByEntities = props => (
  <div>
    <span className="offscreen">Entities to search by</span>
    <ul className={styles.searchEntitiesUL}>
      {props.entities.map((entity, i) => (
        <li key={['entity', i].join('_')} className={entity.checked ? 'text-primary' : styles.unchecked}>
          <SearchByEntity entity={entity} onClick={props.toggleEntity} />
        </li>
      ))}
    </ul>
  </div>
);

const entityDataShape = {
  entityType: PropTypes.string,
  checked: PropTypes.bool,
};

SearchByEntities.propTypes = {
  entities: PropTypes.arrayOf(PropTypes.shape(entityDataShape)),
  toggleEntity: PropTypes.func,
};

SearchByEntities.defaultProps = {
  entities: [
    { entityType: 'Neighborhoods', checked: true },
    { entityType: 'Streets', checked: true },
    { entityType: 'Addresses', checked: true },
    { entityType: 'Owners', checked: true },
    { entityType: 'Google places', checked: true },
    { entityType: 'Properties', checked: true },
  ],
};

const mapStateToProps = state => (
  {
    entities: state.searchByEntities.entities,
  }
);

const mapDispatchToProps = dispatch => (
  {
    toggleEntity: entityType => (
      dispatch(toggleSearchByEntity(entityType))
    ),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(SearchByEntities);
