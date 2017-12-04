import React from 'react';
import { browserHistory } from 'react-router';
import moment from 'moment';
import PageHeader from '../../shared/PageHeader';
import ButtonGroup from '../../shared/ButtonGroup';
import Button from '../../shared/Button';
import CrimesByAddress from './CrimesByAddress';
import CrimesByStreet from './CrimesByStreet';
import Icon from '../../shared/Icon';
import styles from '../spatial_event_topic_summary/spatialEventTopicFilters.css';
import SpatialEventTopicLocationInfo from '../spatial_event_topic_summary/SpatialEventTopicLocationInfo';
import { IM_SHIELD3 } from '../../shared/iconConstants';

//import SpatialEventTopicCategoryFilters from './SpatialEventTopicCategoryFilters';

const timeOptions = [
  { display: 'the last 30 days', value: '30' },
  { display: 'the last 6 months', value: '183' },
  { display: 'the last year', value: '365' },
  { display: 'the last 5 years', value: '1825' },
  { display: 'the last 10 years', value: '3650' },
  { display: 'all time', value: 'all' },
];

const extentOptions = [
  { display: 'a quarter block (27.5 yards)', value: '83' },
  { display: 'half a block (55 yards)', value: '165' },
  { display: 'a city block (110 yards)', value: '330' },
  { display: 'a couple city blocks (1/8 mile)', value: '660' },
  { display: 'a quarter mile', value: '1320' },
];

const CrimeSummary = (props) => {
  const refreshLocation = () => {
    browserHistory.push([props.location.pathname, '?entity=', props.location.query.entity, '&id=', props.location.query.id, '&label=', props.location.query.label, '&within=', document.getElementById('extent').value, '&during=', document.getElementById('time').value, '&hideNavbar=', props.location.query.hideNavbar, '&view=', props.location.query.view, '&x=', props.location.query.x, '&y=', props.location.query.y].join(''));
  };

  const duringURL = (props.location.query.during === '' || props.location.query.during === undefined) ? '30' : props.location.query.during;
  const withinURL = (props.location.query.within === '' || props.location.query.within === undefined) ? '83' : props.location.query.within;

  const before = moment.utc().format('YYYY-MM-DD');
  let after = '1970-01-01'; // appears crime only goes back to 2013
  if (duringURL !== 'all') {
    after = moment.utc().subtract((parseInt(duringURL, 10) + 1), 'd').format('YYYY-MM-DD');
  }

  return (
    <div>
      <PageHeader h1="Crime" icon={<Icon path={IM_SHIELD3} size={35} />}>
        <ButtonGroup>
          <Button onClick={browserHistory.goBack}>Back</Button>
        </ButtonGroup>
      </PageHeader>
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
                <select value={duringURL} onChange={refreshLocation} name="time" id="time" className="form-control" defaultValue={30}>
                  {timeOptions.map((option, i) => (
                    <option value={option.value} key={['time', 'option', i].join('_')} name="time">{option.display}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group" hidden={props.location.query.entity === 'street'}>
              <label htmlFor="time" className="col-sm-2 control-label">within</label>
              <div className="col-sm-10">
                <select value={withinURL} onChange={refreshLocation} name="extent" id="extent" className="form-control" defaultValue={83}>
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
        <CrimesByStreet before={before} after={after} radius={110} location={props.location} />
      }
    </div>
  );
};

export default CrimeSummary;
