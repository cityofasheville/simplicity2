import React from 'react';
import PropTypes from 'prop-types';
import { nest } from 'd3-collection';
import { csvParse } from 'd3-dsv';
import csvData from './surveyData';

const parsedData = csvParse(csvData);

const locationCoordsItems = parsedData.filter(d => {
  return d['Belongs to'].length > 0;
}).map(d => ({
  lat: d['Latitude'],
  lon: d['Longitude'],
  surveyId: d['Belongs to'],
  tileType: d['Placetype Title'],
}))

const responses = parsedData.filter(d => {
  return d['Belongs to'].length === 0;
}).map(d => {
  const rObj = {};
  const created = new Date(d['Created At']);
  rObj.dayOfWeek = created.toLocaleDateString('en-US', { weekday: 'long' });
  rObj.hourOfDay = created.toLocaleTimeString('en-US', { hour: '2-digit', hour12: false });
  rObj.displayDate = created.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  //  What kind of info provided
  rObj.nameShowing = d['Signature'] !== 'Name not shown' && d['Signature'].length > 0;
  rObj.registered = d['State'] === 'registered';
  //  Relation to Asheville questions
  rObj.liveInAvl = +d['Please describe your connection to the City of Asheville. Check all boxes that apply. Live in Asheville'] === 1
  rObj.workInAvl = +d['Please describe your connection to the City of Asheville. Check all boxes that apply. Work in Asheville'] === 1
  rObj.schoolInAvl = +d['Please describe your connection to the City of Asheville. Check all boxes that apply. Attend school in Asheville'] === 1
  rObj.workNearAvl = +d['Please describe your connection to the City of Asheville. Check all boxes that apply. Work near Asheville'] === 1
  rObj.schoolNearAvl = +d['Please describe your connection to the City of Asheville. Check all boxes that apply. Attend school near Asheville'] === 1
  //  Location questions
  rObj.pinPlaced = d['Place the pin roughly where you live.'].length > 0;
  rObj.zipProvided = d['If you cannot or do not prefer to participate in the mapping activity above, please select your home zip code:'];
  rObj.mapLocations = locationCoordsItems.filter(coordsItem => {
    return coordsItem.surveyId === d['Place the pin roughly where you live.']
  })
  //  Likert scale questions (5 is most)
  rObj.likertPropertyOwnerOrDev = +d['On a scale of 1 to 5, with 5 being the most interested, tell us what kind of information do you want to know about large-scale building and land development in Asheville. Information about the property owner or developer'];
  rObj.likertLandUse = +d['On a scale of 1 to 5, with 5 being the most interested, tell us what kind of information do you want to know about large-scale building and land development in Asheville. Proposed use of land (e.g. restaurant, storage facility, hotel, etc)'];
  rObj.likertAcreage = +d['On a scale of 1 to 5, with 5 being the most interested, tell us what kind of information do you want to know about large-scale building and land development in Asheville. Area/acreage of land'];
  rObj.likertBldgSize = +d['On a scale of 1 to 5, with 5 being the most interested, tell us what kind of information do you want to know about large-scale building and land development in Asheville. Size of buildings'];
  rObj.likertBldgHeight = +d['On a scale of 1 to 5, with 5 being the most interested, tell us what kind of information do you want to know about large-scale building and land development in Asheville. Height of buildings'];
  rObj.likertBldgLook = +d['On a scale of 1 to 5, with 5 being the most interested, tell us what kind of information do you want to know about large-scale building and land development in Asheville. Look of buildings'];
  rObj.likertParking = +d['On a scale of 1 to 5, with 5 being the most interested, tell us what kind of information do you want to know about large-scale building and land development in Asheville. Parking impacts'];
  rObj.likertTraffic = +d['On a scale of 1 to 5, with 5 being the most interested, tell us what kind of information do you want to know about large-scale building and land development in Asheville. Traffic impacts'];
  rObj.likertTransit = +d['On a scale of 1 to 5, with 5 being the most interested, tell us what kind of information do you want to know about large-scale building and land development in Asheville. Availability of transit to the site']
  //  Preferred means of notification
  rObj.preferEmail = +d['How would you like to be notified about development projects in your neighborhood or other areas in which you may be interested? (check your top 2) Email notification'];
  rObj.preferPostal = +d['How would you like to be notified about development projects in your neighborhood or other areas in which you may be interested? (check your top 2) U.S. Postal Service notification (postcard or letter)'];
  rObj.preferSocialMedia = +d['How would you like to be notified about development projects in your neighborhood or other areas in which you may be interested? (check your top 2) Social media posts'];
  rObj.preferVisitWebsite = +d['How would you like to be notified about development projects in your neighborhood or other areas in which you may be interested? (check your top 2) Visit website'];
  rObj.preferTextNotifications = +d['How would you like to be notified about development projects in your neighborhood or other areas in which you may be interested? (check your top 2) Sign up for mobile text notifications'];
  rObj.preferNewsletter = +d['How would you like to be notified about development projects in your neighborhood or other areas in which you may be interested? (check your top 2) Sign up for newsletter'];
  //  Meeting history
  rObj.beenNotified = d['Have you ever been directly notified of an application for a development within proximity to your home or workplace?'] === 'Yes';
  rObj.attendedMeeting = d['Have you ever attended a meeting about proposed building and land development in Asheville?'] === 'Yes';
  //  Commentary
  rObj.commentary = {
    likertOther: d['Other:'],
    otherThoughts: d['Please share any other thoughts about what kind of information you want to see about proposed development and/or how you want to give your input about proposed development.'],
    whyOrNotAttendMeeting: d['Why or why not? - meeting'],
    otherDeviceUsed: d['What device or devices do you use to look up information about the City of Asheville? (check all that apply) Other'],
    otherConnectionAvl: d['Please describe your connection to the City of Asheville. Check all boxes that apply. Other'],
    otherNotificationPreference: d['How would you like to be notified about development projects in your neighborhood or other areas in which you may be interested? (check your top 2) Other'],
    whyOrNotWebTools: d['Why or why not? - web tools'],
  }
  //  Online tools used currently
  rObj.useToolSimplicity = +d['Have you used any of these City online tools to get information about development? SimpliCity'] === 1;
  rObj.useToolMapAsheville = +d['Have you used any of these City online tools to get information about development? mapAsheville'] === 1;
  rObj.useToolCapImprovementDash = +d['Have you used any of these City online tools to get information about development? Capital Improvement and Bond Projects Dashboard'] === 1;
  rObj.useToolTRCMap = +d['Have you used any of these City online tools to get information about development? Technical Review Committee project map'] === 1;
  rObj.useToolDevPortal = +d['Have you used any of these City online tools to get information about development? Development Portal'] === 1;
  rObj.useToolWillNow = d['Now that you are aware of these online tools, are you likely to use them?'] === 'Yes';
  //  Demographic proxy questions
  rObj.useDeviceComputer = +d['What device or devices do you use to look up information about the City of Asheville? (check all that apply) Computer'] === 1;
  rObj.useDeviceTablet = +d['What device or devices do you use to look up information about the City of Asheville? (check all that apply) Tablet'] === 1;
  rObj.useDevicePhone = +d['What device or devices do you use to look up information about the City of Asheville? (check all that apply) Mobile phone'] === 1;
  rObj.homeInternet = d['Do you have Internet access at home?'] === 'Yes';
  rObj.ownResidence = d['Do you rent or own your residence?'] === 'Own';
  return rObj;
})

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
  'homeInternet',
  'ownResidence',
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

console.log(responseGroups)

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
        }).sort((a, b) => b.countObject[5] > a.countObject[5]),
        toolsUsed: useToolsKeys.map(toolKey => {
          return {
            key: toolKey.replace('useTool', ''),
            count: entry.values.filter(val => val[toolKey] === true).length,
          }
        }),
        // notificationPreferences:
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
          <div className="col-md-4">
            <h3>{`${camelToTitle(groupItem.key)}: ${groupItem.count}`}</h3>

            <h4>Notification Preferences</h4>
            <h4>Development Information Wanted</h4>
            {groupItem.likertPreferences.map(likertItem => (<div key={likertItem.key}>
              <div style={{ width: '100%', display: 'inline-block'}}>
                {`${camelToTitle(likertItem.key)}`}
              </div>
              {[5, 4, 3, 2, 1, 0].map(num => {
                const countNum = likertItem.countObject[num] || 0;
                return (<div key={`${likertItem.key}-${num}`}>
                  <div style={{ width: '30%', display: 'inline-block', margin: '0 0.5em' }}>
                    {`${num}`}
                  </div>
                  {countNum && <div>
                    <div style={{ textAlign: 'right', width: '10%', display: 'inline-block', margin: '0 0.5em' }}>
                      {`${countNum}`}
                    </div>
                    <div style={{ textAlign: 'right', width: '10%', display: 'inline-block', margin: '0 0.5em' }}>
                      {`${Number(countNum / groupItem.count * 100).toFixed(0)}%`}
                    </div>
                  </div>}
                </div>)
              })}

            </div>))}

            <h4>Location</h4>
            {groupItem.locationInfo.map(locationItem => (<div key={locationItem.key}>
              <div style={{ width: '70%', display: 'inline-block'}}>
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
              <div style={{ width: '70%', display: 'inline-block'}}>
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
