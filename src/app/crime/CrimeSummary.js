import React from 'react';
import { browserHistory } from 'react-router';
import moment from 'moment';
import ButtonGroup from '../../shared/ButtonGroup';
import Button from '../../shared/Button';
import CrimesByAddress from './CrimesByAddress';
import CrimesByStreet from './CrimesByStreet';
import CrimesByNeighborhood from './CrimesByNeighborhood';
import Icon from '../../shared/Icon';
import styles from '../spatial_event_topic_summary/spatialEventTopicFilters.css';
import SpatialEventTopicLocationInfo from '../spatial_event_topic_summary/SpatialEventTopicLocationInfo';
import { IM_SHIELD3, IM_LIBRARY2 } from '../../shared/iconConstants';
import { refreshLocation, extentOptions } from '../../utilities/generalUtilities';

const timeOptions = [
  { display: 'the last 30 days', value: '30' },
  { display: 'the last 6 months', value: '183' },
  { display: 'the last year', value: '365' },
  { display: 'the last 5 years', value: '1825' },
  { display: 'all time', value: 'all' },
];

const CrimeSummary = (props) => {
  const getNewUrlParams = () => (
    {
      within: document.getElementById('extent').value,
      during: document.getElementById('time').value,
    }
  );

  const duringURL = (props.location.query.during === '' || props.location.query.during === undefined) ? '183' : props.location.query.during;
  const withinURL = (props.location.query.within === '' || props.location.query.within === undefined) ? '660' : props.location.query.within;

  const before = moment.utc().format('YYYY-MM-DD');
  let after = '1970-01-01'; // appears crime only goes back to 2013
  if (duringURL !== 'all') {
    after = moment.utc().subtract((parseInt(duringURL, 10) + 1), 'd').format('YYYY-MM-DD');
  }

  return (
    <div>
      <div className="row">
        <div className="col-sm-12">
          <h1>
            <span style={{ marginRight: '5px' }}>{<Icon path={IM_SHIELD3} size={35} />}</span>
            <span style={{ marginRight: '25px' }}>Crime</span>
            <a href="https://apdp2c.buncombecounty.org/" target="_blank"><button className="btn btn-xs btn-info">{<Icon path={IM_LIBRARY2} size={16} />}<span style={{ marginLeft: '4px' }}>View APD reports</span></button></a>
            <ButtonGroup>
              <Button onClick={browserHistory.goBack}>Back</Button>
            </ButtonGroup>
          </h1>
        </div>
      </div>
      <form className="row form-horizontal">
        <div className="col-xs-12">
          <fieldset className={styles.filtersDiv}>
            {/*<SpatialEventTopicCategoryFilters spatialEventTopic={props.spatialEventTopic} />*/}
            <div className="form-group">
              <label htmlFor="topicType" className="col-sm-2 control-label">view</label>
              <div className="col-sm-10">
                <div className="form-control-static" style={{ display: 'block' }}>crimes
                </div>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="time" className="col-sm-2 control-label">during</label>
              <div className="col-sm-10">
                <select value={duringURL} onChange={() => refreshLocation(getNewUrlParams(), props.location)} name="time" id="time" className="form-control" defaultValue={183}>
                  {timeOptions.map((option, i) => (
                    <option value={option.value} key={['time', 'option', i].join('_')} name="time">{option.display}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group" hidden={props.location.query.entity === 'street' || props.location.query.entity === 'neighborhood'}>
              <label htmlFor="time" className="col-sm-2 control-label">within</label>
              <div className="col-sm-10">
                <select value={withinURL} onChange={() => refreshLocation(getNewUrlParams(), props.location)} name="extent" id="extent" className="form-control" defaultValue={660}>
                  {extentOptions.map((option, i) => (
                    <option value={option.value} key={['extent', 'option', i].join('_')} name="extent">{option.display}</option>
                  ))}
                </select>
              </div>
            </div>
            <SpatialEventTopicLocationInfo spatialType={props.location.query.entity} spatialDescription={props.location.query.label} />
          </fieldset>
        </div>
      </form>
      {props.location.query.entity === 'address' ?
        <CrimesByAddress before={before} after={after} radius={withinURL} location={props.location} />
        :
        props.location.query.entity === 'street' ?
          <CrimesByStreet before={before} after={after} radius={110} location={props.location} />
          :
          <CrimesByNeighborhood before={before} after={after} location={props.location} />
      }
    </div>
  );
};

export default CrimeSummary;
