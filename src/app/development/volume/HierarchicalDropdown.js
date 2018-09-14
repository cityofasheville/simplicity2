import React, { Component } from 'react';
import PropTypes from 'prop-types';



const addChildren = (node, onNodeClick) => {
  const concatenatedHeritage = node.heritage.concat([node.key]).join();
  return (<li
    style={{ marginLeft: node.depth * 5 }}
    className={node.values ? 'dropdown-submenu dropdown-menu-right' : ''}
    key={concatenatedHeritage}
  >
    <a
      value={concatenatedHeritage}
      href=""
      onClick={(e) => {
        e.preventDefault();
        onNodeClick(node);
      }}
    >
      {node.key}
    </a>
      {node.values &&(
        <ul
          className="dropdown-menu dropdown-menu-right"
          role="menu"
        >
          {node.values.map((child) => {
            return addChildren(child);
          })}
        </ul>
      )}
  </li>
)
}


class HierarchicalDropdown extends Component {
  state = {
    open: false,
  }

  render() {
    return (<div className={`btn-group ${this.state.open ? 'open' : ''}`}>
      <a
        className="btn dropdown-toggle"
        href=""
        onClick={(e) => {
          e.preventDefault();
          this.setState({ open: true })
        }}
        >
          Permit Types
          <span className="caret"></span>
        </a>
        <ul
          className="dropdown-menu dropdown-menu-right"
          role="menu"
          >
            {
              this.props.hierarchy.values.map(value => addChildren(value, this.props.onNodeClick))
            }
          </ul>
        </div>)
  }
}

export default HierarchicalDropdown;
