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
      };
    }
    this.handleTriggerClick = this.handleTriggerClick.bind(this);
    this.handleTransitionEnd = this.handleTransitionEnd.bind(this);
    this.continueOpenCollapsible = this.continueOpenCollapsible.bind(this);
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

    // If there has been a change in the open prop (controlled by accordion)
    if (prevProps.open !== this.props.open) {
      if (this.props.open === true) {
        this.openCollapsible();
      } else {
        this.closeCollapsible();
      }
    }
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
      'text-decoration': 'none',
      'white-space': 'nowrap',
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
      <div className={parentClassString.trim()} style={overflowStyle}>
        <a style={linkStyle} href="#" onClick={this.handleTriggerClick}>
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
    );
  }
}

Collapsible.propTypes = {
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
};

Collapsible.defaultProps = {
  transitionTime: 400,
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
  triggerSibling: null,
  onOpen: () => {},
  onClose: () => {},
  onOpening: () => {},
  onClosing: () => {},
};

export default Collapsible;
