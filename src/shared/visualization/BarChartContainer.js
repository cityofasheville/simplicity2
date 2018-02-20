import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from './Tooltip'
import { Mark } from "semiotic-mark"
import { OrdinalFrame } from 'semiotic'
import { colorSchemes } from './colorSchemes';
import { color } from 'd3-color'
import { formatDataForStackedBar } from './visUtilities'


/*
 * TODOS
 * legend on bottom-- either wait or make a PR to semiotic
 * write break text function for legend
 * size margins based on where labels are even going (y or x), how long they are, remsize
 */


const getLongDesc = (data, dataKeys, mainAxisKey, valueFormatter) => (
  <div>
    {data.map((value, index) => (
      <div key={[value[mainAxisKey], index].join('_')}>
        <p>{value[mainAxisKey]}<br />
          {dataKeys.map(key => (
            <span key={[value[mainAxisKey], key].join('_')}>
              {key}: {valueFormatter !== null ? valueFormatter(value[key]) : value[key]}
              <br />
            </span>
          ))}
        </p>
      </div>
    ))}
  </div>
);

function reverseDataIfHorizontal(layout, data){
  return layout === 'horizontal' ? data : data.reverse()
}

class BarChartContainer extends React.Component {
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
    const formattedData = formatDataForStackedBar(
      this.props.data,
      this.props.dataKeys,
      this.props.mainAxisDataKey,
      this.props.colorScheme)
    return (
      <div>
        <h4>{this.props.chartTitle}</h4>
        <br/>
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
            <div style={{ height: this.props.height }} alt={this.props.altText}>
              <OrdinalFrame
                annotations={this.props.annotations}
                data={formattedData}
                hoverAnnotation={true}
                margin={{top: 20, right: 100, bottom: 60, left: 60}}
                oAccessor={this.props.mainAxisDataKey}
                oLabel={true}
                oPadding={12.5}
                projection={this.props.layout}
                rAccessor='value'
                rExtent={this.props.domain}
                type='bar'
                axis={(
                  {
                    orient: 'left',
                    tickFormat: d => this.props.yAxisTickFormatter(d),
                    label: !this.props.xAxisLabel ? null : {
                      name: this.props.xAxisLabel,
                      position: { anchor: 'middle' }
                    }
                  }
                )}
                customHoverBehavior={d => { d && d.pieces ?
                  this.setState({hover: d.pieces[0].data[this.props.mainAxisDataKey]}) :
                  this.setState({hover: null})
                }}
                legend={{
                  width: 40,
                  legendGroups: [
                    {
                      styleFn: d => ({fill: d.color}),
                      items: reverseDataIfHorizontal(
                          this.props.layout,
                          formattedData.map(d => ({label: d.label, color: d.color}))
                            .filter((item, pos, thisArray) =>
                              thisArray.findIndex(d => d.label === item.label && d.color === item.color) === pos)
                        )
                    }
                  ]
                }}
                style={d => this.state.hover === d[this.props.mainAxisDataKey] ?
                  // For the currently hovered bar, return a brighter fill and add a stroke
                  {
                    fill: color(d.color).brighter(0.6).toString(),
                    stroke: color(d.color).toString(),
                    strokeWidth: 3,
                  } :
                  {fill: d.color}
                }
                svgAnnotationRules={(d) => {
                      // Don't try to fire when there aren't annotations
                      if (this.props.annotations.length < 1) { return }

                      let returnMarkX = d.screenCoordinates[0] + (this.props.layout === "horizontal" ? 10 : 0)
                      const allAnnotations = d.annotationLayer.annotations
                      const indexOfFirstLabelOccurrence = allAnnotations.findIndex(annotation => annotation.label === d.d.label)
                      const labelMatches = allAnnotations.filter(annotation => annotation.label === d.d.label)

                      if (indexOfFirstLabelOccurrence === d.i && labelMatches.length > 1) {
                        // If it's the first occurence of that label and there's another one, return nothing
                        return
                      } else if (d.i - indexOfFirstLabelOccurrence + 1 === labelMatches.length) {
                        // If two contiguous annotations are the same, average their x value and display one
                        // Offset to left is equal to (distance between two labels / 2) * (labelMatches.length - 1)
                        const categoryVals = Object.values(d.categories)
                        returnMarkX -= ((categoryVals[1].x - categoryVals[0].x) / 2) * (labelMatches.length - 1)
                      }

                      return <Mark
                        markType="text"
                        key={d.d.label + "annotationtext" + d.i}
                        forceUpdate={true}
                        x={returnMarkX}
                        y={d.screenCoordinates[1] + (this.props.layout === "vertical" ? 10 : 0)}
                        y={-15}
                        className={`annotation annotation-or-label ${d.d.className || ""}`}
                        textAnchor="middle"
                      >
                        {d.d.label}
                      </Mark>
                    }
                }
                tooltipContent={(d) => {
                  const textLines = d.pieces.map(piece =>
                    ({
                      text: `${piece.label}: ${this.props.tooltipYValFormatter(piece.value)}`,
                      color: piece.color
                    })
                  )
                  if (this.props.layout !== 'horizontal') { textLines.reverse() }
                  return <Tooltip title={d.column.name} textLines={textLines} />
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
                {this.state.showingLongDesc ? 'Hide' : 'Show'} {this.props.chartTitle} bar chart summary
              </a>
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

BarChartContainer.propTypes = {
  annotations: PropTypes.arrayOf(PropTypes.object),
  data: PropTypes.array, // eslint-disable-line
  dataKeys: PropTypes.arrayOf(PropTypes.string),
  domain: PropTypes.arrayOf(PropTypes.number),
  chartText: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  chartTitle: PropTypes.string,
  hideSummary: PropTypes.bool,
  tooltipYValFormatter: PropTypes.func,
  xAxisLabel: PropTypes.string,
  yAxisTickFormatter: PropTypes.func,
};

BarChartContainer.defaultProps = {
  annotations: [],
  data: [],
  dataKeys: [],
  domain: [],
  chartText: '',
  chartTitle: '',
  hideSummary: false,
  tooltipYValFormatter: val => val,
  xAxisLabel: null,
  yAxisTickFormatter: val => val,
};

export default BarChartContainer;
