import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { nest } from 'd3-collection';
import { ResponsiveNetworkFrame } from 'semiotic';
import Tooltip from '../../../shared/visualization/Tooltip';

// given hierarchical data, make selecty categories
// use callback to set current data for parent element
// include circlepack

class HierarchicalSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeDepth: 2,
      selectedByLevel: this.props.hierarchyOrder,
    };

    this.setActiveDepth = this.setActiveDepth.bind(this);
  }

  setActiveDepth(newDepth) {
    this.setState({
      activeDepth: newDepth,
    });
  }


  render() {
    const thisNest = nest();
    this.props.hierarchyOrder.forEach(level => thisNest.key(d => d[level]))
    thisNest.rollup(d => d.length)
    const edges = thisNest.entries(this.props.data);
    /*
    whatever level is visualized should receive colors
    if there are too many selected in the active group, roll the rest into "other"
    still show them separately, just make them the same color
    inactive ones should be lighter
    should selection annotations have a button role?
    use custom node icon to make these look more like buttons?
      make padding for whitespace between them
      use stroke for hover?
    add labels

    children are automatically active if parent is active
    children are automatically deactivated if parent is deactivated
    if a move will activate or deactivate other nodes, highlight those nodes
      as well on hover

    */

    const margin = {
      top: 5,
      right: 0,
      bottom: 5,
      left: 50,
    };

    return (
      <div className="interactiveAnnotation">
        <ResponsiveNetworkFrame
          size={[1000, 100]}
          margin={margin}
          responsiveWidth
          edges={{ key: 'All Permits', values: edges }}
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
            console.log(sameDepthNode, d)
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
                <button
                  type="button"
                  style={{
                    height: buttonHeight,
                  }}
                >
                  <span className="caret"></span>
                </button>
                <ul className="dropdown-menu dropdown-menu-right">
                  <li>foo</li>
                  <li>baz</li>
                </ul>
              </div>
            </div>)
          }}
          nodeStyle={(d, i) => {
            // console.log(d)
            const atActiveDepth = d.depth === this.state.activeDepth ? 1 : 0
            return {
              fill: 'gray',
              stroke: 'white',
              fillOpacity: atActiveDepth ? 1 : 0.5,
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
            const title = heritage.reverse().join(' > ');
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
    // if there's nothing here, assume all of them
  },
  onSelect: data => console.log(data),
};

export default HierarchicalSelect;
