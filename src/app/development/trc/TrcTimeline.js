import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveXYFrame } from 'semiotic';
import { data } from './data';
import Tooltip from '../../../shared/visualization/Tooltip';


const dateParser = (stringDate) => {
  const arrDate = stringDate.split('/');
  if (arrDate.length < 2) { return null; }
  if (arrDate[2].length < 4) { arrDate[2] = `20${arrDate[2]}`; }
  return new Date(arrDate[2], arrDate[0], arrDate[1]);
};

class TrcTimeline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: null,
    };
  }

  render() {
    const dateTypes = [
      {
        name: 'Submission Date',
        color: '#cc1100',
      },
      {
        name: 'Initial TRC Meeting Date',
        color: '#ffce00',
      },
      {
        name: 'Initial Meeting Date',
        color: '#e69400',
        //  IS THIS RIGHT???????
      },
      {
        name: 'Revision Meeting Date',
        color: '#009970',
      },
      {
        name: 'Final Meeting Date',
        color: '#55bef6',
      },
    ];

    // const allData = data['2017'].concat(data['2018']).map(e => {
    const allData = data['2017'].map((e) => {
      const rVal = Object.assign({}, e);
      rVal.coordinates = [];
      dateTypes.forEach((type) => {
        if (rVal[type.name]) {
          const date = dateParser(rVal[type.name]);
          if (!date) { return; }
          rVal.coordinates.push({
            date,
            color: type.color,
            eventType: type.name,
            project: rVal['Project Name']
          });
        }
      });
      rVal.coordinates.sort((a, b) => a.date - b.date);
      return rVal;
    }).filter(d => d.coordinates.length > 0);


    const layeredData = assignLayersToEvents(allData);

    function assignLayersToEvents(eventList) {
      let overlaps = true;

      while (overlaps) {
        let currentOverlaps = false;
        eventList.forEach((e, eIndex) => {
          const numOverlaps = countOverlaps(e, eIndex, eventList);
          if (e.layerNum === undefined) {
            e.layerNum = numOverlaps;
          }
          if (numOverlaps !== 0) {
            e.layerNum += 1;
            currentOverlaps = true;
          }
        });
        overlaps = currentOverlaps;
      }
      eventList.forEach(e =>
        e.coordinates.map((coord, i) => { coord.layerNum = e.layerNum; return coord; }));

      return eventList;
    }

    function countOverlaps(d, inputIndex, eventList) {
      return eventList.filter((e, eventIndex) => {
        if (eventIndex === inputIndex) {
          // Return false if you're comparing it to itself
          return false;
        }

        const eBegin = e.coordinates[0].date;
        const dEnd = new Date(d.coordinates[d.coordinates.length - 1].date.getTime());
        // otherwise set month method is destructive
        dEnd.setMonth(dEnd.getMonth() + 4);

        const dBegin = d.coordinates[0].date;
        const eEnd = new Date(e.coordinates[e.coordinates.length - 1].date.getTime());
        eEnd.setMonth(eEnd.getMonth() + 4);

        const eBeginBeforeDEnd = eBegin < dEnd;
        const dBeginBeforeEEnd = dBegin < eEnd;
        const sameLayer = d.layerNum === e.layerNum;

        return eBeginBeforeDEnd && dBeginBeforeEEnd && sameLayer;
      }).length;
    }


    return (<div style={{ textAlign: 'center' }} className="trc-timeline" >
      <ResponsiveXYFrame
        responsiveWidth
        margin={{
          top: 70,
          left: 30,
          right: 30,
          bottom: 70,
        }}
        lines={layeredData}
        lineType="line"
        xAccessor="date"
        yAccessor="layerNum"
        axes={[
          {
            orient: 'top',
            tickFormat: d => `${new Date(d).toLocaleDateString(
              'en-US',
              { month: 'short', year: '2-digit' },
            )}`,
            ticks: 5,
          },
        ]}
        lineStyle={d => ({
          stroke: 'black',
          strokeWidth: '0.5',
          strokeOpacity: d['Project Name'] === this.state.hover ? '1' : '0.5',
        })}
        showLinePoints
        customPointMark={() => (<circle r={4} />)}
        pointStyle={(d) => {
          const hovered = this.state.hover === d.project;
          return {
            stroke: d.color,
            strokeOpacity: hovered ? 0.75 : 0.25,
            strokeWidth: hovered ? 5 : 0.25,
            fill: d.color,
          };
        }}
        hoverAnnotation
        customHoverBehavior={(d) => {
          this.setState({
            hover: d ? d.project : null,
          });
        }}
        tooltipContent={(d) => {
          const datum = d.data ? d.data : d;
          const title = datum.project;
          const textLines = [{
            text: `${datum.eventType}: ${datum.date.toLocaleDateString()}`,
          }];
          return (<Tooltip
            title={title}
            textLines={textLines}
          />);
        }}
      />
    </div>);
  }
}

export default TrcTimeline;
