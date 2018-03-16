import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveOrdinalFrame } from 'semiotic';
import { colorSchemes } from './colorSchemes';
import HorizontalLegend from './HorizontalLegend';
import Tooltip from './Tooltip';


class PieChart extends React.Component {
  constructor() {
    super();
    this.state = {
      hover: null,
    };
  }

  render() {
    const thisData = this.props.data.map((d, i) => ({
      label: d.name,
      magnitude: d.value,
      color: colorSchemes[this.props.colorScheme][i % colorSchemes[this.props.colorScheme].length],
    }));

    return (
      <div
        className="ordinal-pie-elements"
        role="img"
        tabIndex={0}
        aria-label={this.props.altText}
      >
        <HorizontalLegend
          formattedData={thisData}
          style={{ width: '65%', margin: '0 auto', paddingBottom: '10px' }}
        />
        <div
          className="pie-container"
        >
          <div
            style={{ height: this.props.height, width: this.props.height, margin: '0 auto' }}
          >
            <ResponsiveOrdinalFrame
              chartTitle={this.props.altText}
              data={thisData}
              dynamicColumnWidth="magnitude"
              hoverAnnotation
              margin={20}
              oAccessor="label"
              projection="radial"
              title={this.props.chartTitle}
              customHoverBehavior={(d) => {
                d && d.pieces ?
                this.setState({ hover: d.pieces[0].data.label }) :
                this.setState({ hover: null });
              }}
              size={[this.props.height - 20, this.props.height - 20]}
              style={d => ({
                position: 'absolute',
                fill: d.color,
                stroke: 'white',
                strokeWidth: 2.5,
                fillOpacity: d.label === this.state.hover ? '1' : '0.95',
              })}
              tooltipContent={(d) => {
                const textLine = [{
                  text: `${d.column.name}: ${this.props.toolTipFormatter(d.pieces[0].magnitude)}`,
                  color: d.pieces[0].color,
                }];
                return (<Tooltip
                  textLines={textLine}
                  style={{
                    fontWeight: 'bolder',
                  }}
                />);
              }}
              type={{
                type: 'bar',
                innerRadius: this.props.doughnut ? 40 : this.props.innerRadius,
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

PieChart.propTypes = {
  altText: PropTypes.string,
  chartTitle: PropTypes.string,
  colorScheme: PropTypes.string,
  data: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  doughnut: PropTypes.bool,
  height: PropTypes.number,
  innerRadius: PropTypes.number,
  toolTipFormatter: PropTypes.func,
};

PieChart.defaultProps = {
  altText: 'Pie chart',
  chartTitle: '',
  colorScheme: 'bright_colors',
  data: [],
  doughnut: false,
  height: 400,
  innerRadius: 0,
  toolTipFormatter: d => d,
};

export default PieChart;
