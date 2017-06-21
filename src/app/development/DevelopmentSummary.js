import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import SpatialEventTopicSummary from '../spatial_event_topic_summary/SpatialEventTopicSummary';

const DevelopmentSummary = props => (
  <div className="col-xs-12">
    <Link to="/development/sla-dashboard">SLA Dashboard</Link>
    <SpatialEventTopicSummary spatialEventTopic="Development" {...props} />
  </div>
);

DevelopmentSummary.propTypes = {
  location: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

DevelopmentSummary.defaultProps = {
  location: {
    query: { entity: 'address', label: '123 Main street' },
  },
};

export default DevelopmentSummary;
