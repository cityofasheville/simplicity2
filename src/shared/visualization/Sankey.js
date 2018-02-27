import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from './Tooltip'
import { scaleSequential } from 'd3-scale'
import { interpolateLab } from 'd3-interpolate'
import { NetworkFrame } from 'semiotic'




/*
 * TODOS
 * Why is downward transformation happening?  Top margin shouldn't be negative
 * On hover instead of tooltip, show labels and amounts for relevant nodes
 */

class Sankey extends React.Component {

  constructor() {
    super()
    this.state = { hover: null }
  }

  render() {
    const graph = {
      nodes: JSON.parse(JSON.stringify(this.props.nodes))
        .map((d, i) => {d.id = i; return d})
        .sort((a, b) => b.value - a.value),
      links: JSON.parse(JSON.stringify(this.props.links)),
    };

    const lighterColor = '#559ecc'
    const darkerColor = '#4292c6'
    let nodeColor = scaleSequential(interpolateLab(darkerColor, lighterColor))

    return <NetworkFrame
      networkType='sankey'
      size={[+this.props.width, +this.props.height]}
      nodes={graph.nodes}
      edges={graph.links}
      nodeIdAccessor='id'
      sourceAccessor='source'
      targetAccessor='target'
      // nodeLabels={d => <div key={`${d.name}-${d.id}-node`}>{d.name}</div>}
      nodeStyle={(d) => {
        const colorDomain = [graph.nodes[graph.nodes.length - 1].value, graph.nodes[0].value]
        nodeColor.domain(colorDomain)
        const thisNodeColor = nodeColor(d.value)
        const strokeColor = d.name === this.state.hover ? 'black' : darkerColor
        return { stroke: strokeColor, strokeWidth: '3px', fill: nodeColor(d.value)}
      }}
      edgeStyle={d => {
        // If source or target is hovered node, opacity should be darker
        const opacity = (this.state.hover === d.source.name || this.state.hover === d.target.name) ? '1' : '0.4'
        return {stroke: 'gray', fill: 'gray', fillOpacity: opacity, strokeOpacity: opacity}
      }}
      hoverAnnotation={true}
      tooltipContent={d => {
        const nodeSources = d.targetLinks.map(link => link.source.name)
        const nodeTargets = d.sourceLinks.map(link => link.target.name)
        const textLines = []
        if (nodeSources.length > 0) {
          textLines.push({
            text: `Sources: ${nodeSources.join(', ')}`,
            color: 'black'
          })
        }
        if (nodeTargets.length > 0) {
          textLines.push({
            text: `Destinations: ${nodeTargets.join(', ')}`,
            color: 'black'
          })
        }

        return <Tooltip
          title={d.name}
          textLines={textLines}
          style={{
            backgroundColor: 'white',
            border: '1px solid black',
            maxWidth: '100px',
            position: 'absolute',
            top: `${-d.height / 2}px`,
            left: `${this.props.width / 12}px`
          }}
        />
      }}
      zoomToFit={true}
      customHoverBehavior={d => d && d.name ?
        this.setState({hover: d.name}) : this.setState({hover: null})
      }
      margin={{top: -200, right: 10, bottom: 25, left: 10}}
    />

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
};

Sankey.defaultProps = {
  nodes: [],
  links: [],
  height: 600,
  width: 1150,
  altText: 'Sankey diagram',
};

export default Sankey;
