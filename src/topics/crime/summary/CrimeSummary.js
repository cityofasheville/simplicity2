import React from 'react';
import SpatialEventTopicSummary from '../../../topics/spatial_event_topic_summary/SpatialEventTopicSummary';

const CrimeSummary = () => (
  <div className="col-xs-12">
    <SpatialEventTopicSummary spatialEventTopic="Crime" />
  </div>
);

CrimeSummary.propTypes = {};

export default CrimeSummary;
