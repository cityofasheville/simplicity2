import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveXYFrame } from 'semiotic';
import { scaleLinear } from 'd3-scale';
import Tooltip from '../../../shared/visualization/Tooltip';
import { dollarFormatter } from '../../../shared/visualization/visUtilities';


const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

class YearlyPermitVol extends React.Component {
  constructor(props) {
    super(props);

    this.cleanedData = this.props.permitData.map((d) => {
      const rVal = Object.assign({}, d);
      const splitDate = d['Month & Year'].split(' ');
      rVal.date = new Date(splitDate[1], months.findIndex(m => m === splitDate[0]));
      rVal.monthInt = months.findIndex(m => m === splitDate[0]);
      rVal.year = splitDate[1];
      return rVal;
    });

    this.allDataByType = this.getallDataByType(this.cleanedData);
    this.years = this.cleanedData
      .map(d => d.year)
      .filter((value, index, self) => self.indexOf(value) === index);

    this.radiusFunc = scaleLinear()
      .range([3, 20])
      .domain([0, this.maxVolVal()]);


    const today = new Date();

    this.state = {
      activeTypes: ['Total'],
      brushedData: this.cleanedData,
      brushExtent: [new Date(2017, 0), new Date(today.getFullYear(), today.getMonth() - 1)],
      hover: null,
    };

    // this.brushStart = this.brushStart.bind(this);
    // this.brushDuring = this.brushDuring.bind(this);
    this.brushEnd = this.brushEnd.bind(this);
  }

  getByTypeAndYear(inputData) {
    const returnData = {};
    this.props.volumeKeys.forEach((volKey, i) => {
      returnData[volKey] = {};
      inputData[volKey].forEach((d) => {
        if (!returnData[volKey][d.year]) {
          returnData[volKey][d.year] = [];
        }
        returnData[volKey][d.year].push(d);
      });
    });
    return returnData;
  }

  getallDataByType(inputData) {
    const returnObject = {};
    this.props.volumeKeys.forEach((volKey, i) => {
      returnObject[volKey] = inputData.map((d) => {
        let value = d[`${volKey} Construction Value`].replace(/\D/g, '');
        if (value === '') { value = 0; }
        return {
          color: this.props.colorScheme[i],
          date: d.date,
          month: months[d.monthInt],
          monthInt: d.monthInt,
          parentKey: volKey,
          strValue: dollarFormatter(d.value),
          value,
          year: d.year,
          volume: d[volKey],
        };
      });
    });
    return returnObject;
  }

  maxVolVal(volumeOrValue = 'value') {
    return this.props.volumeKeys.map(key =>
      this.allDataByType[key].map(d => d[volumeOrValue]).reduce((a, b) =>
        Math.max(a, b))).reduce((a, b) => Math.max(a, b));
  }

  // brushStart(e) {
  //   this.setState({
  //     selectedDataCountStart: data.filter(d => d.date >= e[0] && d.date <= e[1])
  //       .length
  //   });
  // }

  // brushDuring(e) {
  //   this.setState({
  //     selectedDataCountDuring: data.filter(
  //       d => d.date >= e[0] && d.date <= e[1]
  //     ).length
  //   });
  // }

  brushEnd(e) {
    this.setState({
      brushExtent: e,
      brushedData: this.cleanedData.filter(d => d.date >= e[0] && d.date <= e[1]),
    });
  }


  render() {
    let currentLines = [];
    const currentLinesBrushable = [];

    const filteredDataByType = this.getallDataByType(this.state.brushedData);
    const byTypeAndYear = this.getByTypeAndYear(filteredDataByType);

    this.state.activeTypes.forEach((type) => {
      currentLinesBrushable.push({
        coordinates: this.allDataByType[type],
      });
      currentLines = currentLines.concat(Object.values(byTypeAndYear[type]).map(d => ({
        type,
        coordinates: d,
      })));
    });

    return (<div style={{ width: '100%', textAlign: 'center' }}>
      <div style={{ margin: '2% 10%' }}>
        {/* TODO: USE CHECKBOXES INSTEAD SO THEY'RE ACCESSIBLE */}
        {this.props.volumeKeys.map((key, i) => {
          const activeNow = this.state.activeTypes.findIndex(type => type === key) >= 0
          return (<div
            style={{
              display: 'inline',
              padding: '0 1%',
            }}
            key={key + i}
            onClick={d => this.setState({
              activeTypes: activeNow ? this.state.activeTypes.filter(d => d !== key) : this.state.activeTypes.concat([key])
            })}
          >
            <svg
              height="15"
              width="15px"
              style={{
                margin: '0 5',
              }}
            >
              <rect
                height="100%"
                width="100%"
                style={{
                  fill: activeNow ? this.props.colorScheme[i] : 'white',
                  stroke: this.props.colorScheme[i],
                  strokeWidth: '3',
                  cursor: 'pointer',
                  fillOpacity: 0.75,
                }}
              ></rect>
            </svg>
            <span
              className={`volKeyButton ${activeNow ? 'active' : 'inactive'}`}
            >
              {key}
            </span>
          </div>);
        })}
      </div>
      <ResponsiveXYFrame
        title="Summary"
        responsiveWidth
        size={[1000, 120]}
        margin={{
          top: 30,
          bottom: 60,
          left: 50,
          right: 40,
        }}
        lines={currentLinesBrushable}
        lineType="line"
        xAccessor="date"
        yAccessor="volume"
        lineStyle={d => ({ stroke: d.coordinates[0].color, strokeWidth: 2 })}
        axes={[
          {
            orient: 'bottom',
            tickFormat: d => new Date(d).getFullYear(),
            tickValues: this.years.map(d => new Date(+d, 0)),
          },
        ]}
        interaction={{
        //   start: this.brushStart,
        //   during: this.brushDuring,
          end: this.brushEnd,
          brush: 'xBrush',
          extent: this.state.brushExtent,
        }}
      />
      <ResponsiveXYFrame
        title="Monthly Comparison"
        responsiveWidth
        size={[1000, 400]}
        margin={{
          top: 40,
          left: 60,
          right: 40,
          bottom: 70,
        }}
        lines={currentLines}
        lineType="line"
        xAccessor={d => d.monthInt}
        yAccessor="volume"
        xExtent={[0, 11]}
        yExtent={[0, undefined]}
        axes={[
          {
            orient: 'bottom',
            ticks: 12,
            tickFormat: d => months[d],
          },
          {
            orient: 'left',
            ticks: 5,
            label: 'Volume',
          },
        ]}
        lineStyle={(d) => {
          const hovered = this.state.hover &&
            d.year === this.state.hover.year &&
            d.type === this.state.hover.parentKey;
          return {
            stroke: d.coordinates[0].color,
            strokeWidth: hovered ? 2.5 : 0.5,
          };
        }}
        showLinePoints
        customPointMark={(d) => {
          return (<circle
            r={this.radiusFunc(d.d.value)}
          />);
        }}
        pointStyle={(d) => {
          const hovered = this.state.hover &&
            d.year === this.state.hover.year &&
            d.monthInt === this.state.hover.monthInt &&
            d.parentKey === this.state.hover.parentKey;
          return {
            stroke: d.color,
            strokeWidth: 2.5,
            strokeOpacity: hovered ? 1 : 0,
            fillOpacity: 0.75,
            fill: d.color,
          };
        }}
        hoverAnnotation
        customHoverBehavior={(d) => {
          if (d) {
            this.setState({
              hover: {
                year: d.year,
                parentKey: d.parentKey,
                monthInt: d.monthInt,
              },
            });
          } else {
            this.setState({
              hover: null,
            });
          }
        }}
        tooltipContent={(d) => {
          // TODO: POSITION THIS SO IT DOESN'T RUN OFF PAGE
          if (!d.color) { return d.data.year; }

          const title = `${months[d.monthInt]} ${d.year} ${d.parentKey}`;
          const textLines = [
            {
              text: `Volume:  ${d.volume}`,
            },
            {
              text: `Value:  ${dollarFormatter(d.value)}`,
            },
          ];

          return (<Tooltip
            title={title}
            textLines={textLines}
          />);
        }}
      />
    </div>);
  }
}

YearlyPermitVol.propTypes = {
  colorScheme: PropTypes.arrayOf(PropTypes.string),
  permitData: PropTypes.arrayOf(PropTypes.object),
  volumeKeys: PropTypes.arrayOf(PropTypes.string),
};

YearlyPermitVol.defaultProps = {
  colorScheme: ['red'],
  permitData: [],
  volumeKeys: [],
};

export default YearlyPermitVol;
