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

  render() {
    return (<ResponsiveNetworkFrame
      responsiveWidth
      size={[500, 200]}
      edges={this.props.data}
      nodeStyle={d => ({
        stroke: this.state.hoverNode === d.id ? 'darkcyan' : 'gray',
        strokeWidth: this.state.hoverNode === d.id ? 2 : 1,
        fill: this.state.hoverNode === d.id ? 'darkcyan' : 'white',
        fillOpacity: this.state.hoverNode === d.id ? 1 : 0.3
      })}
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
        // hierarchySum: d => {console.log(d); return d.value.sum },
      }}
      tooltipContent={d => {
        return d.key
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
