import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from './Tooltip'
import { ResponsiveXYFrame } from 'semiotic'
import { line } from "d3-shape"
import { scaleTime } from 'd3-scale'
import { formatDataForStackedArea } from './visUtilities'



const getLongDesc = (data, dataKeys, mainAxisKey, valueFormatter) => (
  <div>
    {data.map((value, index) => (
      <div key={[value[mainAxisKey], index].join('_')}>
        <p>{value[mainAxisKey]}<br />
          {dataKeys.map(key => (
            <span key={[value[mainAxisKey], key].join('_')}>{key}: {valueFormatter !== null ? valueFormatter(value[key]) : value[key]}<br /></span>
          ))}
        </p>
      </div>
    ))}
  </div>
);

const dateFromSlash = (stringDate) => {
  const splitDate = stringDate.split('/')
  splitDate[0] = (splitDate[0] - 1).toString()
  if (splitDate[0].length < 2) {splitDate[0] = `0${splitDate[0]}` }
  return new Date(splitDate[1], splitDate[0])
}

class AreaChartContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showingLongDesc: this.showLongDesc };
  }

  toggleLongDesc() {
    this.setState({
      showingLongDesc: !this.state.showingLongDesc,
    });
  }

  render() {
    const formattedData = formatDataForStackedArea(this.props.data,
      this.props.dataKeys,
      this.props.mainAxisDataKey,
      this.props.colorScheme)
    return (
      <div>
        <h4>{this.props.chartTitle}</h4>
        <p>
          {this.props.chartText.isArray &&
            this.props.chartText.map((textChunk, index) => (<span key={index}>{textChunk}</span>))
          }
          {!this.props.chartText.isArray &&
            this.props.chartText
          }
        </p>
        <div className="row">
          <div className="col-sm-12">
            <div style={{ height: this.props.height }}>
              <ResponsiveXYFrame
                /*
                TODO:
                  set dimensions meaningfully and adjust tooltip position accordingly
                  remove logic that only applies to this use case to utils or homelessness folder
                */
                size={[1200, 450]}
                lines={formattedData}
                xScaleType={scaleTime()}
                xAccessor={d => dateFromSlash(d[this.props.mainAxisDataKey])}
                yAccessor={d => +d.value}
                lineType='stackedarea'
                lineStyle={d => ({fill: d.color})}
                margin={{top:40, right: 40, bottom: 60, left: 40}}
                axes={[
                  {
                    orient: 'left',
                  },
                  {
                    orient: 'bottom',
                    ticks: 20,
                    rotate: -45,
                    tickFormat: d => (d.getMonth() + 1) + "/" + d.getFullYear().toString().replace('20', '')
                  }
                ]}
                pointStyle={{
                    fill: 'white',
                    stroke: 'white',
                    fillOpacity: '0.25',
                    strokeWidth: '1.5px'
                }}
                hoverAnnotation={[
                  { type: 'x', disable: ['connector', 'note']},
                  { type: 'frame-hover', className: 'disableFrameHover' },
                  { type: 'vertical-points', r: d => {d.yMiddle = d.yTop; return 5}}
                ]}
                tooltipContent={(d) => {
                  const points = formattedData
                    .map((point) => {
                      return {
                        label: point.label,
                        color: point.color,
                        data: point.coordinates.find((i) => {
                          // Search the lines for a similar x value for vertical shared tooltip
                          // Can implement a 'close enough' conditional here too (fuzzy equality)
                          return i[this.props.mainAxisDataKey] === d[this.props.mainAxisDataKey];
                        }),
                        dataSum: point.coordinates.reduce((a, c) => {
                          return {value: a.value + c.value}
                        })
                      };
                    })
                    .sort((a, b) => {
                      return a.dataSum.value - b.dataSum.value;
                    });

                  const textLines = points.map(thisPoint =>
                    ({
                      text: `${thisPoint.label}: ${thisPoint.data.value}`,
                      color: thisPoint.color
                    })
                  )

                  const minTooltipWidth = (textLines.map(line => line.text).join('').length + 0.5) / textLines.length

                  return <Tooltip
                    title={d[this.props.mainAxisDataKey]}
                    textLines={textLines}
                    style={{
                      backgroundColor: 'white',
                      border: '1px solid black',
                      position: 'absolute',
                      left: (minTooltipWidth * 16 < 1200 - d.voronoiX) ?
                        '1.5rem' :
                        `${-minTooltipWidth - 1.5}rem`,
                      top: 400 * -0.5 + 'px',
                    }}
                  />
                }}
                />
            </div>
          </div>
        </div>
        {!this.props.hideSummary &&
          <div className="row">
            <div className="col-xs-10 col-xs-offset-2">
              <br />
              <a href="javascript:void(0);" className="text-center inText" onClick={() => this.toggleLongDesc()}>
                {this.state.showingLongDesc ? 'Hide' : 'Show'} {this.props.chartTitle} area chart summary
              </a>
              <div hidden={!this.state.showingLongDesc}>
                {getLongDesc(this.props.data, this.props.dataKeys, this.props.mainAxisDataKey, this.props.toolTipFormatter)}
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

AreaChartContainer.propTypes = {
  chartText: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  chartTitle: PropTypes.string,
  hideSummary: PropTypes.bool,
  toolTipFormatter: PropTypes.func,
};

AreaChartContainer.defaultProps = {
  chartText: '',
  chartTitle: '',
  hideSummary: false,
  toolTipFormatter: null,
};

export default AreaChartContainer;
