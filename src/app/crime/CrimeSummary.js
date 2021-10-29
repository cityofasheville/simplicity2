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
import { refreshLocation } from '../../utilities/generalUtilities';
import { english } from './english';
import { spanish } from './spanish';
import { withLanguage } from '../../utilities/lang/LanguageContext';


const CrimeSummary = (props) => {
  // set language
  let content;
  switch (props.language.language) {
    case 'Spanish':
      content = spanish;
      break;
    default:
      content = english;
  }

  const timeOptions = [
    { display: content.last_30_days, value: '30' },
    { display: content.last_6_months, value: '183' },
    { display: content.last_year, value: '365' },
    { display: content.last_5_years, value: '1825' },
    { display: content.all_time, value: 'all' },
  ];
  
  const extentOptions = [
    { display: content.city_block, value: '330' },
    { display: content.couple_blocks, value: '660' },
    { display: content.quarter_mile, value: '1320' },
    { display: content.half_mile, value: '2640' },
    { display: content.mile, value: '5280' },
  ];

  const getNewUrlParams = () => (
    {
      within: document.getElementById('extent').value,
      during: document.getElementById('time').value,
    }
  );

  const duringURL = (props.location.query.during === '' ||
    props.location.query.during === undefined) ?
    '183' : props.location.query.during;
  const withinURL = (props.location.query.within === '' ||
    props.location.query.within === undefined) ?
    '660' : props.location.query.within;

  const before = moment.utc().format('YYYY-MM-DD');
  let after = '1970-01-01'; // appears crime only goes back to 2013
  if (duringURL !== 'all') {
    after = moment.utc().subtract((parseInt(duringURL, 10) + 1), 'd').format('YYYY-MM-DD');
  }

  return (
    <div className="crimes-template">
      <div className="row template-header">
        <div className="col-sm-12 template-header__inner">
          <h1>
            <span className="title__icon">{<Icon path={IM_SHIELD3} size={35} />}</span>
            <span className="title__text">{content.crime}</span>
          </h1>
          <a
            className="data-link"
            href="https://ashevillepd.policetocitizen.com/Home"
            target="_blank"
          >
            <button className="btn btn-xs btn-info">
              {<Icon path={IM_LIBRARY2} size={16} />}
              <span>&nbsp;&nbsp;{content.view_apd_reports}</span>
            </button>
          </a>
          <ButtonGroup>
            <Button onClick={browserHistory.goBack}>{content.back}</Button>
          </ButtonGroup>
        </div>
      </div>
      <form className="form-horizontal data-filters data-filters--crime">
        <fieldset className={styles.filtersDiv + ' data-filters__fieldset'}>
          <div className="data-filters__container">
            <div className="data-filters__inner">
              {/*<SpatialEventTopicCategoryFilters spatialEventTopic={props.spatialEventTopic} />*/}
              <div className="form-group col-md-2 col-sm-6 col-xs-4">
                <label htmlFor="topicType" className="control-label">{content.view}:</label>
                <div>
                  <div
                    className="form-control-static"
                    style={{ display: 'block' }}
                  >{content.crimes.toLowerCase()}
                  </div>
                </div>
              </div>
              <div className="form-group col-md-3 col-sm-6 col-xs-8">
                <label htmlFor="time" className="control-label">{content.during}:</label>
                <div>
                  <select
                    value={duringURL}
                    onChange={() => refreshLocation(getNewUrlParams(), props.location)}
                    name="time"
                    id="time"
                    className="form-control"
                  >
                    {timeOptions.map((option, i) => (
                      <option
                        value={option.value}
                        key={['time', 'option', i].join('_')}
                        name="time"
                      >{option.display}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div
                className="form-group col-md-3 col-sm-6 col-xs-12"
                hidden={props.location.query.entity === 'street' ||
                props.location.query.entity === 'neighborhood'}
              >
                <label htmlFor="time" className="control-label">{content.within}:</label>
                <div>
                  <select
                    value={withinURL}
                    onChange={() => refreshLocation(getNewUrlParams(), props.location)}
                    name="extent"
                    id="extent"
                    className="form-control"
                  >
                    {extentOptions.map((option, i) => (
                      <option
                        value={option.value}
                        key={['extent', 'option', i].join('_')}
                        name="extent"
                      >{option.display}
                      </option>
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
      {props.location.query.entity === 'address' ? // eslint-disable-line
        <CrimesByAddress
          before={before}
          after={after}
          radius={withinURL}
          location={props.location}
        />
        :
        props.location.query.entity === 'street' ?
          <CrimesByStreet
            before={before}
            after={after}
            radius={110}
            location={props.location}
          />
          :
          <CrimesByNeighborhood
            before={before}
            after={after}
            location={props.location}
          />
      }
    </div>
  );
};

export default withLanguage(CrimeSummary);
