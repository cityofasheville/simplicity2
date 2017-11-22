//Baesd on  glennflanagan react-collapsible (https://github.com/glennflanagan/react-collapsible)

import React from 'react';
import PropTypes from 'prop-types';

class Collapsible extends React.Component {
  constructor(props) {
    super(props);

    if (props.open) {
      this.state = {
        isClosed: false,
        shouldSwitchAutoOnNextCycle: false,
        height: 'auto',
        transition: 'none',
        hasBeenOpened: true,
        overflow: props.overflowWhenOpen,
        inTransition: false,
        hover: false,
      };
    } else {
      this.state = {
        isClosed: true,
        shouldSwitchAutoOnNextCycle: false,
        height: 0,
        transition: `height ${props.transitionTime}ms ${props.easing}`,
        hasBeenOpened: false,
        overflow: 'hidden',
        inTransition: false,
        hover: false,
      };
    }
    this.handleTriggerClick = this.handleTriggerClick.bind(this);
    this.handleTransitionEnd = this.handleTransitionEnd.bind(this);
    this.continueOpenCollapsible = this.continueOpenCollapsible.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.setFocusLink = this.setFocusLink.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.shouldOpenOnNextCycle) {
      this.continueOpenCollapsible();
    }

    if (prevState.height === 'auto' && this.state.shouldSwitchAutoOnNextCycle === true) {
      window.setTimeout(() => { // Set small timeout to ensure a true re-render
        this.setState({
          height: 0,
          overflow: 'hidden',
          isClosed: true,
          shouldSwitchAutoOnNextCycle: false,
        });
      }, 50);
    }
    if (prevProps.open !== this.props.open) {
      if (this.props.open === true) {
        this.openCollapsible();
      } else {
        this.closeCollapsible();
      }
    }
  }

  setFocusLink(hoverState) {
    this.setState({ hover: hoverState });
  }

  closeCollapsible() {
    this.setState({
      shouldSwitchAutoOnNextCycle: true,
      height: this.refs.inner.offsetHeight,
      transition: `height ${this.props.transitionTime}ms ${this.props.easing}`,
      inTransition: true,
    });
  }

  openCollapsible() {
    this.setState({
      inTransition: true,
      shouldOpenOnNextCycle: true,
    });
  }

  continueOpenCollapsible() {
    this.setState({
      height: this.refs.inner.offsetHeight,
      transition: `height ${this.props.transitionTime}ms ${this.props.easing}`,
      isClosed: false,
      hasBeenOpened: true,
      inTransition: true,
      shouldOpenOnNextCycle: false,
    });
  }

  handleTriggerClick(event) {
    event.preventDefault();

    if (this.props.triggerDisabled) {
      return;
    }

    if (this.props.handleTriggerClick) {
      this.props.handleTriggerClick(this.props.accordionPosition);
    } else if (this.state.isClosed === true) {
      this.openCollapsible();
      this.props.onOpening();
    } else {
      this.closeCollapsible();
      this.props.onClosing();
    }
  }

  handleKeyUp(event) {
    event.preventDefault();
    if (event.charCode === 32) {
      if (this.props.handleKeyUp) {
        this.props.handleKeyUp(this.props.accordionPosition);
      } else if (this.state.isClosed === true) {
        this.openCollapsible();
        this.props.onOpening();
      } else {
        this.closeCollapsible();
        this.props.onClosing();
      }
    }
  }

  handleTransitionEnd() {
    if (!this.state.isClosed) {
      this.setState({ height: 'auto', overflow: this.props.overflowWhenOpen, inTransition: false });
      this.props.onOpen();
    } else {
      this.setState({ inTransition: false });
      this.props.onClose();
    }
  }

  render() {
    const dropdownStyle = {
      height: this.state.height,
      WebkitTransition: this.state.transition,
      msTransition: this.state.transition,
      transition: this.state.transition,
      overflow: this.state.overflow,
    };
    const whiteSpaceStyle = { visibility: 'hidden' };
    const linkStyle = {
      color: 'white',
      textDecoration: 'none',
      whiteSpace: 'nowrap',
    };
    const overflowStyle = { overflow: 'hidden' };


    const whiteSpace = 'white-space-white-space-white-space-white-space-white-space-white-space-white-space-white-space' +
      '-white-space-white-space-white-space-white-space-white-space-white-space-white-space-white-space-white-space';

    const openClass = this.state.isClosed ? 'is-closed' : 'is-open';
    const disabledClass = this.props.triggerDisabled ? 'is-disabled' : '';

    // If user wants different text when tray is open
    const trigger = (this.state.isClosed === false) && (this.props.triggerWhenOpen !== undefined)
      ? this.props.triggerWhenOpen
      : this.props.trigger;

    // Don't render children until the first opening of the Collapsible if lazy rendering is enabled
    const children = this.props.lazyRender
    && !this.state.hasBeenOpened
    && this.state.isClosed
    && !this.state.inTransition ? null : this.props.children;

    // Construct CSS classes strings
    const triggerClassString = `${this.props.classParentString}__trigger ${openClass} ${disabledClass} ${
      this.state.isClosed ? this.props.triggerClassName : this.props.triggerOpenedClassName
      }`;
    const parentClassString = `${this.props.classParentString} ${
      this.state.isClosed ? this.props.className : this.props.openedClassName
      }`;
    const outerClassString = `${this.props.classParentString}__contentOuter ${this.props.contentOuterClassName}`;
    const innerClassString = `${this.props.classParentString}__contentInner ${this.props.contentInnerClassName}`;

    return (
      <div style={{ outline: '#4579B3 3px solid', outlineOffset: this.state.hover ? '3px' : '-1px' }}>
        <div className={parentClassString.trim()} style={overflowStyle}>
          <a href="#" style={linkStyle} onKeyPress={this.handleKeyUp} onClick={this.handleTriggerClick} onFocus={() => this.setFocusLink(true)} onBlur={() => this.setFocusLink(false)} onMouseEnter={() => this.setFocusLink(true)} onMouseLeave={() => this.setFocusLink(false)}>
            <span className={triggerClassString} >
              {trigger} <span style={whiteSpaceStyle}>{whiteSpace}</span>
            </span>
          </a>
          <div className={outerClassString.trim()} ref="outer" style={dropdownStyle} onTransitionEnd={this.handleTransitionEnd}>
            <div className={innerClassString.trim()} ref="inner">
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Collapsible.propTypes = {
  hover: PropTypes.bool,
  transitionTime: PropTypes.number,
  easing: PropTypes.string,
  open: PropTypes.bool,
  classParentString: PropTypes.string,
  openedClassName: PropTypes.string,
  triggerClassName: PropTypes.string,
  triggerOpenedClassName: PropTypes.string,
  contentOuterClassName: PropTypes.string,
  contentInnerClassName: PropTypes.string,
  accordionPosition: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  handleTriggerClick: PropTypes.func,
  handleKeyUp: PropTypes.func,
  className: PropTypes.string,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  onOpening: PropTypes.func,
  onClosing: PropTypes.func,
  trigger: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  triggerWhenOpen: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  triggerDisabled: PropTypes.bool,
  lazyRender: PropTypes.bool,
  overflowWhenOpen: PropTypes.oneOf([
    'hidden',
    'visible',
    'auto',
    'scroll',
    'inherit',
    'initial',
    'unset',
  ]),
  children: PropTypes.node,
};

Collapsible.defaultProps = {
  hover: false,
  transitionTime: 300,
  easing: 'linear',
  open: false,
  classParentString: 'Collapsible',
  triggerDisabled: false,
  lazyRender: false,
  overflowWhenOpen: 'hidden',
  openedClassName: '',
  triggerClassName: '',
  triggerOpenedClassName: '',
  contentOuterClassName: '',
  contentInnerClassName: '',
  className: '',
  onOpen: () => {},
  onClose: () => {},
  onOpening: () => {},
  onClosing: () => {},
};

export default Collapsible;
