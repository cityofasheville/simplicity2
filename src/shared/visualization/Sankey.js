import React from 'react';
import PropTypes from 'prop-types';
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
    this.altText = props.altText;
    this.state = {
      nodes: props.nodes,
      links: props.links,
      nodeTitles: props.nodes.map(() => ({ showing: false, x: 0, y: 0 })),
      linkTitles: props.links.map(() => ({ showing: false, x: 0, y: 0 })),
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      nodes: nextProps.nodes,
      links: nextProps.links,
      nodeTitles: nextProps.nodes.map(() => ({ showing: false, x: 0, y: 0 })),
      linkTitles: nextProps.links.map(() => ({ showing: false, x: 0, y: 0 })),
    });
  }

  toggleTitle(ev) {
    if (ev.target.getAttribute('data-link') !== null) {
      const index = parseInt(ev.target.getAttribute('data-link'), 10);
      this.setState({ linkTitles: this.state.linkTitles.map((item, i) => {
        if (index === i) {
          return Object.assign({}, { showing: true, x: ev.clientX - window.document.getElementById('sankeySVG').getBoundingClientRect().left, y: ev.clientY - window.document.getElementById('sankeySVG').getBoundingClientRect().top });
        }
        return Object.assign({}, { showing: false, x: 0, y: 0 });
      }),
        nodeTitles: this.state.nodeTitles.map(() => (Object.assign({}, { showing: false, x: 0, y: 0 }))) });
    } else if (ev.target.getAttribute('data-node') !== null) {
      const index = parseInt(ev.target.getAttribute('data-node'), 10);
      this.setState({ nodeTitles: this.state.nodeTitles.map((item, i) => {
        if (index === i) {
          return Object.assign({}, { showing: true, x: ev.clientX - window.document.getElementById('sankeySVG').getBoundingClientRect().left, y: ev.clientY - window.document.getElementById('sankeySVG').getBoundingClientRect().top });
        }
        return Object.assign({}, { showing: false, x: 0, y: 0 });
      }),
        linkTitles: this.state.linkTitles.map(() => (Object.assign({}, { showing: false, x: 0, y: 0 }))) });
    } else {
      this.setState({ nodeTitles: this.state.nodeTitles.map(() => (Object.assign({}, { showing: false, x: 0, y: 0 }))),
        linkTitles: this.state.linkTitles.map(() => (Object.assign({}, { showing: false, x: 0, y: 0 }))) });
    }
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
        <path className={styles.link} d={path(link)} style={{ strokeWidth: Math.max(1, link.dy) }} data-link={i}>
          <title>{[link.source.name, ' → ', link.target.name, ': $', newFormat(link.value)].join('')}</title>
        </path>
        <text x={this.state.linkTitles[i].x} y={this.state.linkTitles[i].y} textAnchor={'middle'} hidden={!this.state.linkTitles[i].showing}>{[link.source.name, ' → ', link.target.name, ': $', newFormat(link.value)].join('')}</text> :
      </g>
    ));

    const nodes = graph.nodes.map((node, i) => (
      <g key={['node', i].join('_')}>
        <g className={styles.node} transform={['translate(', node.x, ',', node.y, ')'].join('')}>
          <rect height={node.dy} width={sankeyChart.nodeWidth()} fill={color[i % color.length]} stroke="black" data-node={i}>
            <title>{[node.name, '\n$', newFormat(node.value)].join('')}</title>
          </rect>
          { (node.x >= width / 2) ?
            <text x={-6} y={node.dy / 2} dy={'.35em'} textAnchor={'end'} >{node.name}</text> :
            <text x={6 + sankeyChart.nodeWidth()} y={node.dy / 2} dy={'.35em'} textAnchor={'start'} >{node.name}</text>
          }
        </g>
        { (node.x >= width / 2) ?
          <text x={this.state.nodeTitles[i].x} y={this.state.nodeTitles[i].y} textAnchor={'end'} hidden={!this.state.nodeTitles[i].showing}>{['$', newFormat(node.value)].join('')}</text> :
          <text x={this.state.nodeTitles[i].x} y={this.state.nodeTitles[i].y} textAnchor={'start'} hidden={!this.state.nodeTitles[i].showing}>{['$', newFormat(node.value)].join('')}</text>
        }
      </g>
    ));

    // JSX rendering return if didn't rely on faux-dom
    // ------------------------------------------------------------------------
    return (
      <svg alt={this.altText} width={width + margin.left + margin.right} height={height + margin.top + margin.bottom} onClick={ev => (this.toggleTitle(ev))} id="sankeySVG">
        <g transform={['translate(', margin.left, ',', margin.top, ')'].join('')}>
          {links}
          {nodes}
        </g>
      </svg>
    );
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
