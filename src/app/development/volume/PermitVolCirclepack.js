import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveNetworkFrame } from 'semiotic';


class PermitVolCirclepack extends React.Component {
  constructor() {
    super();
    this.state = {
      hoverNode: null,
    }
  }
  // TODO: MAKE HOVER BEHAVIOR

  render() {
    return (<ResponsiveNetworkFrame
      responsiveWidth
      size={[200, 200]}
      margin={{
        top: 0,
        right: 0,
        bottom: 10,
        left: 10,
      }}
      edges={this.props.data}
      nodeStyle={(d) => {
        const color = this.props.colorKeys[d.key];
        return {
          stroke: color,
          fill: color,
        };
      }}
      nodeIDAccessor="key"
      hoverAnnotation
      customHoverBehavior={d => {
        if (!d) {
          this.setState({
            hoverNode: null,
          });
          return;
        }
        this.setState({
          hoverNode: d.id,
        });
      }}
      networkType={{
        type: 'circlepack',
        hierarchyChildren: d => d.values,
      }}
      nodeLabels={(d) => {
        if (d.key === 'root' || d.r < 7.5) { return null; }
        return (<text
          key={`${d.key}-${d.value}-${Math.floor(Math.random() * Math.floor(10000))}`}
          style={{ stroke: 'white', fontSize: '0.75em', fontWeight: 'lighter', alignmentBaseline: 'middle' }}
          textAnchor="middle"
        >
          {d.value}
        </text>);
      }}
      tooltipContent={d => d.key === 'root' ? '' : d.key}
    />);
  }
}

// PermitVolCirclepack.propTypes = {
//   data: PropTypes.object,
// };
//
// PermitVolCirclepack.defaultProps = {
//   data: { key: 'root', values: [], },
// };

export default PermitVolCirclepack;
