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
        alt={this.props.altText}
      >
        {HorizontalLegend(thisData, d => d, { width: '65%', margin: '0 auto', paddingBottom: '10px' })}
        <div
          className="pie-container"
        >
          <div
            style={{ height: this.props.height, width: this.props.height, margin: '0 auto' }}
          >
            <ResponsiveOrdinalFrame
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
                  text: `${d.column.name}: ${d.pieces[0].magnitude}`,
                  color: d.pieces[0].color,
                }];
                return Tooltip(textLine, '', { fontWeight: 'bolder' });
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
  chartTitle: PropTypes.string,
  data: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  height: PropTypes.number,
  altText: PropTypes.string,
  doughnut: PropTypes.bool,
  colorScheme: PropTypes.string,
  innerRadius: PropTypes.number,
  toolTipFormatter: PropTypes.func,
};

PieChart.defaultProps = {
  data: [],
  height: 400,
  defaultLegend: false,
  altText: 'Pie chart',
  doughnut: false,
  colorScheme: 'bright_colors',
  innerRadius: 0,
  toolTipFormatter: d => d,
};

export default PieChart;
