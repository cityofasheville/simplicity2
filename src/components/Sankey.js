import React from 'react';
// import { drag } from 'd3-drag';
import { format } from 'd3-format';
import { scaleOrdinal, schemeCategory20 } from 'd3-scale';
// import { select } from 'd3-selection';
import { sankey } from 'd3-sankey';
import _ from 'lodash';
// import { rgb } from 'd3-color';

import styles from './sankey.css';

// https://github.com/nickbalestra/sankey/blob/master/app/SankeyChart.js
class Sankey extends React.Component {
  constructor(props) {
    super(props);

    this.width = props.width;
    this.height = props.height;
    this.state = {
      nodes: props.nodes,
      links: props.links,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      nodes: nextProps.nodes,
      links: nextProps.links,
    });
  }

  render() {
    // ========================================================================
    // Set units, margin, sizes
    // ========================================================================
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    const width = this.width - margin.left - margin.right;
    const height = this.height - margin.top - margin.bottom;

    const newFormat = d => formatNumber(d);
    const formatNumber = format(',.0f'); // zero decimal places
    // const color = scaleOrdinal(schemeCategory20);
    const color = ['#c6dbef', '#9ecae1', '#6baed6', '#4292c6'];
    // const color = ['#40004b', '#d9f0d3', '#762a83', '#a6dba0', '#9970ab', '#5aae61', '#c2a5cf', '#1b7837', '#e7d4e8', '#00441b', '#f7f7f7', '#8e0152', '#e6f5d0', '#c51b7d', '#b8e186', '#de77ae', '#7fbc41', '#f1b6da', '#4d9221', '#fde0ef', '#276419', '#f7f7f7']; // color brewer diverging 11 pink-green

    // ========================================================================
    // Set the sankey diagram properties
    // ========================================================================
    const sankeyChart = sankey()
      .size([width, height])
      .nodeWidth(24)
      .nodePadding(8);

    const path = sankeyChart.link();

    const graph = {
      nodes: _.cloneDeep(this.state.nodes),
      links: _.cloneDeep(this.state.links),
    };

    sankeyChart.nodes(graph.nodes)
      .links(graph.links)
      .layout(32);

    const links = graph.links.map((link, i) => (
      <g key={['link', i].join('_')}>
        <path className={styles.link} d={path(link)} style={{ strokeWidth: Math.max(1, link.dy) }}>
          <title>{[link.source.name, ' → ', link.target.name, ': $', newFormat(link.value)].join('')}</title>
        </path>
      </g>
    ));


    const nodes = graph.nodes.map((node, i) => (
      <g key={['node', i].join('_')} className={styles.node} transform={['translate(', node.x, ',', node.y, ')'].join('')}>
        <rect height={node.dy} width={sankeyChart.nodeWidth()} fill={color[i % color.length]} stroke="black">
          <title>{[node.name, '\n', newFormat(node.value)].join('')}</title>
        </rect>
        { (node.x >= width / 2) ?
          <text x={-6} y={node.dy / 2} dy={'.35em'} textAnchor={'end'} >{node.name}</text> :
          <text x={6 + sankeyChart.nodeWidth()} y={node.dy / 2} dy={'.35em'} textAnchor={'start'} >{node.name}</text>
        }
      </g>
    ));

    // JSX rendering return if didn't rely on faux-dom
    // ------------------------------------------------------------------------
    return (
      <svg width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}>
        <g transform={['translate(', margin.left, ',', margin.top, ')'].join('')}>
          {links}
          {nodes}
        </g>
      </svg>
    );
  }
}

const nameShape = {
  name: React.PropTypes.string,
};

const linkShape = {
  source: React.PropTypes.number,
  target: React.PropTypes.number,
  value: React.PropTypes.number,
};

Sankey.propTypes = {
  nodes: React.PropTypes.arrayOf(React.PropTypes.shape(nameShape)),
  links: React.PropTypes.arrayOf(React.PropTypes.shape(linkShape)),
  height: React.PropTypes.number,
  width: React.PropTypes.number,
};

Sankey.defaultProps = {
  nodes: [],
  links: [],
  height: 600,
  width: 1150,
};

export default Sankey;
