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

class AreaChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      altText: this.props.altText || this.props.chartTitle,
      showingLongDesc: this.showLongDesc,
    };

    this.toggleLongDesc = this.toggleLongDesc.bind(this)
  }

  toggleLongDesc(event) {
    if (event.key === 'Enter' || event.type === 'click') {
      this.setState({
        showingLongDesc: !this.state.showingLongDesc,
      });
    }
  }

  render() {
    const formattedData = formatDataForStackedArea(
      this.props.data,
      this.props.dataKeys,
      this.props.mainAxisDataKey,
      this.props.colorScheme,
    );
    return (
      <div>
        <h4>{this.props.chartTitle}</h4>
        <p>
          {this.props.chartText.isArray &&
            this.props.chartText.map((textChunk, index) => (
              <span key={index}>{textChunk}</span>
            ))
          }
          {!this.props.chartText.isArray &&
            this.props.chartText
          }
        </p>
        <div className="row">
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
              role="img"
              aria-label={this.state.altText}
              tabIndex={0}
            >
              <ResponsiveXYFrame
                /*
                TODO:
                  set dimensions meaningfully and adjust tooltip position accordingly
                  remove logic that only applies to this use case to utils or homelessness folder
                */
                responsiveWidth
                lines={formattedData}
                xScaleType={scaleTime()}
                xAccessor={d => dateFromSlash(d[this.props.mainAxisDataKey])}
                yAccessor={d => +d.value}
                lineType="stackedarea"
                lineStyle={d => ({ fill: d.color })}
                margin={{ top: 10, right: 10, bottom: 60, left: 45 }}
                axes={[
                  {
                    orient: 'left',
                    className: 'semiotic-axis',
                  },
                  {
                    orient: 'bottom',
                    rotate: -45,
                    tickFormat: d =>
                      `${d.getMonth() + 1}/${d.getFullYear().toString().replace('20', '')}`,
                    className: 'semiotic-axis',
                  },
                ]}
                pointStyle={{
                  fill: 'white',
                  stroke: 'white',
                  fillOpacity: '0.25',
                  strokeWidth: '1.5px',
                }}
                hoverAnnotation={[
                  {
                    type: 'x',
                    color: 'gray',
                    disable: ['connector', 'note'],
                    className: 'semiotic-yHoverLine',
                  },
                  { type: 'frame-hover', className: 'disableFrameHover' },
                  { type: 'vertical-points', r: (d) => { d.yMiddle = d.yTop; return 5; } },
                ]}
                tooltipContent={(d) => {
                  if (!d.parentLine) { return; }

                  const datum = d.data;

                  const points = formattedData
                    .map(line => ({
                      label: line.label,
                      color: line.color,
                      data: line.coordinates.find(p => p[this.props.mainAxisDataKey] === datum[this.props.mainAxisDataKey]),
                      dataSum: line.coordinates.reduce((a, c) =>
                        ({ value: a.value + c.value })),
                    }))
                    .sort((a, b) => a.dataSum.value - b.dataSum.value);

                  const textLines = points.map(thisPoint =>
                    ({
                      text: `${thisPoint.label}: ${thisPoint.data.value || 0}`,
                      color: thisPoint.color,
                    })
                  );

                  const minTooltipWidth = (textLines.map(line => line.text).join('').length + 0.5) / textLines.length;

                  return (<Tooltip
                    textLines={textLines}
                    title={datum[this.props.mainAxisDataKey]}
                    style={{
                      position: 'absolute',
                      left: (minTooltipWidth * 16 < 1200 - datum.voronoiX) ?
                        '1.5rem' :
                        `${-minTooltipWidth - 1.5}rem`,
                      top: `${400 * -0.5}px`,
                    }}
                  />);
                }}
              />
              <HorizontalLegend
                formattedData={formattedData.map(d => d.coordinates.map((datum) => {
                  datum.color = d.color;
                  return datum;
                })).reduce((total, curr) => {
                  return total.concat(curr);
                })}
                legendLabelFormatter={this.props.legendLabelFormatter}
              />
            </div>
          </div>
        </div>
        {!this.props.hideSummary &&
          // TODO: improve keyboard functionality-- a sighted user who relies on the keyboard can't use the button to see the summary very easily
          // see also bar chart (and maybe make this into a component)
          <div className="row">
            <div className="col-xs-10 col-xs-offset-1">
              <br />
              <div
                className="text-center inText"
                role="button"
                tabIndex="0"
                onClick={this.toggleLongDesc}
                onKeyUp={this.toggleLongDesc}
              >
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

AreaChart.propTypes = {
  altText: PropTypes.string,
  chartText: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  chartTitle: PropTypes.string,
  colorScheme: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.object),
  dataKeys: PropTypes.arrayOf(PropTypes.string),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  hideSummary: PropTypes.bool,
  mainAxisDataKey: PropTypes.string,
  legendLabelFormatter: PropTypes.func,
  toolTipFormatter: PropTypes.func,
};

AreaChart.defaultProps = {
  altText: null,
  chartText: '',
  chartTitle: '',
  colorScheme: 'new_bright_colors',
  data: [],
  dataKeys: [],
  height: null,
  hideSummary: false,
  mainAxisDataKey: null,
  legendLabelFormatter: d => d,
  toolTipFormatter: null,
};

export default AreaChart;
