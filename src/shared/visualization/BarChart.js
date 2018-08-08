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

const getLongDesc = (data, dataKeys, mainAxisKey, valueFormatter) => {
  // need to fix this function to be generic and work for any barchart data sent in.
  let formattedData = [];
  if (data.length > 0 && data[0].label === undefined) { // hacky temporary fix so homelessness barcharts still work
    formattedData = data;
  } else {
    for (let item of data) {
      let yearAlreadyPresent = false;
      for (let f of formattedData) {
        if (f.display_year === item.display_year) {
          f[item.label] = item.value;
          yearAlreadyPresent = true;
          break;
        }
      }
      if (!yearAlreadyPresent) {
        formattedData.push({ display_year: item.display_year, [item.label]: item.value });
      }
    }
  }
  return (
    <div>
      {formattedData.map((value, index) => (
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
};

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
    const formattedData = this.props.dataFormatter(
      this.props.data,
      this.props.dataKeys,
      this.props.mainAxisDataKey,
      this.props.colorScheme,
    );

    return (
      <div>
        <div className="visualization-title">{this.props.chartTitle}</div>
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
          aria-label={this.state.altText}
          tabIndex={0}
          className="row visualization-container"
        >
          <div style={{height: 350}}>
            <div style={{height: this.props.height}}>
              <ResponsiveOrdinalFrame
                responsiveWidth
                responsiveHeight
                annotations={this.props.annotations}
                data={formattedData}
                hoverAnnotation
                margin={{
                  top: 10,
                  right: 10,
                  bottom: 45,
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

                  if (this.props.rotateXLabels) { transform += 'rotate(-45)'; }

                  return (
                    <text
                      textAnchor={textAnchor}
                      transform={transform}
                    >
                      {this.props.xAxisTickFormatter(d)}
                    </text>
                  );
                }}
                oPadding={8}
                projection={this.props.layout}
                rAccessor="value"
                rExtent={this.props.domain}
                type="bar"
                axis={[
                  {
                    orient: 'left',
                    tickFormat: d => this.props.yAxisTickFormatter(d),
                    ticks: 8,
                  },
                ]}
                style={d => (
                  this.state.hover === d[this.props.mainAxisDataKey] ?
                  // For the currently hovered bar, return a brighter fill and add a stroke
                    {
                      fill: color(d.color).brighter(0.6).toString(),
                      stroke: color(d.color).toString(),
                      strokeWidth: 2,
                    } :
                    { fill: d.color })
                }
                tooltipContent={(d) => {
                  const dPieces = d.pieces || [d.data];
                  const tooltipTitle = d.column ? d.column.name : d.data[this.props.mainAxisDataKey];
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
                  if (d && d.pieces) {
                    this.setState({ hover: d.pieces[0].data[this.props.mainAxisDataKey] });
                  } else {
                    this.setState({ hover: null });
                  }
                }}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-10 col-xs-offset-1">
            <HorizontalLegend
              formattedData={formattedData}
              legendLabelFormatter={this.props.legendLabelFormatter}
            />
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
  dataFormatter: PropTypes.func,
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
  dataFormatter: formatDataForStackedBar,
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
