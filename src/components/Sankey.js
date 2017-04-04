import React from 'react';
// import { drag } from 'd3-drag';
import { format } from 'd3-format';
import { scaleOrdinal, schemeCategory20 } from 'd3-scale';
// import { select } from 'd3-selection';
import { sankey } from 'd3-sankey';
import _ from 'lodash';
// import { rgb } from 'd3-color';

import styles from './sankey.css';

const dummyData = {
  nodes: [{
    name: 'Property Tax', // 0
  }, {
    name: 'Business License Tax', // 1
  }, {
    name: 'Sales Tax', // 2
  }, {
    name: 'Utility Consumption Tax', // 3
  }, {
    name: 'Real Estate Transfer Tax', // 4
  }, {
    name: 'Fines & Penalties', // 5
  }, {
    name: 'Transient Occupancy Tax', // 6
  }, {
    name: 'Service Charges', // 7
  }, {
    name: 'Transfers from Fund Balance', // 8
  }, {
    name: 'Miscellaneous Revenue', // 9
  }, {
    name: 'Interest Income', // 10
  }, {
    name: 'Licenses & Permits', // 11
  }, {
    name: 'Interfund Transfers', // 12
  }, {
    name: 'Grants & Subsidies', // 13
  }, {
    name: 'Local Tax', // 14
  }, {
    name: 'Internal Service Funds', // 15
  }, {
    name: 'Gas Tax', // 16
  }, {
    name: 'General Fund', // 17
  }, {
    name: 'Non-discretionary Funds', // 18
  }, {
    name: 'Police Department', // 19
  }, {
    name: 'Fire Department', // 20
  }, {
    name: 'City Council', // 21
  }, {
    name: 'Human Services', // 22
  }, {
    name: 'City Auditor', // 23
  }, {
    name: 'Community Services', // 24
  }, {
    name: 'City Clerk', // 25
  }, {
    name: 'Capital Improvement Projects', // 26
  }, {
    name: 'Mayor', // 27
  }, {
    name: 'City Administrator', // 28
  }, {
    name: 'Planning & Building', // 29
  }, {
    name: 'City Attorney', // 30
  }, {
    name: 'Housing & Community Development', // 31
  }, {
    name: 'Library', // 32
  }, {
    name: 'Public Works', // 33
  }, {
    name: 'Debt Services & Misc.', // 34
  }],
  links: [{
    source: 0,
    target: 17,
    value: 150.729,
  }, {
    source: 1,
    target: 17,
    value: 50,
  }, {
    source: 2,
    target: 17,
    value: 35,
  }, {
    source: 2,
    target: 18,
    value: 15,
  }, {
    source: 3,
    target: 17,
    value: 35,
  }, {
    source: 4,
    target: 17,
    value: 40,
  }, {
    source: 5,
    target: 17,
    value: 63.965,
  }, {
    source: 6,
    target: 17,
    value: 75.571,
  }, {
    source: 7,
    target: 18,
    value: 77.639,
  }, {
    source: 7,
    target: 17,
    value: 30.639,
  }, {
    source: 8,
    target: 17,
    value: 22.505,
  }, {
    source: 9,
    target: 17,
    value: 22.505,
  }, {
    source: 8,
    target: 18,
    value: 30.505,
  }, {
    source: 10,
    target: 18,
    value: 46.184,
  }, {
    source: 11,
    target: 18,
    value: 14.453,
  }, {
    source: 12,
    target: 18,
    value: 113.726,
  }, {
    source: 13,
    target: 18,
    value: 27.14,
  }, {
    source: 14,
    target: 18,
    value: 100.165,
  }, {
    source: 15,
    target: 18,
    value: 37.797,
  }, {
    source: 16,
    target: 18,
    value: 4.412,
  }, {
    source: 17,
    target: 19,
    value: 200.858,
  }, {
    source: 17,
    target: 20,
    value: 130.858,
  }, {
    source: 17,
    target: 21,
    value: 5.858,
  }, {
    source: 17,
    target: 23,
    value: 4.858,
  }, {
    source: 17,
    target: 24,
    value: 40.858,
  }, {
    source: 17,
    target: 25,
    value: 20.858,
  }, {
    source: 17,
    target: 27,
    value: 20.858,
  }, {
    source: 17,
    target: 28,
    value: 20.858,
  }, {
    source: 17,
    target: 30,
    value: 40.858,
  }, {
    source: 17,
    target: 34,
    value: 40.858,
  }, {
    source: 18,
    target: 19,
    value: 40.858,
  }, {
    source: 18,
    target: 20,
    value: 10.858,
  }, {
    source: 18,
    target: 22,
    value: 40.858,
  }, {
    source: 18,
    target: 24,
    value: 40.858,
  }, {
    source: 18,
    target: 26,
    value: 15.858,
  }, {
    source: 18,
    target: 28,
    value: 40.858,
  }, {
    source: 18,
    target: 29,
    value: 12.858,
  }, {
    source: 18,
    target: 31,
    value: 15.858,
  }, {
    source: 18,
    target: 32,
    value: 12.858,
  }, {
    source: 18,
    target: 33,
    value: 120.858,
  }, {
    source: 18,
    target: 34,
    value: 112.858,
  }],
};

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
    const margin = { top: 0, right: 10, bottom: 10, left: 10 };
    const width = this.width - margin.left - margin.right;
    const height = this.height - margin.top - margin.bottom;

    const newFormat = d => formatNumber(d);
    const formatNumber = format(',.0f'); // zero decimal places
    const color = scaleOrdinal(schemeCategory20);

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
        <rect height={node.dy} width={sankeyChart.nodeWidth()} fill={color(i)} stroke="black">
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
  nodes: dummyData.nodes,
  links: dummyData.links,
  height: 600,
  width: 1150,
};

export default Sankey;
