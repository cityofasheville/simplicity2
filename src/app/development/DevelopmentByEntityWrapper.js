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

function DevelopmentByEntityWrapper(props) {

  // let currentUrlParams = new URLSearchParams(window.location.search);
  const referringUrl = new URL(document.referrer || window.location.origin + window.location.pathname + window.location.search + window.location.hash);

  // const [referringUrl, setReferringUrl] = useState(null);
  const [timeSpan, setTimeSpan] = useState([
    timeWeek.offset(timeDay.floor(new Date()), -24).getTime(),
    timeDay.floor(new Date()).getTime()
  ]);
  const [radius, setRadius] = useState('330');
  const [paramsSettled, setParamsSettled] = useState(false);

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

  useEffect(() => {
    let currentUrlParams = new URLSearchParams(window.location.search);
    if (currentUrlParams.has('after') && currentUrlParams.has('before')) {
      setTimeSpan([
        timeDay.floor(new Date(currentUrlParams.get('after'))).getTime(),
        timeDay.floor(new Date(currentUrlParams.get('before'))).getTime()
      ]);
    }
    if (currentUrlParams.has('within')) {
      setRadius(currentUrlParams.get('within'));
    }
    setParamsSettled(true);
    // setReferringUrl(new URL(document.referrer))
  }, []);

  function getFormattedExtent() {
    return [
      moment.utc(timeSpan[0]).format('YYYY-MM-DD'),
      moment.utc(timeSpan[1]).format('YYYY-MM-DD')
    ];
  }

  function onRadiusChange(newRadius) {
    console.log('DevelopmentByEntityWrapper onRadiusChange', newRadius);
    let currentUrlParams = new URLSearchParams(window.location.search);
    currentUrlParams.set('within', newRadius);

    if (history.pushState) {
      let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?${currentUrlParams}`;
      window.history.pushState({path: newurl}, '', newurl);
    }

    setRadius(newRadius);
  }

  function onDateRangeChange(newExtent) {
    // NOTE: this method is invoked within TimeSlider, after updated date range input is validated
    console.log(
      'DevelopmentByEntityWrapper onDateRangeChange', 
      newExtent,
      moment.utc(newExtent[0]).format('YYYY-MM-DD'),
      moment.utc(newExtent[1]).format('YYYY-MM-DD')
    );
    // const formattedExtent = [
    //   moment.utc(newExtent[0]).format('YYYY-MM-DD'),
    //   moment.utc(newExtent[1]).format('YYYY-MM-DD')
    // ];
    let currentUrlParams = new URLSearchParams(window.location.search);
    currentUrlParams.set('after', newExtent[0]);
    currentUrlParams.set('before', newExtent[1]);

    if (history.pushState) {
      let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?${currentUrlParams}`;
      window.history.pushState({path: newurl}, '', newurl);
    }

    setTimeSpan(newExtent);
  }

  console.log('DevelopmentByEntityWrapper', timeSpan, radius, props.location.query, referringUrl);

  const formattedExtent = getFormattedExtent();

  return (
    // JSX markup goes here
    <div className='container'>
      <PageHeader h1="Development" h2={props.location.query.label} icon={<Icon path={IM_OFFICE} size={35} />}>
        <ButtonGroup alignment="">
          <Button onClick={() => {
            console.log('DevelopmentByEntityWrapper back button clicked', referringUrl);
            browserHistory.replace(referringUrl.pathname + referringUrl.search + referringUrl.hash);
            }}
          >
            Back
          </Button>
        </ButtonGroup>
      </PageHeader>

      {props.location.query.entity === 'address' && (
        <div className="row">
          <ButtonGroup alignment="left">
            <Button
              onClick={() => {

                onRadiusChange('0');
              }} 
              active={radius === '0'}
              disabled={radius === '0'}
              positionInGroup="left"
              type="primary"
            >
              Development At This Address
            </Button>
            <Button
              onClick={() => onRadiusChange('330')} 
              active={radius !== '0'}
              disabled={radius !== '0'}
              positionInGroup="middle"
              type="primary"
            >
              Development Near This Address
            </Button>
            {radius !== '0' && (
              <select 
                value={radius} 
                onChange={(event) => onRadiusChange(event.target.value)} 
                name="extent" 
                id="extent" 
                className="form-control"
                style={{width: 'auto', marginLeft: '100px'}}
              >
                {extentOptions.map((option, i) => (
                  <option value={option.value} key={['extent', 'option', i].join('_')} name="extent">{option.display}</option>
                ))}
              </select>
            )}
          </ButtonGroup>
        </div>
      )}

      <div className="row" style={{position: 'relative'}}>
        <TimeSlider
          onBrushEnd={(newExtent) => {
            // console.log('DevelopmentByEntityWrapper onBrushEnd', newExtent);
            onDateRangeChange(newExtent);
          }}
          defaultBrushExtent={timeSpan}
          spanUpperLimit={timeDay.floor(new Date()).getTime()}
          spanLowerLimit={timeDay.floor(new Date(Date.UTC(1999, 0, 1))).getTime()}
          xSpan={2}
        /> 
        {props.location.query.entity === 'address' && radius === '0' && (
          <div 
            className="col-xs-12" 
            style={{
              position: 'absolute', 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'start',
              flexDirection: 'column',
              top: '0', 
              left: '0', 
              bottom: '0',
              right: '0',
              backgroundColor: 'rgba(255, 255, 255, 1)',
              zIndex: '1000'
            }}
          >
            <div className='h2'>All permits at this address</div>
            <div className='h3'>January 1, 1997 - {moment.utc().format('MMMM DD, YYYY')}</div>
          </div>
        )}
      </div>


      {props.location.query.entity === 'address' ?
        (paramsSettled && (
          <DevelopmentByAddress
            before={formattedExtent[1]}
            after={formattedExtent[0]}
            radius={+radius}
            location={props.location}
          />
        ))
        :
        props.location.query.entity === 'street' ?
          (paramsSettled && (
            <DevelopmentByStreet
              before={formattedExtent[1]}
              after={formattedExtent[0]}
              radius={110}
              location={props.location}
            />
          )) 
          :
          (paramsSettled && (
            <DevelopmentByNeighborhood
              before={formattedExtent[1]}
              after={formattedExtent[0]}
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