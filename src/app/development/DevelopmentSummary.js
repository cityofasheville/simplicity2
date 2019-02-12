import React from 'react';
import { browserHistory } from 'react-router';
import moment from 'moment';
import PageHeader from '../../shared/PageHeader';
import ButtonGroup from '../../shared/ButtonGroup';
import Button from '../../shared/Button';
import MajorDevelopmentDashboard from './trc/MajorDevelopmentDashboard';
import DevelopmentByAddress from './DevelopmentByAddress';
import DevelopmentByStreet from './DevelopmentByStreet';
import DevelopmentByNeighborhood from './DevelopmentByNeighborhood';
import Icon from '../../shared/Icon';
import { IM_OFFICE } from '../../shared/iconConstants';
import styles from '../spatial_event_topic_summary/spatialEventTopicFilters.css';
import SpatialEventTopicLocationInfo from '../spatial_event_topic_summary/SpatialEventTopicLocationInfo';
import { refreshLocation, timeOptions, extentOptions } from '../../utilities/generalUtilities';

const DevelopmentSummary = (props) => {
  if (Object.keys(props.location.query).length === 0) {
    props.location.query = {
      during: "30",
      entities:"undefined",
      entity: "address",
      id: "9688",
      label: "70 COURT PLZ, 28801",
      search: "70 court plaza",
      view: "map",
      within: "5280",
      x: "-82.54841807",
      y: "35.59542839"
    }
  }

  const getNewUrlParams = () => (
    {
      within: document.getElementById('extent').value,
      during: document.getElementById('time').value,
    }
  );

  const duringURL = (props.location.query.during === ''
    || props.location.query.during === undefined) ? '183' : props.location.query.during;
  const withinURL = (props.location.query.within === ''
    || props.location.query.within === undefined) ? '660' : props.location.query.within;

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
                <label htmlFor="topicType" className="control-label">view:</label>
                <div className="">
                  <div className="form-control-static" style={{ display: 'block' }}>development
                  </div>
                </div>
              </div>
              <div className="form-group col-md-3 col-sm-6 col-xs-12">
                <label htmlFor="time" className="control-label">during:</label>
                <div className="">
                  <select value={duringURL} onChange={() => refreshLocation(getNewUrlParams(), props.location)} name="time" id="time" className="form-control">
                    {timeOptions.map((option, i) => (
                      <option value={option.value} key={['time', 'option', i].join('_')} name="time">{option.display}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div
                className="form-group col-md-3 col-sm-6 col-xs-12"
                hidden={props.location.query.entity === 'street' || props.location.query.entity === 'neighborhood'}
              >
                <label htmlFor="time" className="control-label">within:</label>
                <div className="">
                  <select value={withinURL} onChange={() => refreshLocation(getNewUrlParams(), props.location)} name="extent" id="extent" className="form-control">
                    {extentOptions.map((option, i) => (
                      <option value={option.value} key={['extent', 'option', i].join('_')} name="extent">{option.display}</option>
                    ))}
                  </select>
                </div>
              </div>
              <SpatialEventTopicLocationInfo
                columnClasses="col-md-4 col-sm-6 col-xs-12"
                spatialType={props.location.query.entity}
                spatialDescription={props.location.query.label}
              />
            </div>
          </div>
        </fieldset>
      </form>
      {props.location.query.entity === 'address' ?
        <DevelopmentByAddress
          before={before}
          after={after}
          radius={withinURL}
          location={props.location}
        />
        :
        props.location.query.entity === 'street' ?
          <DevelopmentByStreet
            before={before}
            after={after}
            radius={110}
            location={props.location}
          />
          :
          <DevelopmentByNeighborhood
            before={before}
            after={after}
            location={props.location}
          />
      }
      <div class="row">
        <div class="col-sm-2">
        </div>
        <div class="col-sm-8">
          <p>
            The map, list, and chart represent all development permit types, of which there are over 40.  Some permit types included are:
          </p>
          <ul>
            <li>Residential</li>
            <li>Commercial</li>
            <li>Fire</li>
            <li>Sign</li>
            <li>Over the counter</li>
            <li>Outdoor vendor</li>
            <li>Stormwater</li>
            <li>Right of way</li>
            <li>Event/temporary use</li>
            <li>Large scale development</li>
            <li>Historical resource development</li>
          </ul>
          <p>To learn more about permitting in the City of Asheville or apply for a permit, visit <a
            href="https://beta.ashevillenc.gov/department/development-services/"
            target="_blank"
            rel="noopener noreferrer"
            >the Development Services Department website</a>.</p>
        </div>
      </div>
    </div>
  );
};

export default DevelopmentSummary;
