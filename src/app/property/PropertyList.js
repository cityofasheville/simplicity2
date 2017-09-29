import React from 'react';
import PropTypes from 'prop-types';
import PropertyListItem from './PropertyListItem';

const PropertyList = props => (
  <div className="row">
    {props.listData.map((itemData, i) => (
      <PropertyListItem key={['property', i].join('_')} itemData={itemData} />
    ))}
  </div>
);

const itemDataShape = {
  PropertyName: PropTypes.string,
  CivicAddressID: PropTypes.string,
  PIN: PropTypes.date,
};

PropertyList.propTypes = {
  listData: PropTypes.arrayOf(PropTypes.shape(itemDataShape)).isRequired,
};

export default PropertyList;
