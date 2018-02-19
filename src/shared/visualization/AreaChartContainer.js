import React from 'react';
import PropTypes from 'prop-types';
import AreaChart from '../../shared/visualization/AreaChart';
import { XYFrame } from 'semiotic'
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
              <XYFrame
                lines={formattedData}
                xScaleType={scaleTime()}
                xAccessor={(d) => {
                  const splitDate = d[this.props.mainAxisDataKey].split('/')
                  return new Date(splitDate[1], splitDate[0])
                }}
                yAccessor={d => +d.value}
                lineType='stackedarea'
                lineStyle={d => ({fill: d.color})}
                axes={[
                  {
                    orient: 'left',
                  },
                  {
                    orient: 'bottom',
                    tickFormat: d => d.getMonth() + "/" + d.getDate()
                  }
                ]}
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
