import React from 'react';
import { browserHistory } from 'react-router';
import moment from 'moment';
import PageHeader from '../../shared/PageHeader';
import ButtonGroup from '../../shared/ButtonGroup';
import Button from '../../shared/Button';
import DevelopmentByAddress from './DevelopmentByAddress';
import DevelopmentByStreet from './DevelopmentByStreet';
import DevelopmentByNeighborhood from './DevelopmentByNeighborhood';
import Icon from '../../shared/Icon';
import { IM_OFFICE } from '../../shared/iconConstants';
import styles from '../spatial_event_topic_summary/spatialEventTopicFilters.css';
import SpatialEventTopicLocationInfo from '../spatial_event_topic_summary/SpatialEventTopicLocationInfo';
import { refreshLocation, timeOptions, extentOptions } from '../../utilities/generalUtilities';

const DevelopmentSummary = (props) => {
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
      {/*<Link to="/development/sla-dashboard">Development Services SLA Dashboard</Link>*/}
      <PageHeader h1="Development" icon={<Icon path={IM_OFFICE} size={35} />}>
        <ButtonGroup alignment="">
          <Button onClick={browserHistory.goBack}>Back</Button>
        </ButtonGroup>
      </PageHeader>
      <form className="row form-horizontal data-filters data-filters--development">
        <fieldset className={styles.filtersDiv + ' data-filters__fieldset'}>
          <div className="data-filters__container">
            <div className="data-filters__inner">
              {/*<SpatialEventTopicCategoryFilters spatialEventTopic={props.spatialEventTopic} />*/}
              <div className="form-group col-md-2 col-sm-6 col-xs-12">
                <label htmlFor="topicType" className="control-label">view</label>
                <div className="">
                  <div className="form-control-static" style={{ display: 'block' }}>development
                  </div>
                </div>
              </div>
              <div className="form-group col-md-3 col-sm-6 col-xs-12">
                <label htmlFor="time" className="control-label">during</label>
                <div className="">
                  <select value={duringURL} onChange={() => refreshLocation(getNewUrlParams(), props.location)} name="time" id="time" className="form-control">
                    {timeOptions.map((option, i) => (
                      <option value={option.value} key={['time', 'option', i].join('_')} name="time">{option.display}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group col-md-3 col-sm-6 col-xs-12" hidden={props.location.query.entity === 'street' || props.location.query.entity === 'neighborhood'}>
                <label htmlFor="time" className="control-label">within</label>
                <div className="">
                  <select value={withinURL} onChange={() => refreshLocation(getNewUrlParams(), props.location)} name="extent" id="extent" className="form-control">
                    {extentOptions.map((option, i) => (
                      <option value={option.value} key={['extent', 'option', i].join('_')} name="extent">{option.display}</option>
                    ))}
                  </select>
                </div>
              </div>
              <SpatialEventTopicLocationInfo columnClasses="col-md-4 col-sm-6 col-xs-12" spatialType={props.location.query.entity} spatialDescription={props.location.query.label} />
            </div>
          </div>
        </fieldset>
      </form>
      {props.location.query.entity === 'address' ?
        <DevelopmentByAddress before={before} after={after} radius={withinURL} location={props.location} />
        :
        props.location.query.entity === 'street' ?
          <DevelopmentByStreet before={before} after={after} radius={110} location={props.location} />
          :
          <DevelopmentByNeighborhood before={before} after={after} location={props.location} />
      }
    </div>
  );
};

export default DevelopmentSummary;
