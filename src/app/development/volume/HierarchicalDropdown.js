import React, { Component } from 'react';
import PropTypes from 'prop-types';



class ChildMenus extends Component {
  render() {
    const concatenatedHeritage = this.props.node.heritage
      .concat([this.props.node.key])
      .join();
    let className = '';
    if (this.props.node.values) {
      className = `${className} dropdown-submenu`
    }
    let color = 'inherit';
    if (this.props.node.selected) {
      const activeSelected = this.props.activeSelectedNodes.find(candidate => {
        if (!candidate.heritage) { return false; }
        return candidate.heritage.join() === this.props.node.heritage.join() &&
          candidate.key === this.props.node.key;
      });
      color = activeSelected ? activeSelected.color : '#00a4f6';
    }
    return (
      <li
        className={className}
        key={concatenatedHeritage}
      >
        <a
          value={concatenatedHeritage}
          href=""
          onClick={(e) => {
            e.preventDefault();
            this.props.onNodeClick(this.props.node);
          }}
          style={{
            color: color,
          }}
        >
          {this.props.node.key}
        </a>
        {this.props.node.values &&(
          <ul
            className="dropdown-menu"
            role="menu"
          >
            {this.props.node.values.map((child) => {
              return (<ChildMenus
                key={child.key}
                node={child}
                onNodeClick={this.props.onNodeClick}
                activeSelectedNodes={this.props.activeSelectedNodes}
              />);
            })}
          </ul>
        )}
      </li>
    )
  }
}


class HierarchicalDropdown extends Component {
  /* TODO
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
      className={`hierarchicalDropdown container-fluid btn-group ${this.state.open ? 'open' : ''}`}
    >
      <a
        className="dropdown-toggle"
        href=""
        onClick={(e) => {
          e.preventDefault();
          this.setState({ open: !this.state.open })
        }}
        style={{
          backgroundColor: '#fbfbfb',
        }}
        >
          Permit Types
          <span className="caret"></span>
        </a>
        <ul
          className="dropdown-menu"
          role="menu"
          >
            {
              this.props.hierarchy.values.map(node => (
                <ChildMenus
                  key={node.key}
                  node={node}
                  onNodeClick={this.props.onNodeClick}
                  activeSelectedNodes={this.props.activeSelectedNodes}
                />
              ))
            }
          </ul>
        </div>)
  }
}

export default HierarchicalDropdown;
