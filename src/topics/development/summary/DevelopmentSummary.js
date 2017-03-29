import React from 'react';
import { Link } from 'react-router';

import SpatialEventTopicSummary from '../../../topics/spatial_event_topic_summary/SpatialEventTopicSummary';

const DevelopmentSummary = props => (
  <div className="col-xs-12">
    <Link to="/topics/development/sla-dashboard">SLA Dashboard</Link>
    <SpatialEventTopicSummary spatialEventTopic="Development" />
  </div>
);

DevelopmentSummary.propTypes = {};

export default DevelopmentSummary;
