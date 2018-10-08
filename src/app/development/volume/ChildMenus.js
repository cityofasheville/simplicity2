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
    let color = 'gray';
    if (this.props.node.selected) {
      const activeSelected = this.props.activeSelectedNodes.find(candidate => {
        if (!candidate.heritage) { return false; }
        return candidate.heritage.join() === this.props.node.heritage.join() &&
          candidate.key === this.props.node.key;
      });
      color = activeSelected ? activeSelected.color : 'black';
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
            width: '100%',
          }}
          role="button"
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

export default ChildMenus;
