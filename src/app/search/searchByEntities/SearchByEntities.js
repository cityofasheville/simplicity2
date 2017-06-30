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
  label: PropTypes.String,
  entityType: PropTypes.string,
  checked: PropTypes.bool,
};

SearchByEntities.propTypes = {
  entities: PropTypes.arrayOf(PropTypes.shape(entityDataShape)),
  toggleEntity: PropTypes.func,
};

SearchByEntities.defaultProps = {
  entities: [
    { label: 'Neighborhoods', type: 'neighborhood', checked: true },
    { label: 'Streets', type: 'street', checked: true },
    { label: 'Addresses', type: 'address', checked: true },
    { label: 'Owners', type: 'owner', checked: true },
    { label: 'Google places', type: 'google', checked: true },
    { label: 'Properties', type: 'property', checked: true },
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
