import React from 'react';
import { connect } from 'react-redux';
import SearchByEntity from './SearchByEntity';
import { toggleSearchByEntity } from '../containers/searchByEntitiesActions';
import styles from './searchByEntities.css';

const SearchByEntities = props => (
  <ul className={styles.searchEntitiesUL}>
    {props.entities.map((entity, i) => (
      <li key={['entity', i].join('_')} className={entity.checked ? 'text-primary' : styles.unchecked}>
        <SearchByEntity entity={entity} onClick={props.toggleEntity} />
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
  toggleEntity: React.PropTypes.func,
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
