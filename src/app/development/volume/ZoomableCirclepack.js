import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveNetworkFrame } from 'semiotic';


class ZoomableCirclepack extends React.Component {
  constructor() {
    super();
    this.state = {
      hoverNode: null,
    }
  }
  // TODO: MAKE HOVER BEHAVIOR
  // REMOVE ALL OF THE SELECTED LEVEL STUFF AND JUST DISCARD ROOT INSTEAD

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
        const selectedLevel = this.props.highlightLevel === d.depth;
        const color = selectedLevel ? this.props.colorKeys[d.key] : null;
        return {
          stroke: color || 'none',
          fill: color || 'none',
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
      tooltipContent={d => {
        const selectedLevel = this.props.highlightLevel === d.depth;
        return selectedLevel ? d.key : '';
      }}
    />);
  }
}

// ZoomableCirclepack.propTypes = {
//   data: PropTypes.object,
// };
//
// ZoomableCirclepack.defaultProps = {
//   data: { key: 'root', values: [], },
// };

export default ZoomableCirclepack;
