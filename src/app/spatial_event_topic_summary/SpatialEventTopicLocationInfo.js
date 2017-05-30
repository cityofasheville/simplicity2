import React from 'react';
import PropTypes from 'prop-types';

const renderLabel = (spatialType) => {
  switch (spatialType) {
    case 'address':
      return 'of';
    case 'neighborhood':
      return 'in';
    case 'street':
      return 'along';
    default:
      return 'in';
  }
};

const SpatialEventTopicLocationInfo = props => (
  <div className="form-group">
    <label htmlFor="extent" className="col-sm-2 control-label">{renderLabel(props.spatialType)}</label>
    <div className="col-sm-10">
      <div className="form-control-static" style={{ display: 'block' }}>{props.spatialDescription}
        <span className="pull-right"><a title="Change location"><i className="fa fa-search"></i> Change location</a></span>
      </div>
    </div>
  </div>
);

SpatialEventTopicLocationInfo.propTypes = {
  spatialType: PropTypes.string.isRequired,
  spatialDescription: PropTypes.string.isRequired,
};

export default SpatialEventTopicLocationInfo;
