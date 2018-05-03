import React from 'react';
import PropTypes from 'prop-types';
// import Icon from '../../shared/Icon';
// import { IM_SEARCH } from '../../shared/iconConstants';

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
  <div className="form-group thin">
    <label htmlFor="extent" className="control-label">{renderLabel(props.spatialType)}: </label>
    <div className="form-group__field">
      <div className="form-control-static" style={{ display: 'block' }}>{props.spatialDescription}
        {/*<span className="pull-right"><a title="Change location"><Icon path={IM_SEARCH} /> Change location</a></span>*/}
      </div>
    </div>
  </div>
);

SpatialEventTopicLocationInfo.propTypes = {
  spatialType: PropTypes.string.isRequired,
  spatialDescription: PropTypes.string.isRequired,
};

export default SpatialEventTopicLocationInfo;
