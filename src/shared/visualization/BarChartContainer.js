import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from './Tooltip'
import { OrdinalFrame } from 'semiotic'
import { colorSchemes } from './colorSchemes';
import { color } from 'd3-color'


/*
 * TODOS
 * keep nice tooltip formatting with color and such
 * size margins based on where labels are even going (y or x), how long they are, remsize
 * shared tooltip option for budgetsummarybarchart
 * label for actual/adopted/proposed on budget dash (annotations?)
 * legend on bottom-- either wait or make a PR to semiotic
 * ability to format y axis values-- either wait or make a PR to semiotic
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

function formatDataForStacking(data, dataKeys, mainAxisDataKey, colorScheme) {
  return dataKeys.map((k, kIndex) => data.map(function(d) {
    let rVal = {};
    rVal[mainAxisDataKey] = d[mainAxisDataKey]
    rVal.label = k
    rVal.value = d[k] ? d[k] : 0
    const thisScheme = colorSchemes[colorScheme]
    rVal.color = thisScheme[kIndex % thisScheme.length]
    return rVal
  })).reduce((p, c) => p.concat(c))
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
    const formattedData = formatDataForStacking(
      this.props.data,
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
            <OrdinalFrame
              data={formattedData}
              axis={(
                {
                  orient: 'left',
                  tickFormat: d => d,
                  label: {
                    name: 'Count',
                    position: { anchor: 'middle' }
                  }
                }
              )}
              projection={this.props.layout}
              type='bar'
              oLabel={true}
              oAccessor={this.props.mainAxisDataKey}
              oPadding={10}
              rAccessor='value'
              style={d => this.state.hover === d[this.props.mainAxisDataKey] ?
                {fill: color(d.color).brighter().toString(), stroke: color(d.color).darker().toString()} :
                {fill: d.color}
              }
              hoverAnnotation={true}
              tooltipContent={ function(d) {
                const textLines = d.pieces.map(piece =>
                  ({
                    text: `${piece.label}: ${this.props.tooltipYValFormatter(piece.value)}`,
                    color: piece.color
                  })
                )
                return <Tooltip title={d.column.name} textLines={textLines} />
              }.bind(this)}
              legend={{
                width: 40,
                legendGroups: [
                  {
                    styleFn: d => ({fill: d.color}),
                    items: formattedData.map(d => ({label: d.label, color: d.color}))
                      .filter((item, pos, thisArray) => thisArray
                        .findIndex(d => d.label === item.label && d.color === item.color) === pos)
                  }
                ]
              }}
              margin={{left: 40, right: 100, bottom: 40}}
              customHoverBehavior={d => { d && d.pieces ?
                this.setState({hover: d.pieces[0].data[this.props.mainAxisDataKey]}) :
                this.setState({hover: null})
              }
            }
            />
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
  data: PropTypes.array, // eslint-disable-line
  dataKeys: PropTypes.arrayOf(PropTypes.string),
  chartText: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  chartTitle: PropTypes.string,
  hideSummary: PropTypes.bool,
  tooltipYValFormatter: PropTypes.func,
  yAxisTickFormatter: PropTypes.func,
  // pieceOrWholeHover: PropTypes.string
};

BarChartContainer.defaultProps = {
  data: [],
  dataKeys: [],
  chartText: '',
  chartTitle: '',
  hideSummary: false,
  tooltipYValFormatter: val => val,
  yAxisTickFormatter: null,
  // pieceOrWholeHover: 'piece'
};

export default BarChartContainer;
