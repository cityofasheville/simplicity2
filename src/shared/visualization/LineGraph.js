import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveXYFrame } from 'semiotic';
import { scaleTime } from 'd3-scale';
import HorizontalLegend from './HorizontalLegend';
import Tooltip from './Tooltip';
import { formatDataForStackedArea } from './visUtilities';


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
  const splitDate = stringDate.split('/');
  splitDate[0] = (splitDate[0] - 1).toString();
  if (splitDate[0].length < 2) { splitDate[0] = `0${splitDate[0]}`; }
  return new Date(splitDate[1], splitDate[0]);
};


class LineGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      altText: this.props.altText || this.props.chartTitle,
      showingLongDesc: this.showLongDesc,
    };
  }

  toggleLongDesc() {
    this.setState({
      showingLongDesc: !this.state.showingLongDesc,
    });
  }

  render() {
    const lineColor = '#006ddb';
    const formattedData = formatDataForStackedArea(
      this.props.data,
      this.props.dataKeys,
      this.props.mainAxisDataKey,
      this.props.colorScheme,
    );
    return (
      <div>
        <h4>{this.props.chartTitle}</h4>
        <br />
        <p>
          {this.props.chartText.isArray &&
            this.props.chartText.map((textChunk, index) => (<span key={index}>{textChunk}</span>))
          }
          {!this.props.chartText.isArray &&
            this.props.chartText
          }
        </p>
        <div
          className="row"
          role="img"
          alt={this.state.altText}
          tabIndex={0}
        >
          <div
            className="col-sm-12"
            style={{
              width: '100%',
              display: 'inline-block',
              margin: '0 auto',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                height: this.props.height,
                margin: '0 auto',
                display: 'inline-block',
                width: '95%',
                textAlign: 'center',
              }}
            >
              <ResponsiveXYFrame
                annotations={this.props.annotations}
                responsiveWidth
                lines={formattedData}
                xScaleType={scaleTime()}
                xAccessor={d => {
                  return dateFromSlash(d[this.props.mainAxisDataKey])
                }}
                yAccessor={d => +d.value}
                yExtent={[0, 100]}
                lineStyle={{ stroke: lineColor, strokeWidth: '4px'}}
                margin={{ top: 10, right: 40, bottom: 50, left: 45 }}
                axes={[
                  {
                    orient: 'left',
                    tickFormat: d => `${d}%`,
                    className: 'semiotic-axis',
                  },
                  {
                    orient: 'bottom',
                    ticks: 20,
                    rotate: -45,
                    tickFormat: d => `${d.getMonth() + 1}/${d.getFullYear().toString().replace('20', '')}`,
                    className: 'semiotic-axis',
                  },
                ]}
                pointStyle={{
                  stroke: lineColor,
                  fillOpacity: '0',
                  strokeWidth: '3px',
                }}
                hoverAnnotation={[
                  {
                    type: 'x',
                    color: 'gray',
                    disable: ['connector', 'note'],
                    className: 'semiotic-yHoverLine',
                  },
                  { type: 'frame-hover', className: 'disableFrameHover'},
                  { type: 'vertical-points', r: () => 5},
                ]}
                tooltipContent={(d) => {
                  const textLines = [{
                      text: `${d.label}: ${d.value}%`,
                      color: lineColor,
                    }]

                  const minTooltipWidth = (textLines.map(line => line.text).join('').length + 0.5) / textLines.length;

                  return (<Tooltip
                    textLines={textLines}
                    title={d[this.props.mainAxisDataKey]}
                    style={{
                      backgroundColor: 'white',
                      border: '1px solid black',
                    }}
                  />);
                }}
                svgAnnotationRules={d => {
                  if (d.d.type === 'y' && d.screenCoordinates[0]) {
                    return (<g key={d.d.label}>
                      <text
                        x={d.xyFrameState.adjustedSize[0] + 16}
                        y={d.screenCoordinates[1] + 5}
                        textAnchor="middle"
                        stroke={d.d.color}
                      >
                        {d.d.label}
                      </text>
                      <line
                        stroke={d.d.color}
                        strokeWidth={2}
                        x1={d.xyFrameState.adjustedPosition[0]}
                        x2={d.xyFrameState.adjustedSize[0]}
                        y1={d.screenCoordinates[1]}
                        y2={d.screenCoordinates[1]}
                      />
                    </g>);
                  }
                  return null
                }}
              />
            </div>
          </div>
        </div>
        <br/>
        {!this.props.hideSummary &&
          // TODO: improve keyboard functionality-- a sighted user who relies on the keyboard can't use the button to see the summary very easily
          // see also bar chart (and maybe make this into a component)
          <div className="row">
            <div className="col-xs-10 col-xs-offset-1">
              <br />
              <div className="text-center inText" role="button" tabIndex="0" onClick={() => this.toggleLongDesc()}>
                {this.state.showingLongDesc ? 'Hide' : 'Show'} {this.props.chartTitle} area chart summary
              </div>
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

LineGraph.propTypes = {
  data: PropTypes.array, // eslint-disable-line
  dataKeys: PropTypes.arrayOf(PropTypes.string),
  chartText: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  chartTitle: PropTypes.string,
  hideSummary: PropTypes.bool,
  height: PropTypes.string,
  altText: PropTypes.string,
};

LineGraph.defaultProps = {
  data: [],
  dataKeys: [],
  chartText: '',
  chartTitle: '',
  toolTipFormatter: null,
  hideSummary: false,
  height: '100%',
  altText: 'Chart',
};

export default LineGraph;
