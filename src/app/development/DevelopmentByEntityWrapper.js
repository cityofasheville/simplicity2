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
// extentOptions.unshift({value: '0', display: 'at this location'});

function DevelopmentByEntityWrapper(props) {

  // let currentUrlParams = new URLSearchParams(window.location.search);
  const referringUrl = new URL(document.referrer || window.location.origin + window.location.pathname + window.location.search + window.location.hash);

  // const [referringUrl, setReferringUrl] = useState(null);
  // const [timeSpan, setTimeSpan] = useState({
  //   nearby: [
  //     timeWeek.offset(timeDay.floor(new Date()), -24).getTime(),
  //     timeDay.floor(new Date()).getTime()
  //   ],
  //   at: [
  //     timeDay.floor(new Date(Date.UTC(1997, 0, 1))).getTime(),
  //     timeDay.floor(new Date()).getTime()
  //   ]
  // });


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
    // timeDay.floor(new Date(Date.UTC(1997, 0, 1))).getTime(),
    TODAY
  ]);
  const [timeSpanAt, setTimeSpanAt] = useState([
    AT_START_DATE,
    TODAY
  ]);
  const [timeSpanNearby, setTimeSpanNearby] = useState([
    NEARBY_START_DATE,
    TODAY,
  ]);
  const [radius, setRadius] = useState('330');
  const [paramsSettled, setParamsSettled] = useState(false);

  useEffect(() => {
    let currentUrlParams = new URLSearchParams(window.location.search);
    if (currentUrlParams.has('after') && currentUrlParams.has('before')) {
      setTimeSpanAt([
        timeDay.floor(new Date(+currentUrlParams.get('after'))).getTime(),
        timeDay.floor(new Date(+currentUrlParams.get('before'))).getTime()
      ]);
    } else {
      currentUrlParams.set('after', timeSpanAt[0]);
      currentUrlParams.set('before', timeSpanAt[1]);
    }

    // if (currentUrlParams.has('afterAt') && currentUrlParams.has('beforeAt')) {
    //   setTimeSpanAt([
    //     timeDay.floor(new Date(+currentUrlParams.get('afterAt'))).getTime(),
    //     timeDay.floor(new Date(+currentUrlParams.get('beforeAt'))).getTime()
    //   ]);
    // } else {
    //   currentUrlParams.set('afterAt', timeSpanAt[0]);
    //   currentUrlParams.set('beforeAt', timeSpanAt[1]);
    // }

    // if (currentUrlParams.has('afterNearby') && currentUrlParams.has('beforeNearby')) {
    //   setTimeSpanNearby([
    //     timeDay.floor(new Date(+currentUrlParams.get('afterNearby'))).getTime(),
    //     timeDay.floor(new Date(+currentUrlParams.get('beforeNearby'))).getTime()
    //   ]);
    // } else {
    //   currentUrlParams.set('afterNearby', timeSpanNearby[0]);
    //   currentUrlParams.set('beforeNearby', timeSpanNearby[1]);
    // }

    if (currentUrlParams.has('within')) {
      setRadius(currentUrlParams.get('within'));
    } else {
      currentUrlParams.set('within', radius);
    }

    if (history.pushState) {
      let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?${currentUrlParams}`;
      window.history.pushState({path: newurl}, '', newurl);
    }

    setParamsSettled(true);
    // setReferringUrl(new URL(document.referrer))
  }, []);

  function getFormattedExtent() {

    const firstDate = radius === '0' ? AT_START_DATE : timeSpan[0];

    return [
      moment.utc(firstDate).format('YYYY-MM-DD'),
      moment.utc(timeSpan[1]).format('YYYY-MM-DD')
    ];

    // if (radius === '0') {
    //   return [
    //     moment.utc(timeSpanAt[0]).format('YYYY-MM-DD'),
    //     moment.utc(timeSpanAt[1]).format('YYYY-MM-DD')
    //   ];
    // } else {
    //   return [
    //     moment.utc(timeSpanNearby[0]).format('YYYY-MM-DD'),
    //     moment.utc(timeSpanNearby[1]).format('YYYY-MM-DD')
    //   ];  
    // }
  }

  function onRadiusChange(newRadius) {
    console.log('DevelopmentByEntityWrapper onRadiusChange', newRadius);
    // const newTimeSpan = [
    //   newRadius === '0' ? AT_START_DATE : timeSpan[0],
    //   timeSpan[1],
    // ];

    let currentUrlParams = new URLSearchParams(window.location.search);
    currentUrlParams.set('within', newRadius);
    currentUrlParams.set('after', timeSpan[0]);
    currentUrlParams.set('before', timeSpan[1]);

    // if (newRadius === '0') {
    //   currentUrlParams.set('afterAt', timeSpanAt[0]);
    //   currentUrlParams.set('beforeAt', timeSpanAt[1]);
    // } else {
    //   currentUrlParams.set('afterNearby', timeSpanNearby[0]);
    //   currentUrlParams.set('beforeNearby', timeSpanNearby[1]);
    // }

    if (history.pushState) {
      let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?${currentUrlParams}`;
      window.history.pushState({path: newurl}, '', newurl);
    }

    // setTimeSpanAt({...timeSpanAt});
    // setTimeSpanNearby({...timeSpanNearby});
    // setTimeSpan(newTimeSpan);
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
    // let timeSpanSetter;

    currentUrlParams.set('after', newExtent[0]);
    currentUrlParams.set('before', newExtent[1]);
    setTimeSpan(newExtent);
    console.log('DevelopmentByEntityWrapper onDateRangeChange timeSpanAt', newExtent);

    // if (radius === '0') {
    //   currentUrlParams.set('afterAt', newExtent[0]);
    //   currentUrlParams.set('beforeAt', newExtent[1]);
    //   setTimeSpanAt(newExtent);
    //   console.log('DevelopmentByEntityWrapper onDateRangeChange timeSpanAt', newExtent);
    // } else {
    //   currentUrlParams.set('afterNearby', newExtent[0]);
    //   currentUrlParams.set('beforeNearby', newExtent[1]);
    //   setTimeSpanNearby(newExtent);
    //   console.log('DevelopmentByEntityWrapper onDateRangeChange timeSpanNearby', newExtent);
    // }
    // currentUrlParams.set('after', newExtent[0]);
    // currentUrlParams.set('before', newExtent[1]);

    if (history.pushState) {
      let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?${currentUrlParams}`;
      window.history.pushState({path: newurl}, '', newurl);
    }

    // timeSpanSetter(newExtent);
  }

  console.log('DevelopmentByEntityWrapper', timeSpanAt, timeSpanNearby, radius, window.location.search);

  const formattedExtent = getFormattedExtent();

  // const pageSubHeading = radius === '0' ? `At ${props.location.query.label}` : `Within ${extentOptions.find(o => o.value === radius).display} of ${props.location.query.label}`;

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
        {props.location.query.label}{" "}
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

  console.log('QUERY', props.location.query);
  return (
    <div className='container'>
      <PageHeader h1="Development" subheading={pageSubHeading} icon={<Icon path={IM_OFFICE} size={35} />}>
        <ButtonGroup alignment="">
          {props.location.query.search && (
            <Button onClick={() => {
              console.log('DevelopmentByEntityWrapper back button clicked', referringUrl);
              browserHistory.replace(`/?search=${props.location.query.search}`);
              }}
            >
              Back to Search
            </Button>
          )}
          {props.location.query.entity === 'address' && props.location.query.id && (
            <Button onClick={() => {
              console.log('DevelopmentByEntityWrapper back button clicked', referringUrl);
              browserHistory.replace(`/address?id=${props.location.query.id}&search=${props.location.query.search}`);
              }}
            >
              Back to Address
            </Button>
          )}
        </ButtonGroup>
      </PageHeader>

      {props.location.query.entity === 'address' && false && (
        <div className="row">
          <div className="col-xs-12">
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
        </div>
      )}


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
                console.log('DevelopmentByEntityWrapper onBrushEnd', newExtent);
                onDateRangeChange(newExtent);
              }}
              defaultBrushExtent={timeSpan}
              spanLowerLimit={AT_START_DATE}
              // spanLowerLimit={timeDay.floor(new Date(Date.UTC(1997, 0, 1))).getTime()}
              spanUpperLimit={TODAY}
              xSpan={2}
              tickMeasure={'month'}
              maxDaysAllowedToQuery={730}
            /> 
          </div>
        )}

        {/* {props.location.query.entity === 'address' && radius === '0' && (
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
        )} */}
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