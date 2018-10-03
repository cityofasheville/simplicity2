import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ChildMenus from './ChildMenus'

class HierarchicalDropdown extends Component {
  /* TODO
    props validation
    make menus expand on hover of parent menu
    make colors match what's happening in parent component
      assign them in the depth labels?
      both gray vs colorful and opacity
      hover style should also match nodes
      focus style should match hover style
  */
  state = {
    open: false,
  }

  render() {
    return (<div
      className={`hierarchicalDropdown btn-group ${this.state.open ? 'open' : ''}`}
    >
      <button
        className="dropdown-toggle"
        href=""
        onClick={(e) => {
          e.preventDefault();
          this.setState({ open: !this.state.open })
        }}
        style={{
          backgroundColor: '#fbfbfb',
          borderRadius: 6,
        }}
      >
        Filter Record Types
        <span className="caret"></span>
      </button>
      <ul
        className="dropdown-menu"
        role="menu"
      >
        {this.props.hierarchy.values.map(node => (
          <ChildMenus
            key={node.key}
            node={node}
            onNodeClick={this.props.onNodeClick}
            activeSelectedNodes={this.props.activeSelectedNodes}
          />
        ))}
      </ul>
    </div>)
  }
}

export default HierarchicalDropdown;
