import React from 'react';
import PropTypes from 'prop-types';
import Select from '../../shared/Select';
import styles from './spatialEventTopicFilters.css';
import SpatialEventTopicLocationInfo from './SpatialEventTopicLocationInfo';
import SpatialEventTopicCategoryFilters from './SpatialEventTopicCategoryFilters';

const timeOptions = [
  { display: 'the last 30 days', value: '0' },
  { display: 'the last 6 months', value: '1' },
  { display: 'the last year', value: '2' },
  { display: 'the last 5 years', value: '3' },
  { display: 'the last 10 years', value: '4' },
  { display: 'all time', value: '5' },
];

const extentOptions = [
  { display: 'a quarter block (27.5 yards)', value: '0' },
  { display: 'half a block (55 yards)', value: '1' },
  { display: 'a city block (110 yards)', value: '2' },
  { display: 'the last 5 years', value: '3' },
  { display: 'a couple city blocks (1/8 mile)', value: '4' },
  { display: 'a quarter mile', value: '5' },
];

const SpatialEventTopicFilters = props => (
  <div>
    <form className="row form-horizontal">
      <div className="col-xs-12">
        <fieldset className={styles.filtersDiv}>
          <SpatialEventTopicCategoryFilters spatialEventTopic={props.spatialEventTopic} />
          <div className="form-group">
            <label htmlFor="time" className="col-sm-2 control-label">during</label>
            <div className="col-sm-10">
              <Select options={timeOptions} name="time" id="time" value="2" />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="time" className="col-sm-2 control-label">within</label>
            <div className="col-sm-10">
              <Select options={extentOptions} name="extent" id="extent" value="1" />
            </div>
          </div>
          <SpatialEventTopicLocationInfo spatialType={props.spatialType} spatialDescription={props.spatialDescription} />
        </fieldset>
      </div>
    </form>
  </div>
);

SpatialEventTopicFilters.propTypes = {
  spatialEventTopic: PropTypes.string.isRequired,
  spatialType: PropTypes.string.isRequired,
  spatialDescription: PropTypes.string.isRequired,
};

export default SpatialEventTopicFilters;
