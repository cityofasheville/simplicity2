import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveXYFrame } from 'semiotic';
import { scaleLinear } from 'd3-scale';
import Tooltip from '../../../shared/visualization/Tooltip';


class YearlyPermitVol extends React.Component {
  constructor(props) {
    super(props);

    this.months = [
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
    this.volDataByType = this.volByType(this.props.permitData);
    this.years = Object.keys(this.volDataByType.Total);
    this.radiusFunc = this.getRadiusFunc();

    this.state = {
      hover: null,
      activeTypes: ['Total'],
      activeYears: ['2017', '2018'],
    };
  }

  volByType() {
    const returnData = {};

    this.props.volumeKeys.forEach((volKey, i) => {
      returnData[volKey] = {}
      this.props.permitData.forEach((d) => {
        const splitDate = d['Month & Year'].split(' ');
        const month = splitDate[0];
        const year = d['Month & Year'].split(' ')[1];
        let value = d[`${volKey} Construction Value`].replace(/\D/g, '');
        if (value === '') { value = 0; }

        if (!returnData[volKey][year]) {
          returnData[volKey][year] = [];
        }

        returnData[volKey][year].push({
          volume: d[volKey],
          monthInt: this.months.findIndex(m => m === month),
          value,
          color: this.props.colorScheme[i],
          parentKey: volKey,
          year,
        });
      });
    });

    return returnData;
  }

  maxVolume() {
    return [].concat.apply(
      [],
      [].concat.apply(
        [],
        [].concat.apply([], Object.values(this.volDataByType)).map(d => Object.values(d))
      )
    ).map(d => d.volume)
      .sort((a, b) => b - a)[0];
  }

  getRadiusFunc() {
    const sortedValue = [].concat.apply(
      [],
      [].concat.apply(
        [],
        [].concat.apply([], Object.values(this.volDataByType)).map(d => Object.values(d))
      )
    ).map(d => d.value)
      .sort((a, b) => a - b);

    return scaleLinear()
      .range([3, 20])
      .domain([sortedValue[0], +sortedValue[sortedValue.length - 1]]);
  }

  render() {
    const currentLines = [];

    this.state.activeTypes.forEach((type) => {
      this.state.activeYears.forEach((year) => {
        currentLines.push({
          type,
          year,
          coordinates: this.volDataByType[type][year],
        });
      });
    });

    return (<div style={{ width: '100%', height: '70vh', textAlign: 'center' }}>
      <div className="buttonContainer">
        {this.years.map((year, i) => {
          const activeNow = this.state.activeYears.findIndex(activeYear => activeYear === year) >= 0
          return (<span
            className={`yearButton ${activeNow ? 'active' : 'inactive'}`}
            key={year + i}
            style={{
              backgroundColor: 'gray',
              border: '0.5px solid black'
            }}
            onClick={d => this.setState({
              activeYears: activeNow ? this.state.activeYears.filter(d => d !== year) : this.state.activeYears.concat([year])
            })}
          >
            {year}
          </span>)
        })}
      </div>
      <div className="buttonContainer">
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
        responsiveWidth
        responsiveHeight
        margin={{
          top: 10,
          left: 40,
          right: 40,
          bottom: 70,
        }}
        lines={currentLines}
        lineType="line"
        xAccessor={d => d.monthInt}
        yAccessor="volume"
        yExtent={[0, undefined]}
        axes={[
          {
            orient: 'bottom',
            ticks: 12,
            tickFormat: d => this.months[d],
          },
          {
            orient: 'left',
            ticks: 5,
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
          return <circle
            r={this.radiusFunc(d.d.value)}
          />
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
          const title = `${this.months[d.monthInt]} ${d.year} ${d.parentKey}`;
          const textLines = [
            {
              text: `Volume: ${d.volume}`,
            },
            {
              text: `Value: ${d.value}`,
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

export default YearlyPermitVol;
