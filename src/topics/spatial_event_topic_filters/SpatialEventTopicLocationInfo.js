import React from 'react';

const renderLabel = (spatialType) => {
  switch (spatialType) {
    case 'address':
      return 'of';
    case 'neighborhood':
      return 'in';
    case 'street':
      return 'along';
    default:
      return 'of';
  }
};

const SpatialEventTopicLocationInfo = props => (
  <div className="form-group">
    <label htmlFor="extent" className="col-sm-2 control-label">{renderLabel(props.spatialType)}</label>
    <div className="col-sm-10">
      <span className="form-control-static" style={{ display: 'block' }}>{props.spatialDescription}</span>
    </div>
  </div>
);

SpatialEventTopicLocationInfo.propTypes = {
  spatialType: React.PropTypes.string.isRequired,
  spatialDescription: React.PropTypes.string.isRequired,
};

export default SpatialEventTopicLocationInfo;
