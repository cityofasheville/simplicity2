import React from 'react';
import SpatialEventTopicSummary from '../../topics/spatial_event_topic_summary/SpatialEventTopicSummary';

const Address = () => (
  <div className="col-xs-12">
    <h1>Address</h1>
    <SpatialEventTopicSummary spatialEventTopic="Crime" />
  </div>
);

Address.propTypes = {};

export default Address;
