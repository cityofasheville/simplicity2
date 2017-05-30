import React from 'react';
import PropTypes from 'prop-types';
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
  <div onClick={() => props.onClick(props.entity.entityType)}>
    <input type="checkbox" aria-label={props.entity.entityType} label={props.entity.entityType} value={props.entity.entityType} checked={props.entity.checked} readOnly />
    <span className="fa-stack fa-lg">
      <i className={props.entity.checked === true ? 'fa fa-circle fa-stack-2x text-primary' : ['fa fa-circle fa-stack-2x', styles.unchecked].join(' ')}></i>
      <i className={['fa fa-stack-1x fa-inverse fa-', getIcon(props.entity.entityType)].join('')}></i>
    </span>
    <span className={props.entity.checked === true ? ['text-primary', styles.entityDescription].join(' ') : styles.entityDescriptionUnchecked}>
      {props.entity.entityType}
    </span>
  </div>
);

const entityDataShape = {
  entityType: PropTypes.string,
  checked: PropTypes.bool,
};

SearchByEntity.propTypes = {
  entity: PropTypes.shape(entityDataShape).isRequired,
  onClick: PropTypes.func,
};

export default SearchByEntity;

