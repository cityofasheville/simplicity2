import React from 'react';
import BarChart from '../../components/BarChart';
import SpatialEventTopicFilters from '../spatial_event_topic_filters/SpatialEventTopicFilters';
import EmailDownload from '../../components/EmailDownload';
import SpatialEventTopicList from '../spatial_event_topic_list/SpatialEventTopicList';

const testData = [
  { name: 'Crimes', 'Aggravated assault': 123, Burglary: 1000, Larceny: 1500, 'Larceny of Motor Vehicle': 2500, Robbery: 100, Vandalism: 4000 },
];

const SpatialEventTopicSummary = props => (
  <div>
    <div className="row">
      <h1 className="col-xs-6">{props.spatialEventTopic}</h1>
      <div className="col-xs-6">
        <EmailDownload />
      </div>
    </div>

    <SpatialEventTopicFilters spatialEventTopic={props.spatialEventTopic} spatialType="address" spatialDescription="123 Main Street" />

    <div className="row">
      <div className="col-xs-12">
        <div className="btn-group pull-right">
          <button className="btn btn-primary">Summary</button>
          <button className="btn btn-primary">List view</button>
          <button className="btn btn-primary">Map view</button>
        </div>
      </div>
    </div>

    <div className="row">
      <div id="summaryView" className="col-xs-12" style={{ height: '400px' }} hidden>
        <BarChart data={testData} chartTitle={[props.spatialEventTopic, 'Summary'].join(' ')} barDataKeys={['Aggravated assault', 'Burglary', 'Larceny', 'Larceny of Motor Vehicle', 'Robbery', 'Vandalism']} xAxisDataKey="name" />
      </div>

      <div id="listView">
        <SpatialEventTopicList spatialEventTopic="Crime" />
      </div>

      <div id="mapView" className="col-xs-12" hidden>
        Map view
      </div>
    </div>
  </div>
);

SpatialEventTopicSummary.propTypes = {
  spatialEventTopic: React.PropTypes.string.isRequired,
};

export default SpatialEventTopicSummary;
