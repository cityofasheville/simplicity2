import React from 'react';
import PropTypes from 'prop-types';
import { XYFrame } from 'semiotic';
import { scaleTime } from 'd3-scale';
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
  }

  toggleLongDesc() {
    this.setState({
      showingLongDesc: !this.state.showingLongDesc,
    });
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
            this.props.chartText.map((textChunk, index) => (<span key={index}>{textChunk}</span>))
          }
          {!this.props.chartText.isArray &&
            this.props.chartText
          }
        </p>
        <div className="row">
          <div className="col-sm-12">
            <div
              style={{ height: this.props.height }}
              role="img"
              aria-label={this.state.altText}
              tabIndex={0}
            >
              <XYFrame
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
                lineType="stackedarea"
                lineStyle={d => ({ fill: d.color })}
                margin={{ top: 40, right: 40, bottom: 60, left: 40 }}
                axes={[
                  {
                    orient: 'left',
                  },
                  {
                    orient: 'bottom',
                    ticks: 20,
                    rotate: -45,
                    tickFormat: d => `${d.getMonth() + 1}/${d.getFullYear().toString().replace('20', '')}`,
                  },
                ]}
                pointStyle={{
                  fill: 'white',
                  stroke: 'white',
                  fillOpacity: '0.25',
                  strokeWidth: '1.5px',
                }}
                hoverAnnotation={[
                  { type: 'x', disable: ['connector', 'note'] },
                  { type: 'frame-hover', className: 'disableFrameHover' },
                  { type: 'vertical-points', r: (d) => { d.yMiddle = d.yTop; return 5; } },
                ]}
                tooltipContent={(d) => {
                  const points = formattedData
                    .map(point => ({
                      label: point.label,
                      color: point.color,
                      data: point.coordinates.find(i => i[this.props.mainAxisDataKey] === d[this.props.mainAxisDataKey]),
                      dataSum: point.coordinates.reduce((a, c) =>
                        ({ value: a.value + c.value })),
                    }))
                    .sort((a, b) => a.dataSum.value - b.dataSum.value);

                  const textLines = points.map(thisPoint =>
                    ({
                      text: `${thisPoint.label}: ${thisPoint.data.value}`,
                      color: thisPoint.color,
                    })
                  );

                  const minTooltipWidth = (textLines.map(line => line.text).join('').length + 0.5) / textLines.length;

                  return Tooltip(textLines, d[this.props.mainAxisDataKey],
                    {
                      backgroundColor: 'white',
                      border: '1px solid black',
                      position: 'absolute',
                      left: (minTooltipWidth * 16 < 1200 - d.voronoiX) ?
                        '1.5rem' :
                        `${-minTooltipWidth - 1.5}rem`,
                      top: `${400 * -0.5}px`,
                    });
                }}
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
  toolTipFormatter: null,
};

export default AreaChart;
