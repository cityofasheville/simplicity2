import React from 'react';
import PropTypes from 'prop-types';
import { color } from 'd3-color';
import { ResponsiveOrdinalFrame } from 'semiotic';
import HorizontalLegend from './HorizontalLegend';
import Tooltip from './Tooltip';
import { formatDataForStackedBar, budgetBarAnnotationRule } from './visUtilities';


/*
 * TODOS
 * size margins based on where labels are even going (y or x), how long they are, remsize
 */

const getLongDesc = (data, dataKeys, mainAxisKey, valueFormatter) => (
  <div>
    {data.map((value, index) => (
      <div key={[value[mainAxisKey], index].join('_')}>
        <p>{value[mainAxisKey]}<br />
          {dataKeys.map(key => (
            <span key={[value[mainAxisKey], key].join('_')}>
              {key || '[data error]'}: {valueFormatter !== null ? valueFormatter(value[key]) : value[key]}
              <br />
            </span>
          ))}
        </p>
      </div>
    ))}
  </div>
);

class BarChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      altText: this.props.altText || this.props.chartTitle,
      showingLongDesc: this.showLongDesc,
    };

    this.toggleLongDesc = this.toggleLongDesc.bind(this);
  }

  toggleLongDesc(event) {
    if (event.key === 'Enter' || event.type === 'click') {
      this.setState({
        showingLongDesc: !this.state.showingLongDesc,
      });
    }
  }

  render() {
    const formattedData = formatDataForStackedBar(
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
              <ResponsiveOrdinalFrame
                size={[500, 500]}
                responsiveWidth
                annotations={this.props.annotations}
                data={formattedData}
                hoverAnnotation
                margin={{
                  top: 10,
                  right: 40,
                  bottom: 50,
                  left: 60,
                }}
                oAccessor={this.props.mainAxisDataKey}
                oLabel={(d) => {
                  let textAnchor = 'middle';
                  let transform = 'translate(0,0)';
                  if (this.props.rotateXLabels && this.props.layout === 'vertical') {
                    textAnchor = 'end';
                    transform = 'translate(8,0)';
                  } else if (this.props.layout === 'horizontal') {
                    textAnchor = 'end';
                  }

                  if (this.props.rotateXLabels) { transform += 'rotate(-45)' }

                  return (
                    <text
                      textAnchor={textAnchor}
                      transform={transform}
                    >
                      {this.props.xAxisTickFormatter(d)}
                    </text>
                  );
                }}
                oPadding={10}
                projection={this.props.layout}
                rAccessor="value"
                rExtent={this.props.domain}
                type="bar"
                axis={[{
                  orient: 'left',
                  tickFormat: d => this.props.yAxisTickFormatter(d),
                  ticks: 8,
                }]}
                style={d => (
                  this.state.hover === d[this.props.mainAxisDataKey] ?
                  // For the currently hovered bar, return a brighter fill and add a stroke
                    {
                      fill: color(d.color).brighter(0.6).toString(),
                      stroke: color(d.color).toString(),
                      strokeWidth: 3,
                    } :
                    { fill: d.color })
                }
                tooltipContent={(d) => {
                  const dPieces = d.pieces || [d.data]
                  const tooltipTitle = d.column ? d.column.name : d.data[this.props.mainAxisDataKey]
                  const textLines = dPieces.map(piece =>
                    ({
                      text: `${piece.label}: ${this.props.tooltipYValFormatter(piece.value)}`,
                      color: piece.color,
                    })
                  );
                  if (this.props.layout !== 'horizontal') { textLines.reverse(); }
                  return (<Tooltip
                    textLines={textLines}
                    title={tooltipTitle}
                  />);
                }}
                svgAnnotationRules={(d) => {
                  if (d.d.budgetAnnotation === true) {
                    // todo: separate this out?
                    return budgetBarAnnotationRule(d, this.props.layout);
                  }
                  if (d.d.type === 'line' && d.screenCoordinates[0]) {
                    return (
                      <g key={d.d.label}>
                        <text
                          x={d.screenCoordinates[0]}
                          y={-5}
                          textAnchor="middle"
                        >
                          {d.d.label}
                        </text>
                        <line
                          stroke="black"
                          strokeWidth={3}
                          x1={d.screenCoordinates[0]}
                          x2={d.screenCoordinates[0]}
                          y1={0}
                          y2={d.adjustedSize[1]}
                        />
                      </g>
                    );
                  }
                  return null;
                }}
                customHoverBehavior={(d) => {
                  d && d.pieces ?
                    this.setState({ hover: d.pieces[0].data[this.props.mainAxisDataKey] }) :
                    this.setState({ hover: null });
                }}
              />
              <HorizontalLegend
                formattedData={formattedData}
                legendLabelFormatter={this.props.legendLabelFormatter}
              />
            </div>
          </div>
        </div>
        {!this.props.hideSummary &&
          // TODO: improve keyboard functionality-- a sighted user who relies on the keyboard can't use the button to see the summary very easily
          // see also area chart (and maybe make this into a component)
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
                {this.state.showingLongDesc ? 'Hide' : 'Show'} {this.props.chartTitle} bar chart summary
              </div>
              <div hidden={!this.state.showingLongDesc}>
                {getLongDesc(this.props.data, this.props.dataKeys, this.props.mainAxisDataKey, this.props.tooltipYValFormatter)}
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

BarChart.propTypes = {
  altText: PropTypes.string,
  annotations: PropTypes.arrayOf(PropTypes.object),
  chartText: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  chartTitle: PropTypes.string,
  colorScheme: PropTypes.string,
  data: PropTypes.array, // eslint-disable-line
  dataKeys: PropTypes.arrayOf(PropTypes.string),
  domain: PropTypes.arrayOf(PropTypes.number),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  hideSummary: PropTypes.bool,
  layout: PropTypes.string,
  legendLabelFormatter: PropTypes.func,
  mainAxisDataKey: PropTypes.string,
  rotateXLabels: PropTypes.bool,
  tooltipYValFormatter: PropTypes.func,
  xAxisLabel: PropTypes.string,
  xAxisTickFormatter: PropTypes.func,
  yAxisTickFormatter: PropTypes.func,
};

BarChart.defaultProps = {
  altText: null,
  annotations: [],
  chartText: '',
  chartTitle: '',
  colorScheme: 'new_bright_colors',
  data: [],
  dataKeys: [],
  domain: [],
  height: '100%',
  hideSummary: false,
  layout: 'vertical',
  legendLabelFormatter: val => val,
  mainAxisDataKey: null,
  rotateXLabels: false,
  tooltipYValFormatter: val => val,
  xAxisLabel: null,
  xAxisTickFormatter: val => val,
  yAxisTickFormatter: val => val,
};

export default BarChart;
