import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { nest } from 'd3-collection';
import { ResponsiveNetworkFrame } from 'semiotic';
import Tooltip from '../../../shared/visualization/Tooltip';
import HierarchicalDropdown from './HierarchicalDropdown';
import HorizontalLegend from '../../../shared/visualization/HorizontalLegend';
import { colorScheme } from './granularUtils'


/*
TODO
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

function selectedActiveDepthNodes(node, activeDepth) {
  if (node.depth === activeDepth) {
    if (activeDepth === 0) {
      return [node];
    }
    return node;
  }
  return [].concat(...node.values
    .filter(v => v.selected)
    .map(v => {
      return selectedActiveDepthNodes(v, activeDepth);
    })
  )
}

function setNodeDisplayOpts(nodesToDisplay, colors, maxNodes = 7) {
  // Needs output from selectedActiveDepthNodes
  return nodesToDisplay
    .sort((a, b) => b.unNestedValues.length - a.unNestedValues.length)
    .map((d, i) => {
      const rVal = Object.assign({}, d);
      let colorIndex = i;
      if (i > maxNodes - 1) {
        colorIndex = maxNodes;
        rVal.othered = true;
      }
      rVal.color = colors[colorIndex];
      return rVal;
    })
}

function selectedDataFromNodes(filteredColorfulNodes) {
  // Output from setNodeDisplayOpts
  return [].concat(...filteredColorfulNodes.map(node => {
    return node.unNestedValues.map(datum => {
      const rVal = Object.assign({}, datum)
      rVal.color = node.color
      rVal.othered = node.othered;
      return rVal;
    })
  }))
}


class HierarchicalSelect extends Component {
  constructor(props) {
    super(props);
    const thisEdges = this.customNestEntries(
      {
        key: 'All Permits',
        values: this.props.data,
      },
    );

    // TODO: filter out services by default

    // TODO: meld these two functions into one since they *always* appear together
    const selectedNodes = selectedActiveDepthNodes(thisEdges, this.props.activeDepth);
    const colorfulNodes = setNodeDisplayOpts(selectedNodes, this.props.colorScheme);

    this.state = {
      activeDepth: this.props.activeDepth,
      edges: thisEdges,
      colorfulNodes: colorfulNodes,
    };
    this.setActiveDepth = this.setActiveDepth.bind(this);
    this.handleNodeClick = this.handleNodeClick.bind(this);
  }

  customNestEntries(inputNode, depth = 0) {
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
    const selectedNodes = selectedActiveDepthNodes(this.state.edges, newDepth);
    const colorfulNodes = setNodeDisplayOpts(selectedNodes, this.props.colorScheme);

    this.setState({
      activeDepth: newDepth,
      colorfulNodes: colorfulNodes,
    });

    this.props.onFilterSelect(
      selectedDataFromNodes(colorfulNodes),
      colorfulNodes,
      this.props.hierarchyOrder[newDepth - 1],
    )
  }

  handleNodeClick(inputNode) {
    const clickedNode = Object.assign({}, inputNode)
    const newEdges = toggleHierarchy(clickedNode, this.state.edges);
    const selectedNodes = selectedActiveDepthNodes(newEdges, this.state.activeDepth);
    const colorfulNodes = setNodeDisplayOpts(selectedNodes, this.props.colorScheme);

    this.setState({
      activeDepth: this.state.activeDepth,
      edges: newEdges,
      colorfulNodes: colorfulNodes,
    })

    this.props.onFilterSelect(
      selectedDataFromNodes(colorfulNodes),
      colorfulNodes,
      this.props.hierarchyOrder[this.state.activeDepth - 1],
    )
  }

  render() {
    const margin = {
      top: 5,
      right: 0,
      bottom: 5,
      left: 50,
    };

    return (
      <div className="interactiveAnnotation">
        <HierarchicalDropdown
          hierarchy={this.state.edges}
          activeSelectedNodes={this.state.colorfulNodes}
          onNodeClick={node => this.handleNodeClick(node)}
        />
        <ResponsiveNetworkFrame
          size={[1000, 125]}
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
            const buttonHeight = sameDepthNode.y1 - sameDepthNode.y0 - 2;
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
                    height: buttonHeight,
                    borderRadius: 6,
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
            let color = '#a6a6a6';
            if (atActiveDepth && d.selected) {
              const colorfulNode = this.state.colorfulNodes.find(candidate => {
                return candidate.key === d.key && candidate.heritage.join() === d.heritage.join();
              })
              color = colorfulNode.color;
            }
            return {
              fill: color,
              stroke: 'white',
              fillOpacity: d.selected ? 1 : 0.5,
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
          customClickBehavior={d => this.handleNodeClick(d.data)}
        />
        <HorizontalLegend
          // label item has label and color
          style={{
            textAlign: 'center'
          }}
          labelItems={this.state.colorfulNodes
            .filter((d, i, array) => !d.othered || array.findIndex(datum => datum.othered) === i)
            .map(entry => (
              {
                label: entry.othered ? 'Other' : entry.key,
                color: entry.color,
              }
            ))
          }
        />
      </div>
    );
  }
}

HierarchicalSelect.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  hierarchyOrder: PropTypes.arrayOf(PropTypes.string),
  activeDepth: PropTypes.number,
  defaultSelected: PropTypes.arrayOf(PropTypes.object),
  onFilterSelect: PropTypes.func,
  colorScheme: PropTypes.arrayOf(PropTypes.string),
};

HierarchicalSelect.defaultProps = {
  data: [],
  hierarchyOrder: [
    'permit_group',
    'permit_type',
    'permit_subtype',
    'permit_category',
  ],
  activeDepth: 2,
  defaultSelected: [
    {
      level: 'permit_group',
      keys: [
        'Permits',
        'Planning',
      ],
    },
  ],
  onFilterSelect: (selectedData, selectedNodes, selectedHierarchyLevel) => {
    console.log(selectedData, selectedNodes, selectedHierarchyLevel);
  },
  colorScheme: colorScheme,
};

export default HierarchicalSelect;
