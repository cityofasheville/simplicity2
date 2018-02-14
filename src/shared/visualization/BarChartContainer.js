import React from 'react';
import PropTypes from 'prop-types';
import { OrdinalFrame } from 'semiotic'
import { colorSchemes } from './colorSchemes';


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
    console.log(this.props)
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
              style={d => ({fill: d.color})}
              pieceHoverAnnotation={true}
              // title={this.props.chartTitle}
              tooltipContent={(d) =>
                `${this.props.mainAxisDataKey[0].toUpperCase()+ this.props.mainAxisDataKey.slice(1)}: ${d.data[this.props.mainAxisDataKey]}, ${d.data.label}: ${d.data.value}`
              }
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
              // max margin should be 1/5 of chart size
              //
              // TODO: determine margin by length of longest label and remsize
              margin={{left: 40, right: 100}}
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
                {getLongDesc(this.props.data, this.props.dataKeys, this.props.mainAxisDataKey, this.props.toolTipFormatter)}
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
};

BarChartContainer.defaultProps = {
  data: [],
  dataKeys: [],
  chartText: '',
  chartTitle: '',
  toolTipFormatter: null,
  hideSummary: false,
};

export default BarChartContainer;
