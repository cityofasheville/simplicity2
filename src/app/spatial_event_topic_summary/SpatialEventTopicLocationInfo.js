import React from 'react';
import PropTypes from 'prop-types';
// import Icon from '../../shared/Icon';
// import { IM_SEARCH } from '../../shared/iconConstants';
import { english } from './english';
import { spanish } from './spanish';
import { withLanguage } from '../../utilities/lang/LanguageContext';

const SpatialEventTopicLocationInfo = (props) => {
  // set language
  let content;
  switch (props.language.language) {
    case 'Spanish':
      content = spanish;
      break;
    default:
      content = english;
  }

  let label;
  switch (props.spatialType) {
    case 'address':
      label = content.of;
      break;
    case 'neighborhood':
      label = content.in;
      break;
    case 'street':
      label = content.along;
      break;
    default:
      label = content.in;
  }

  return (
    <div className={`form-group ${props.columnClasses}`}>
      <label htmlFor="extent" className="control-label">{label}: </label>
      <div className="form-group__field">
        <div className="form-control-static">{props.spatialDescription}
          {/*<span className="pull-right"><a title="Change location"><Icon path={IM_SEARCH} /> Change location</a></span>*/}
        </div>
      </div>
    </div>
  );
}

SpatialEventTopicLocationInfo.propTypes = {
  spatialType: PropTypes.string.isRequired,
  spatialDescription: PropTypes.string.isRequired,
  columnClasses: PropTypes.string
};

SpatialEventTopicLocationInfo.defaultProps = {
  columnClasses: 'col-md-4 col-xs-12'
};

export default withLanguage(SpatialEventTopicLocationInfo);
