import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import Icon from '../../shared/Icon';
import { IM_MAP5, IM_PARAGRAPH_JUSTIFY3, IM_GOOGLE } from '../../shared/iconConstants';


const PropertyListItem = (props) => {
  const displayItems = {
    'Civic address ID': props.itemData.CivicAddressID,
    'Pin #': props.itemData.PIN,
  };

  return (
    <div className="row">
      <div className="col-xs-12">
        <div className="row">
          <div className="col-sm-12">
            <span>{props.itemData.PropertyName}</span>
          </div>
        </div>
        <div className="row">
          {Object.keys(displayItems).map(key => (
            <div className="col-sm-6" key={key}>
              <label htmlFor={key} className="control-label">{key}:</label>
              <span className="col-sm-4" name={key}> {displayItems[key]}</span>
            </div>
          ))}
        </div>
        <div className="row">
          <div className="col-sm-12">
            <div className="pull-right"><Link style={{ marginLeft: '7px' }} title="See property details" to={{ pathname: '/locations/property', query: { entity: 'property', civicAddressID: props.itemData.CivicAddressID, PIN: props.itemData.PIN } }}><Icon path={IM_PARAGRAPH_JUSTIFY3} size={20} /> Details</Link></div><div className="pull-right"> <a title="View property in map" style={{ marginLeft: '7px' }}><Icon path={IM_MAP5} size={20} /> Map</a></div><div className="pull-right"> <a title="View directions to property in Google maps"><Icon path={IM_GOOGLE} size={20} /> Google map directions</a></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const itemDataShape = {
  PropertyName: PropTypes.string,
  CivicAddressID: PropTypes.string,
  PIN: PropTypes.date,
};

PropertyListItem.propTypes = {
  itemData: PropTypes.shape(itemDataShape).isRequired,
};

export default PropertyListItem;
