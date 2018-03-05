import React from 'react';
import PropTypes from 'prop-types';
import { scaleSequential } from 'd3-scale';
import { interpolateLab } from 'd3-interpolate';
import { NetworkFrame } from 'semiotic';


/*
 * TODOS
 * Why is downward transformation happening?  Top margin shouldn't be negative
 * Make it vertical on mobile
 */

class Sankey extends React.Component {

  constructor() {
    super();
    this.state = { hover: null };
  }

  render() {
    const graph = {
      nodes: JSON.parse(JSON.stringify(this.props.nodes))
        .map((d, i) => { d.id = i; return d; })
        .sort((a, b) => b.value - a.value),
      links: JSON.parse(JSON.stringify(this.props.links)),
    };

    const lighterColor = '#559ecc';
    const darkerColor = '#4292c6';
    const nodeColor = scaleSequential(interpolateLab(darkerColor, lighterColor));

    return (<div role="img" aria-label={this.props.altText} tabIndex={0}>
      <NetworkFrame
        annotations={graph.nodes}
        edges={graph.links}
        hoverAnnotation
        margin={{ top: -200, right: this.props.width / 9, bottom: 25, left: this.props.width / 9 }}
        networkType="sankey"
        nodeIdAccessor="id"
        nodes={graph.nodes}
        size={[+this.props.width, +this.props.height]}
        sourceAccessor="source"
        targetAccessor="target"
        zoomToFit
        customHoverBehavior={d => (d && d.name ?
          this.setState({ hover: d.name }) : this.setState({ hover: null }))
        }
        svgAnnotationRules={(d) => {
          if (this.state.hover === null) { return; }
          let label = d.d.name;
          let value;
          const hoverInSourceLinks = d.edges.find(edge => edge.source.name === this.state.hover && edge.target.name === d.d.name);
          const hoverInDestLinks = d.edges.find(edge => edge.target.name === this.state.hover && edge.source.name === d.d.name);
          if (this.state.hover === d.d.name) {
            label = `${d.d.name} Total`;
            value = d.d.value;
          } else if (hoverInSourceLinks) {
            value = hoverInSourceLinks.value;
          } else if (hoverInDestLinks) {
            value = hoverInDestLinks.value;
          } else {
            return;
          }
          const text = `${label}: ${this.props.valueFormatter(value)}`;
          return (<text
            key={`${d.d.name}-${d.i}-nodeLabel`}
            style={{
              position: 'absolute',
              opacity: 1,
              color: 'black',
              fontWeight: d.d.name === this.state.hover ? 'bolder' : 'normal',
              textAnchor: 'left',
            }}
            x={d.d.x - (4 * text.length)}
            y={d.d.y}
          >
            {text}
          </text>);
        }}
        edgeStyle={(d) => {
          // If source or target is hovered node, opacity should be darker
          const opacity = (this.state.hover === d.source.name || this.state.hover === d.target.name) ? '0.75' : '0.15';
          return { stroke: 'none', fill: 'gray', fillOpacity: opacity };
        }}
        nodeStyle={(d) => {
          const colorDomain = [graph.nodes[graph.nodes.length - 1].value, graph.nodes[0].value];
          nodeColor.domain(colorDomain);
          const strokeOpacity = d.name === this.state.hover ? 1 : 0.5;
          const strokeWidth = d.name === this.state.hover ? 3.5 : 2;
          return { stroke: darkerColor, strokeWidth: `${strokeWidth}px`, strokeOpacity, fill: nodeColor(d.value), fillOpacity: strokeOpacity };
        }}
        tooltipContent={() => ''}
      />
    </div>);
  }
}

const nameShape = {
  name: PropTypes.string,
};

const linkShape = {
  source: PropTypes.number,
  target: PropTypes.number,
  value: PropTypes.number,
};

Sankey.propTypes = {
  nodes: PropTypes.arrayOf(PropTypes.shape(nameShape)),
  links: PropTypes.arrayOf(PropTypes.shape(linkShape)),
  height: PropTypes.number,
  width: PropTypes.number,
  altText: PropTypes.string,
  valueFormatter: PropTypes.func,
};

Sankey.defaultProps = {
  nodes: [],
  links: [],
  height: 600,
  width: 1150,
  altText: 'Sankey diagram',
  valueFormatter: d => d,
};

export default Sankey;
