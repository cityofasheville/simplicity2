import React from 'react';
import PropTypes from 'prop-types';
import BarChart from '../../shared/visualization/BarChart';

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
            <BarChart barDataKeys={this.props.dataKeys} {...this.props} chartTitle={null} />
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
