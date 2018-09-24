import React from 'react';
import PropTypes from 'prop-types';

class LinkFocusWrapper extends React.Component {
  thisRef = React.createRef();

  onLinkFocus = (e) => {
    if (e.target === this.thisRef.current) {
      e.preventDefault();
      e.stopPropagation();
      this.thisRef.current.firstChild.focus();
    }
  };

  attachRef = (el) => {
    this.thisRef.current = el;

    if (typeof this.props.focusRef === 'function') {
      this.props.focusRef(el);
    } else {
      this.props.focusRef.current = el;
    }
  };

  render() {
    const { Component } = this.props;
    return (
      <Component tabIndex="-1" ref={this.attachRef} onFocus={this.onLinkFocus}>
        {this.props.children}
      </Component>
    );
  }
}

LinkFocusWrapper.propTypes = {
  focusRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  children: PropTypes.node.isRequired,
  Component: PropTypes.node,
};

LinkFocusWrapper.defaultProps = {
  Component: 'div',
};

export default LinkFocusWrapper;
