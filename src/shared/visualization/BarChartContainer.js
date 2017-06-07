import React from 'react';
import PropTypes from 'prop-types';
import BarChart from '../../shared/visualization/BarChart';

const getLongDesc = data => (
  <div>
    TODO: Create long description
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
            <BarChart data={this.props.data} layout={this.props.layout} mainAxisDataKey={this.props.mainAxisDataKey} legendHeight={this.props.legendHeight} barDataKeys={this.props.dataKeys} stacked={this.props.stacked} colorScheme={this.props.colorScheme} altText={this.props.altText} domain={this.props.domain} barGap={this.props.barGap} />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-10 col-xs-offset-2">
            <br />
            <a href="javascript:void(0);" className="text-center inText" onClick={() => this.toggleLongDesc()}>
              {this.state.showingLongDesc ? 'Hide' : 'Show'} {this.props.chartTitle} bar chart summary
            </a>
            <div hidden={!this.state.showingLongDesc}>
              {getLongDesc(this.props.data)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

BarChartContainer.propTypes = {
  data: PropTypes.array, // eslint-disable-line
  dataKeys: PropTypes.arrayOf(PropTypes.string),
  showLongDesc: PropTypes.bool, // eslint-disable-line
  chartTitle: PropTypes.string,
  layout: PropTypes.string,
  altText: PropTypes.string,
  legendHeight: PropTypes.number,
  domain: PropTypes.array, // eslint-disable-line
  chartText: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  colorScheme: PropTypes.string,
  mainAxisDataKey: PropTypes.string,
  stacked: PropTypes.bool,
  barGap: PropTypes.number,
};

BarChartContainer.defaultProps = {
  data: [],
  dataKeys: [],
  showLongDesc: false,
  layout: 'horizontal',
  altText: 'Bar chart',
  domain: [0, 'auto'],
  chartText: '',
  colorScheme: 'pink_green_diverging',
  stacked: false,
  barGap: 4,
};

export default BarChartContainer;
