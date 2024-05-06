import React, { useState, useEffect } from 'react';
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
import TopicCard from '../../shared/TopicCard';
import TimeSlider from './volume/TimeSlider';
import { timeDay, timeWeek, timeMonth } from 'd3-time';

const NEARBY_START_DATE = timeWeek.offset(timeDay.floor(new Date()), -24).getTime();
const AT_START_DATE = timeDay.floor(new Date(Date.UTC(1997, 0, 1))).getTime();
const TODAY = timeDay.floor(new Date()).getTime();

function DevelopmentByEntityWrapper(props) {

  if (Object.keys(props.location.query).length === 0) {
    props.location.query = {
      during: "30",
      entities: "undefined",
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

  const [extentOptionsWithAt, setExtentOptionsWithAt] = useState([
    {value: '0', display: 'At this location'},
    ...extentOptions
  ]);

  const [timeSpan, setTimeSpan] = useState([
    NEARBY_START_DATE,
    TODAY
  ]);

  const [radius, setRadius] = useState('330');
  const [paramsSettled, setParamsSettled] = useState(false);

  useEffect(() => {
    let currentUrlParams = new URLSearchParams(window.location.search);
    if (currentUrlParams.has('after') && currentUrlParams.has('before')) {
      setTimeSpan([
        timeDay.floor(new Date(+currentUrlParams.get('after'))).getTime(),
        timeDay.floor(new Date(+currentUrlParams.get('before'))).getTime()
      ]);
    } else {
      currentUrlParams.set('after', timeSpan[0]);
      currentUrlParams.set('before', timeSpan[1]);
    }

    if (currentUrlParams.has('within')) {
      setRadius(currentUrlParams.get('within'));
    } else {
      currentUrlParams.set('within', radius);
    }

    let newurl = window.location.pathname + `?${currentUrlParams}`;
    browserHistory.replace(newurl);

    setParamsSettled(true);
  }, []);

  function getFormattedExtent() {

    if (props.location.query.entity === 'address' && radius === '0') {
      return [
        moment.utc(AT_START_DATE).format('YYYY-MM-DD'),
        moment.utc(TODAY).format('YYYY-MM-DD')
      ];
    } else {
      return [
        moment.utc(timeSpan[0]).format('YYYY-MM-DD'),
        moment.utc(timeSpan[1]).format('YYYY-MM-DD')
      ];
    }
  }

  function onRadiusChange(newRadius) {

    let currentUrlParams = new URLSearchParams(window.location.search);
    currentUrlParams.set('within', newRadius);
    currentUrlParams.set('after', timeSpan[0]);
    currentUrlParams.set('before', timeSpan[1]);

    if (newRadius === '0') {
      currentUrlParams.set('view', 'list');
    } else {
      currentUrlParams.set('view', 'map');
    }

    let newurl = window.location.pathname + `?${currentUrlParams}`;
    browserHistory.replace(newurl);

    setRadius(newRadius);
  }

  function onDateRangeChange(newExtent) {
    // NOTE: this method is invoked within TimeSlider, after updated date range input is validated
    let currentUrlParams = new URLSearchParams(window.location.search);

    currentUrlParams.set('after', newExtent[0]);
    currentUrlParams.set('before', newExtent[1]);

    let newurl = window.location.pathname + `?${currentUrlParams}`;
    browserHistory.replace(newurl);

    setTimeSpan(newExtent);
  }

  const formattedExtent = getFormattedExtent();

  let pageSubHeading
  if (props.location.query.entity !== 'address') {
    pageSubHeading = (
      <div className='h4' style={{fontWeight: '300'}}>
        {props.location.query.label} ({props.location.query.entity})
      </div>
    );
  } else if (props.location.query.entity === 'address') {
    pageSubHeading = (
      <div className='h4' style={{fontWeight: '300'}}>
        {props.location.query.label}{" (address) "}
        <select 
          value={radius} 
          onChange={(event) => onRadiusChange(event.target.value)} 
          name="extent" 
          id="extent" 
          className="form-control input-sm"
          style={{width: 'auto', display: 'inline', margin: '0 5px'}}
        >
          {extentOptionsWithAt.map((option, i) => (
            <option value={option.value} key={['extent', 'option', i].join('_')} name="extent">{i !== 0 ? 'Within ' : ''}{option.display}</option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className='container'>
      <PageHeader h1="Development" subheading={pageSubHeading} icon={<Icon path={IM_OFFICE} size={35} />}>
        <ButtonGroup alignment="">
          {props.location.query.search && (
            <Button onClick={() => {
              browserHistory.replace(`/?search=${props.location.query.search}`);
              }}
            >
              Back to Search
            </Button>
          )}
          {props.location.query.entity === 'address' && props.location.query.id && (
            <Button onClick={() => {
              browserHistory.replace(`/address?id=${props.location.query.id}&search=${props.location.query.search}`);
              }}
            >
              Back to Address
            </Button>
          )}
        </ButtonGroup>
      </PageHeader>

      <div className="row">
        {((
          props.location.query.entity === 'address' && radius !== '0'
        ) || (
          props.location.query.entity === 'street' ||
          props.location.query.entity === 'neighborhood'
        )) && (
          <div className="col-xs-12" style={{margin: '1rem 0'}}>
            <TimeSlider
              onBrushEnd={(newExtent) => {
                onDateRangeChange(newExtent);
              }}
              defaultBrushExtent={timeSpan}
              spanLowerLimit={AT_START_DATE}
              spanUpperLimit={TODAY}
              xSpan={2}
              tickMeasure={'month'}
              maxDaysAllowedToQuery={730}
            /> 
          </div>
        )}
      </div>

      {props.location.query.entity === 'address' ?
        (paramsSettled && (
          <DevelopmentByAddress
            after={formattedExtent[0]}
            before={formattedExtent[1]}
            radius={+radius}
            location={props.location}
          />
        ))
        :
        props.location.query.entity === 'street' ?
          (paramsSettled && (
            <DevelopmentByStreet
              after={formattedExtent[0]}
              before={formattedExtent[1]}
              radius={110}
              location={props.location}
            />
          )) 
          :
          (paramsSettled && (
            <DevelopmentByNeighborhood
              after={formattedExtent[0]}
              before={formattedExtent[1]}
              location={props.location}
            />
          ))
      }
      <div className="row aligned-row" style={{padding: '15px 0'}}>
        <div className="col-xs-12 col-md-4" style={{padding: '15px'}}>
          <TopicCard topic="DEVELOPMENT_WEBSITE" lang='' view={null} path='https://ashevillenc.gov/department/development-services/' />
        </div>
        <div className="col-xs-12 col-md-4" style={{padding: '15px'}}>
          <TopicCard topic="DEVELOPMENT_DASHBOARD" lang='' view={null} path='/development/major' />
        </div>
        <div className="col-xs-12 col-md-4" style={{padding: '15px'}}>
          <TopicCard topic="DEVELOPMENT_NOTIFICATION" lang='' view={null} path='https://notifications.ashevillenc.gov/' />
        </div>
      </div>

      <div className="row">
        <div className="col-sm-8">
          <p>
            The map, list, and chart represent all development permit types, of which there are over 40.  Some permit types included are:
          </p>
          <ul>
            <li>Residential</li>
            <li>Commercial</li>
            <li>Fire</li>
            <li>Outdoor vendor</li>
            <li>Stormwater</li>
            <li>Right of way</li>
            <li>Large scale development</li>
            <li>Historical resource development</li>
          </ul>

        </div>
      </div>      
   
    </div>
  );
}

export default DevelopmentByEntityWrapper;