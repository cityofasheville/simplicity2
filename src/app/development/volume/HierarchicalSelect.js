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


const toggleHierarchy = function(inputNode, selected) {
  const node = Object.assign({}, inputNode);
  if (typeof selected ==='function') {
    node.selected = selected(node);
  } else {
    node.selected = selected;
  }
  if (node.values) {
    node.values = inputNode.values.map((child) => {
      return toggleHierarchy(child, selected);
    })
  }
  return node;
}

const assignDepthLabels = function(inputNode, depth) {
  const node = Object.assign({}, inputNode);
  node.depth = depth;
  const nodeHeritage = node.heritage || [];
  if (node.values) {
    node.values = inputNode.values.map((child) => {
      const thisChild = Object.assign({}, child);
      thisChild.heritage = nodeHeritage.concat([node.key])
      return assignDepthLabels(thisChild, depth + 1);
    })
  }
  return node;
}

const getSemioticNodeHeritage = function(d) {
  const heritage = [d.key];
  let nextParent = d.parent;
  while (nextParent) {
    if (nextParent.key === 'All Permits') {
      nextParent = null;
    } else {
      heritage.push(nextParent.key);
      nextParent = nextParent.parent;
    }
  }
  return heritage.reverse();
}


class HierarchicalSelect extends Component {
  constructor(props) {
    super(props);

    const thisNest = nest();
    this.props.hierarchyOrder.forEach(level => thisNest.key(d => d[level]))
    thisNest.rollup(d => d.length)

    let thisEdges = {
      key: 'All Permits',
      selected: 'true',
      values: thisNest.entries(this.props.data).map(v => {
        if (v.key === 'Services') {
          return toggleHierarchy(v, false);
        }
        return toggleHierarchy(v, true);
      })
    }

    // Maybe hack nest method to be able to add this without callinga  recursive function
    thisEdges = assignDepthLabels(thisEdges, 0)

    this.state = {
      activeDepth: 2,
      edges: thisEdges,
    };

    this.setActiveDepth = this.setActiveDepth.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  setActiveDepth(newDepth) {
    this.setState({
      activeDepth: newDepth,
    });
  }

  handleClick(clickedNode) {
    // TODO: also assign color here, remove node colors references

    const isSameNode = (candidate) => {
      return candidate.key === clickedNode.key &&
        candidate.heritage.join() === clickedNode.heritage.join()
    }

    const isChild = (candidate) => {
      return candidate.depth > clickedNode.depth &&
        candidate.heritage.indexOf(clickedNode.key) === clickedNode.depth &&
        candidate.heritage.join().includes(clickedNode.heritage.join());
    }

    const isParent = (candidate) => {
      return clickedNode.heritage.indexOf(candidate.key) === candidate.depth;
    }

    const isNodeDeselected = (candidate) => {
      if (isSameNode(candidate)) {
        return false;
      }
      if (isChild(candidate)) {
        return false;
      }
      return candidate.selected;
    }

    const isNodeSelected = (candidate) => {
      if (isSameNode(candidate)) {
        return true;
      }
      if (isParent(candidate)) {
        return true;
      }
      if (isChild(candidate)) {
        return true;
      }
      return candidate.selected;
    }

    let newEdges = this.state.edges;
    if (clickedNode.selected) {
      newEdges = toggleHierarchy(this.state.edges, isNodeDeselected)
    } else {
      newEdges = toggleHierarchy(this.state.edges, isNodeSelected)
    }

    this.setState({
      edges: newEdges,
    })

    this.props.onFilterSelect(newEdges)
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
  hierarchyOrder: ['permit_group', 'permit_type', 'permit_subtype', 'permit_category'],
  defaultSelected: {
    permit_group: ['Permits', 'Planning'],
    key: 'root',
    selected: 'true',
    selectedChildren: [
      {
        key: 'Permits',
        depth: 1,
      },
      {
        key: 'Planning',
        depth: 1,
      }
    ],
  },
  onFilterSelect: data => console.log(data),
};

export default HierarchicalSelect;
