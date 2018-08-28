import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveNetworkFrame } from 'semiotic';
import Tooltip from '../../../shared/visualization/Tooltip';



class PermitVolCirclepack extends React.Component {
  constructor() {
    super();
    // this.state = {
    //   hoverNode: null,
    // }
  }

  render() {
    return (<ResponsiveNetworkFrame
      responsiveWidth
      size={[200, 200]}
      margin={{
        top: 0,
        right: 0,
        bottom: 10,
        left: 20,
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
      // customHoverBehavior={d => {
      //   if (!d) {
      //     this.setState({
      //       hoverNode: null,
      //     });
      //     return;
      //   }
      //   this.setState({
      //     hoverNode: d.id,
      //   });
      // }}
      networkType={{
        type: 'circlepack',
        // array of data has to be { key: root, children: [...] }
      }}
      nodeLabels={(d) => {
        if (d.key === 'root' || d.r < 7.5) { return null; }
        return (<text
          key={`${d.key}-${d.value}-${Math.floor(Math.random() * Math.floor(10000))}`}
          style={{ stroke: 'white', fontSize: '0.9em', fontWeight: 'light', alignmentBaseline: 'middle' }}
          textAnchor="middle"
        >
          {d.value}
        </text>);
      }}
      tooltipContent={(d) => {
        return d.key === 'root' ? '' : (
          <Tooltip
            title={d.key}
            style={{ color: this.props.colorKeys[d.key] }}
          />
        );
      }}
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
