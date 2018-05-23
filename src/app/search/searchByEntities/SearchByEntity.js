import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../shared/Icon';
import { IM_SHIELD3, IM_OFFICE, IM_ROAD, IM_USER, IM_USERS, IM_LOCATION, IM_HOME2, IM_QUESTION, IM_ARROW_RIGHT2, IM_GOOGLE, IM_LIBRARY2 } from '../../../shared/iconConstants';
import styles from './searchByEntities.css';

const getIcon = (entityType) => {
  switch (entityType) {
    case 'neighborhood':
      return <span style={{ marginLeft: '3px'}}><Icon path={IM_USERS} size={26} /></span>;
    case 'street':
      return <span style={{ marginLeft: '3px'}}><Icon path={IM_ROAD} size={26} /></span>;
    case 'address':
      return <Icon path={IM_LOCATION} size={26} />;
    case 'owner':
      return <span style={{ marginLeft: '3px'}}><Icon path={IM_USER} size={26} /></span>;
    case 'google':
      return <span style={{ marginLeft: '4px'}}><Icon path={IM_GOOGLE} size={26} /></span>;
    case 'property':
      return <span style={{ marginLeft: '4px'}}><Icon path={IM_HOME2} size={26} /></span>;
    default:
      return <span style={{ marginLeft: '3px'}}><Icon path={IM_LIBRARY2} size={26} /></span>;
  }
};

const SearchByEntity = props => (
  <div onClick={() => props.onClick(props.entity.type)}>
    <input type="checkbox" aria-label={props.entity.label} label={props.entity.label} value={props.entity.type} checked={props.entity.checked} readOnly />
    {getIcon(props.entity.type)}
    <span className={props.entity.checked === true ? ['text-primary', styles.entityDescription].join(' ') : styles.entityDescriptionUnchecked}>
      {props.entity.label}
    </span>
  </div>
);

const entityDataShape = {
  label: PropTypes.string,
  type: PropTypes.string,
  checked: PropTypes.bool,
};

SearchByEntity.propTypes = {
  entity: PropTypes.shape(entityDataShape).isRequired,
  onClick: PropTypes.func,
};

export default SearchByEntity;

