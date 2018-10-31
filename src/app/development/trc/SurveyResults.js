import React from 'react';
import PropTypes from 'prop-types';
import { nest } from 'd3-collection';
import responses from './surveyData';

const allResponseKeys = Object.keys(responses[0]);

// TODO: REVERSE GEOCODE to get all zip codes
const responseGroups = allResponseKeys.map(key => {
  return {
    key,
    groups: nest().key(d => d[key])
      .entries(responses)
      .sort((a, b) => b.values.length - a.values.length)
      .map(d => {
        const rObj = Object.assign({}, d);
        return rObj;
      })
    ,
  }
})

const likertContentPreferenceKeys = allResponseKeys.filter(d => d.includes('likert'));
const notificationPreferenceKeys = allResponseKeys.filter(d => d.includes('prefer'));
const useToolsKeys = allResponseKeys.filter(d => d.includes('useTool'));
const useDevicesKeys = allResponseKeys.filter(d => d.includes('useDevice'));

const qualitativeKeys = [
  'commentary',
  'mapLocations',
]

const demographicProxyKeys = [
  'ownResidence',
  'homeInternet',
  'zipProvided',
  'dayOfWeek',
]

const otherKeys = [
  'displayDate',
  'nameShowing',
  'registered',
  'pinPlaced',
  'beenNotified',
  'attendedMeeting',
  'hourOfDay',
]

const locationBooleanKeys = [
  'liveInAvl',
  'workInAvl',
  'schoolInAvl',
  'workNearAvl',
  'schoolNearAvl',
]

const byDemoProxy = demographicProxyKeys.map(key => {
  return {
    key,
    data: nest().key(d => d[key])
    .entries(responses)
    .sort((a, b) => b.values.length - a.values.length)
    .map(entry => {
      return {
        key: entry.key,
        count: entry.values.length,
        likertPreferences: likertContentPreferenceKeys.map(likertKey => {
          return {
            key: likertKey.replace('likert', ''),
            countObject: nest()
              .key(d => d[likertKey])
              .rollup(d => d.length)
              .object(entry.values)
          }
        }),
        toolsUsed: useToolsKeys.map(toolKey => {
          return {
            key: toolKey.replace('useTool', ''),
            count: entry.values.filter(val => val[toolKey] === true).length,
          }
        }),
        notificationPreferences: notificationPreferenceKeys.map(preferenceKey => {
          return {
            key: preferenceKey.replace('prefer', ''),
            count: entry.values.filter(val => val[preferenceKey] === true).length,
          }
        }),
        // devicesUsed:
        // otherDemoProxies:
        locationInfo: locationBooleanKeys.map(locationKey => {
          return {
            key: locationKey,
            count: entry.values.filter(val => val[locationKey] === true).length,
          }
        }),
        commentary: entry.values.map(value => value.commentary),
        locations: entry.values.map(value => value.mapLocations),
      }
    })
  }
})

const camelToTitle = (camelCase) => camelCase
  .replace(/([A-Z])/g, (match) => ` ${match}`)
  .replace(/^./, (match) => match.toUpperCase());

console.log(byDemoProxy)

const SurveyResults = () => (
  <div style={{ display: "flex", flexWrap: "wrap"}}>
    <h1>TRC Survey Results</h1>
    {byDemoProxy.map(demoProxyGroup => (<div style={{ width: '100%' }} key={demoProxyGroup.key}>

      <h2>{camelToTitle(demoProxyGroup.key)}</h2>

      {demoProxyGroup.data.map(groupItem => {
        return (<div key={groupItem.key}>
          <div className="col-md-3">
            <h3>{`${camelToTitle(groupItem.key)}: ${groupItem.count}`}</h3>

            <h4>Notification Preferences</h4>
            {groupItem.notificationPreferences.map(preferenceItem => (<div key={preferenceItem.key}>
              <div style={{ width: '60%', display: 'inline-block'}}>
                {`${camelToTitle(preferenceItem.key)}`}
              </div>
              <div style={{ textAlign: 'right', width: '10%', display: 'inline-block', margin: '0 0.5em' }}>
                {`${preferenceItem.count}`}
              </div>
              <div style={{ textAlign: 'right', width: '10%', display: 'inline-block', margin: '0 0.5em' }}>
                {`${Number(preferenceItem.count / groupItem.count * 100).toFixed(0)}%`}
              </div>
            </div>))}

            <h4>Development Information Wanted</h4>
            {groupItem.likertPreferences.map(likertItem => (<div key={likertItem.key}>
              <div style={{ width: '100%', display: 'inline-block'}}>
                {`${camelToTitle(likertItem.key)}`}
              </div>

              {[5, 4, 3, 2, 1, 0].map(num => {
                const countNum = likertItem.countObject[num] || 0;
                return (<div key={`${likertItem.key}-${num}`}>
                  <div style={{ width: '30%', display: 'inline-block', margin: '0 0 0 2em' }}>
                    {`${num}:`}
                  </div>
                  <div style={{ width: '10%', textAlign: 'right', display: 'inline-block', margin: '0 0.5em' }}>
                    {`${countNum}`}
                  </div>
                  <div style={{ width: '10%', textAlign: 'right', display: 'inline-block', margin: '0 0.5em' }}>
                    {`${Number(countNum / groupItem.count * 100).toFixed(0)}%`}
                  </div>
                </div>)
              })}
            </div>))}

            <h4>Location</h4>
            {groupItem.locationInfo.map(locationItem => (<div key={locationItem.key}>
              <div style={{ width: '60%', display: 'inline-block'}}>
                {`${camelToTitle(locationItem.key)}`}
              </div>
              <div style={{ textAlign: 'right', width: '10%', display: 'inline-block', margin: '0 0.5em' }}>
                {`${locationItem.count}`}
              </div>
              <div style={{ textAlign: 'right', width: '10%', display: 'inline-block', margin: '0 0.5em' }}>
                {`${Number(locationItem.count / groupItem.count * 100).toFixed(0)}%`}
              </div>
            </div>))}

            <h4>Web Tools</h4>
            {groupItem.toolsUsed.map(toolItem => (<div key={toolItem.key}>
              <div style={{ width: '60%', display: 'inline-block'}}>
                {`${camelToTitle(toolItem.key)}`}
              </div>
              <div style={{ textAlign: 'right', width: '10%', display: 'inline-block', margin: '0 0.5em' }}>
                {`${toolItem.count}`}
              </div>
              <div style={{ textAlign: 'right', width: '10%', display: 'inline-block', margin: '0 0.5em' }}>
                {`${Number(toolItem.count / groupItem.count * 100).toFixed(0)}%`}
              </div>
            </div>))}

          </div>
        </div>)
      })}
     </div>))}
  </div>
);

export default SurveyResults;
