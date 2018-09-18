import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { nest } from 'd3-collection';
import { ResponsiveNetworkFrame } from 'semiotic';
import Tooltip from '../../../shared/visualization/Tooltip';
import HierarchicalDropdown from './HierarchicalDropdown';


/*
TODO
send selected data back up to let parent parse and such
assign node colors here?
fix focus and hover behavior of dropdown button
fix focus behavior of dropdown items
move styling out of general maybe
*/
function getNodeRelationship(clickedNode, candidate) {
  if (candidate.depth === 0) {
    return 'parent';
  }
  const candidateHeritage = candidate.heritage.join();
  const clickedHeritage = clickedNode.heritage.join();
  if (candidate.key === clickedNode.key && candidateHeritage === clickedHeritage) {
    return 'self';
  } else if (candidate.depth > clickedNode.depth &&
    candidate.heritage.indexOf(clickedNode.key) === clickedNode.depth &&
    candidateHeritage.includes(clickedHeritage)
  ) {
    return 'child';
  } else if ( clickedHeritage.includes(candidateHeritage) &&
    clickedNode.heritage.indexOf(candidate.key) === candidate.depth) {
    return 'parent';
  }
  return null;
}

function toggleHierarchy(clickedNode, inputNode) {
  const node = Object.assign({}, inputNode);
  const relationship = getNodeRelationship(clickedNode, node);
  if (!relationship) {
    // Don't iterate if they have nothing to do with each other
    return node;
  }
  if (clickedNode.selected && (relationship === 'self' || relationship === 'child')) {
    // If clicked node was already selected, deselect itself and its children
    node.selected = false;
  } else if (!clickedNode.selected){
    // If clicked node is being selected, select itself and its children
    node.selected = true;
  }
  if (node.values) {
    node.values = inputNode.values.map((child) => {
      return toggleHierarchy(clickedNode, child);
    })
  }
  return node;
}

function selectedHierarchyData(node) {
  if (!node.values) {
    return node.selected ? node.unNestedValues : [];
  }
  return [].concat(...node.values.map(v => selectedHierarchyData(v)))
}

function getKeysAtActiveDepth(node, activeDepth) {
  if (node.depth === activeDepth) {
    return node.selected ? node.key : null;
  }
  return [].concat(...node.values.map(v => {
    return getKeysAtActiveDepth(v, activeDepth);
  }))
}



class HierarchicalSelect extends Component {
  constructor(props) {
    super(props);

    let thisEdges = this.customNestEntries(
      {
        key: 'All Permits',
        values: this.props.data,
      },
      0,
    )

    this.state = {
      activeDepth: 2,
      edges: thisEdges,
    };

    this.setActiveDepth = this.setActiveDepth.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  customNestEntries(inputNode, depth) {
    const node = Object.assign({}, inputNode);
    const nodeHeritage = node.heritage || [];
    node.depth = depth;
    node.selected = true;

    if (depth < this.props.hierarchyOrder.length) {
      node.unNestedValues = node.values;
      const childrenNest = nest()
        .key(d => d[this.props.hierarchyOrder[depth]])
        .entries(node.unNestedValues)

      childrenNest.sort((a, b) => b.values.length - a.values.length)

      node.values = childrenNest.map((child) => {
        const thisChild = Object.assign({}, child);
        thisChild.heritage = nodeHeritage.concat([node.key])
        return this.customNestEntries(thisChild, depth + 1);
      })
    } else {
      node.unNestedValues = node.values;
      node.value = node.values.length;
      node.values = undefined;
    }
    return node;
  }

  setActiveDepth(newDepth) {
    this.setState({
      activeDepth: newDepth,
    });
  }

  handleClick(inputNode) {
    const clickedNode = Object.assign({}, inputNode)
    const newEdges = toggleHierarchy(clickedNode, this.state.edges);
    this.setState({
      edges: newEdges,
    })
    this.props.onFilterSelect(selectedHierarchyData(newEdges))
  }

  render() {
    const margin = {
      top: 5,
      right: 0,
      bottom: 5,
      left: 50,
    };

    console.log(getKeysAtActiveDepth(this.state.edges, 0))

    return (
      <div className="interactiveAnnotation">
        <HierarchicalDropdown
          hierarchy={this.state.edges}
          onNodeClick={node => this.handleClick(node)}
        />
        <ResponsiveNetworkFrame
          size={[1000, 100]}
          margin={margin}
          responsiveWidth
          edges={this.state.edges}
          annotations={[
            {
              depth: 1,
              key: 'Module',
              type: 'custom',
            },
            {
              depth: 2,
              key: 'Type',
              type: 'custom',
            },
            {
              depth: 3,
              key: 'Subtype',
              type: 'custom',
            },
            {
              depth: 4,
              key: 'Category',
              type: 'custom',
            },
          ]}
          htmlAnnotationRules={(d) => {
            if (d.d.type !== 'custom') {
              return null;
            }
            const sameDepthNode = d.nodes.find(node => node.depth === d.d.depth);
            const buttonHeight = sameDepthNode.y1 - sameDepthNode.y0;
            return (<div className="input-group"
              key={d.d.key}
            >
              <div
                className='input-group-btn'
                style={{
                  cursor: 'pointer',
                  pointerEvents: 'all',
                  fontSize: '0.75em',
                  position: 'absolute',
                  top: `${sameDepthNode.y0}px`,
                  left: `-${margin.left}px`,
                  color: d.d.depth === this.state.activeDepth ? '#00a4f6' : 'inherit',
                }}
              >
                <button
                  type="button"
                  style={{
                    height: buttonHeight
                  }}
                  onClick={() => this.setActiveDepth(d.d.depth)}
                >
                  {d.d.key}
                </button>
              </div>
            </div>)
          }}
          nodeStyle={(d, i) => {
            const atActiveDepth = d.depth === this.state.activeDepth ? 1 : 0;
            return {
              fill: atActiveDepth ? 'pink' : '#c8c8c8',
              stroke: 'white',
              fillOpacity: d.data.selected ? 1 : 0.5,
            };
          }}
          filterRenderedNodes={(d) => {
            if (d.key === 'All Permits') {
              return false;
            }
            return true;
          }}
          nodeIDAccessor="key"
          hoverAnnotation
          tooltipContent={(d) => {
            const heritage = d.heritage.slice(1)
            heritage.push(d.key)
            const title = heritage.join(' > ');
            return (<Tooltip
              title={title}
              style={{ minWdith: title.length * 5 }}
            />)
          }}
          networkType={{
            type: 'partition',
            projection: 'vertical',
            hierarchyChildren: d => d.values,
            hierarchySum: d => d.value,
          }}
          customClickBehavior={d => this.handleClick(d.data)}
        />
      </div>
    );
  }
}

HierarchicalSelect.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  hierarchyOrder: PropTypes.arrayOf(PropTypes.string),
  onSelect: PropTypes.func,
  defaultSelected: PropTypes.object,
};

HierarchicalSelect.defaultProps = {
  data: [],
  hierarchyOrder: [
    'permit_group',
    'permit_type',
    'permit_subtype',
    'permit_category',
  ],
  defaultSelected: {
    // TODO: figure out how this should work
    permit_group: [
      'Permits',
      'Planning',
    ],
    key: 'root',
    selected: 'true',
  },
  onFilterSelect: data => console.log(data),
};

export default HierarchicalSelect;
