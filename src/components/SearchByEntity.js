import React from 'react';
import Checkbox from './Checkbox';
import styles from './searchByEntities.css';

const getIcon = (entityType) => {
  switch (entityType) {
    case 'Neighborhoods':
      return 'users';
    case 'Streets':
      return 'road';
    case 'Addresses':
      return 'map-marker';
    case 'Owners':
      return 'user';
    case 'Google places':
      return 'google';
    case 'Properties':
      return 'home';
    default:
      return 'university';
  }
};

const SearchByEntity = props => (
  <div>
    <Checkbox label={props.entity.entityType} value={props.entity.entityType} checked={props.entity.checked} />
    <span className="fa-stack fa-lg">
      <i className="fa fa-circle fa-stack-2x"></i>
      <i className={['fa fa-stack-1x fa-inverse fa-', getIcon(props.entity.entityType)].join('')}></i>
    </span>
    <span className={styles.entityDescription}>
      {props.entity.entityType}
    </span>
  </div>
);

const entityDataShape = {
  entityType: React.PropTypes.string,
  checked: React.PropTypes.bool,
};

SearchByEntity.propTypes = {
  entity: React.PropTypes.shape(entityDataShape).isRequired,
};

export default SearchByEntity;
