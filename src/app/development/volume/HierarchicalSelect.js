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
      activeDepth: 1,
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

    // whatever level is visualized should receive colors
    // inactive ones should be lighter
    // on hover should highlihght parents?

    // use annotations to select which level is active
    // use custom node icon to make these look more like buttons
    // should they have a button role?



    return (
      <div className="interactiveAnnotation">
        <ResponsiveNetworkFrame
          size={[1000, 125]}
          margin={{
            top: 10,
            right: 10,
            bottom: 10,
            left: 50,
          }}
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
          svgAnnotationRules={(d) => {
            if (d.d.type !== 'custom') {
              return null;
            }
            const sameDepthNode = d.nodes.find(node => node.depth === d.d.depth);
            return (<text
              key={d.d.key}
              x={0}
              y={sameDepthNode.y}
              style={{
                fontSize: '0.75em',
                color: d.d.depth === this.state.activeDepth ? 'red' : 'black',
                cursor: 'pointer',
                pointerEvents: 'all',
                zIndex: 2,
              }}
              onClick={() => this.setActiveDepth(d.d.depth)}
            >
              {d.d.key}
            </text>)
          }}
          nodeStyle={(d, i) => {
            return {
              fill: 'gray',
              stroke: 'white',
              strokeWidth: 0.75,
              fillOpacity: 0.5,
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
