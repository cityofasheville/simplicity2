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
  constructor() {
    super()
    this.state = {
      open: false,
    }
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({ open: false })
    }
  }

  render() {
    return (<div
      ref={this.setWrapperRef}
      className={`hierarchicalDropdown btn-group ${this.state.open ? 'open' : ''}`}
    >
      <button
        className="dropdown-toggle"
        onClick={(e) => {
          e.preventDefault();
          this.setState({ open: !this.state.open })
        }}
      >
        Filter Record Types
        <span className="caret" style={{
          transform: 'rotate(180)'
        }}></span>
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
