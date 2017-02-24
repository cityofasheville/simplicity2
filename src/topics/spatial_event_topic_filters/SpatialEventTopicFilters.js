import React from 'react';
import styles from './spatialEventTopicFilters.css';
import SpatialEventTopicTimeFilter from './SpatialEventTopicTimeFilter';
import SpatialEventTopicExtentFilter from './SpatialEventTopicExtentFilter';
import SpatialEventTopicLocationInfo from './SpatialEventTopicLocationInfo';
import SpatialEventTopicCategoryFilters from './SpatialEventTopicCategoryFilters';

const SpatialEventTopicFilters = props => (
  <div>
    <form className="row form-horizontal">
      <div className="col-xs-12">
        <fieldset className={styles.filtersDiv}>
          <SpatialEventTopicCategoryFilters spatialEventTopic={props.spatialEventTopic} />
          <SpatialEventTopicTimeFilter />
          <SpatialEventTopicExtentFilter spatialType={props.spatialType} />
          <SpatialEventTopicLocationInfo spatialType={props.spatialType} spatialDescription={props.spatialDescription} />
        </fieldset>
      </div>
    </form>
  </div>
);

SpatialEventTopicFilters.propTypes = {
  spatialEventTopic: React.PropTypes.string.isRequired,
  spatialType: React.PropTypes.string.isRequired,
  spatialDescription: React.PropTypes.string.isRequired,
};

export default SpatialEventTopicFilters;
