import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveXYFrame } from 'semiotic';
import { data } from './data';


class Timeline extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const xAccessor = (stringDate) => {
      const arrDate = stringDate.split('/');
      if (arrDate.length < 2) { return null; }
      arrDate[2].length < 4 ? arrDate[2] = `20${arrDate[2]}` : null
      return new Date(arrDate[2], arrDate[0], arrDate[1]);
    }

    const dateTypes = [
      {
        name: 'Submission Date',
        color: 'red',
      },
      {
        name: 'Initial TRC Meeting Date',
        color: 'orange',
      },
      {
        name: 'Initial Meeting Date',
        color: 'orange',
        //  IS THIS RIGHT???????
      },
      {
        name: 'Revision Meeting Date',
        color: 'green',
      },
      {
        name: 'Final Meeting Date',
        color: 'blue',
      }
    ]

    const allData = data['2017'].concat(data['2018']).map(e => {
    // const allData = data['2018'].map(e => {
      e.coordinates =[]
      dateTypes.forEach(type => {
        if (e[type.name]) {
          const date = xAccessor(e[type.name])
          if (!date) { return; }
          e.coordinates.push(
            {
              date,
              color: type.color,
              eventType: type.name,
            }
          )
        }
      })
      return e;
    }).filter(d => d.coordinates.length > 0);

    assignLayersToEvents(allData)

    function assignLayersToEvents(eventList) {
      eventList.map(function(e, i) {
        e.numConflicts = overlapIndices(e, i, eventList).length
        e.layerNum = e.numConflicts
        return e
      })

      // eventList.sort((a, b) => b.numConflicts - a.numConflicts)
      let overlaps = true;

      while (overlaps) {
        let currentOverlaps = false;
        eventList.forEach(function (e, eIndex) {
          const theseOverlaps = overlapIndices(e, eIndex, eventList)
          if (theseOverlaps.length !== 0) {
            e.layerNum += 1
            currentOverlaps = true
          }
        })
        overlaps = currentOverlaps;
      }

      eventList.forEach(e => e.coordinates.map((coord) => { coord.layerNum = e.layerNum; }));
    }

    function overlapIndices(d, inputIndex, eventList) {
      return eventList.filter((e, eventIndex) => {
        if (eventIndex === inputIndex) {
          // Return false if you're comparing it to itself
          return false;
        }
        e.index = eventIndex;

        const eBegin = e.coordinates[0].date
        const dEnd = new Date(d.coordinates[d.coordinates.length - 1].date.getTime())
        // otherwise set month method is destructive
        dEnd.setMonth(dEnd.getMonth() + 4)

        const dBegin = d.coordinates[0].date
        const eEnd = new Date(e.coordinates[e.coordinates.length - 1].date.getTime())
        eEnd.setMonth(eEnd.getMonth() + 4)

        const eBeginBeforeDEnd = eBegin < dEnd
        const dBeginBeforeEEnd = dBegin < eEnd
        const sameLayer = d.layerNum === e.layerNum;
        return eBeginBeforeDEnd && dBeginBeforeEEnd && sameLayer
      }).map(e => e.index);
    }


    return (<div style={{ width: '99%', height: '90%', textAlign: 'center' }}>
      <ResponsiveXYFrame
        responsiveWidth
        responsiveHeight
        margin={{ top: 70, left: 30, right: 30, bottom: 70}}
        lines={allData}
        lineType={ 'line' }
        xAccessor="date"
        yAccessor="layerNum"
        axes={[
          {
            orient: 'top',
            rotate: -45,
            tickFormat: d => `${new Date(d).toLocaleDateString('en-US', {month: "short", year: '2-digit'})}`,
            ticks: 5,
          }
        ]}
        lineStyle={{
          stroke: 'black',
          strokeWidth: '1.5'
        }}
        showLinePoints
        customPointMark={(d) => {
          return <circle
            r={4}
          />
        }}
        pointStyle={d => ({
          stroke: d.color,
          strokeWidth: 3,
          fill: 'white',
        })}
        hoverAnnotation
        tooltipContent={d => `${d.parentLine['Project Name']} ${d.eventType}: ${d.date.toLocaleDateString()}`
        }
      />
    </div>);
  }
}

export default Timeline;
