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
        return {
          stroke: d.color,
          fill: d.color,
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
        hierarchyChildren: d => d.values,
        hierarchySum: d => d.value,
        // array of data has to be { key: root, values: [...] }
      }}
      // customClickBehavior={(d) => {
      //   this.props.onCircleClick(d.values)
      // }}
      nodeLabels={(d) => {
        if (d.key === 'root' || d.r < 7.5) { return null; }
        return (<text
          key={`${d.key}-${d.value}-${Math.floor(Math.random() * Math.floor(10000))}`}
          style={{ stroke: 'white', fontWeight: 'light', alignmentBaseline: 'middle' }}
          textAnchor="middle"
        >
          {d.value}
        </text>);
      }}
      tooltipContent={(d) => {
        return d.key === 'root' ? '' : (
          <Tooltip
            title={d.key}
            style={{ color: d.color }}
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
