import React from 'react';
import PropTypes from 'prop-types';

class Collapsible extends React.Component {
    constructor(props) {
        super(props);

        if(props.open) {
            this.state = {
                isClosed: false,
                shouldSwitchAuto: false,
                height: 'auto',
                transition: 'none',
                hasBeenOpened: true,
                overflow: props.overflowWhenOpen,
                inTransition: false,
            };
        } else {
            this.state = {
                isClosed: true,
                shouldSwitchAuto: false,
                height: 0,
                transition: 'height ${this.props.transitionTime}ms ${this.props.easing}',
                hasBeenOpened: false,
                overflow: 'hidden',
                inTransition: false,
            };
        }
        this.handleTriggerClick = this.handleTriggerClick.bind(this);
        this.handleTransitionEnd = this.handleTransitionEnd.bind(this);
        this.continueOpen = this.continueOpen.bind(this);

    }

    commponentUpdate(prevProps, prevState) {
        if(this.state.shouldContinueOpen) {
            this.continueOpen();
        }

        if(prevState.height === 'auto' && this.state.shouldSwitchAuto === true) {
            window.setTimeout(() => {   //set small timeout to ensure a true re-render
                this.setState({
                    height: 0,
                    overflow: 'hidden',
                    isClosed: true,
                    shouldSwitchAuto: false,
                });
            }, 50);
        }

        if(prevProps.open !== this.props.open) {
            if(this.props.open === true) {
                this.openCollapsible();
            } else {
                this.closeCollapsible();
            }
        }
    }

    openCollapsible() {
        this.setState({
            inTransition: true,
            shouldContinueOpen: true,
        });
    }

    closeCollapsible() {
        this.setState({
            shouldSwitchAuto: true,
            height: this.refs.inner.offsetHeight,
            transition: 'height ${this.props.transitionTime}ms ${this.props.easing}',
            inTransition: true,
        });
    }

    continueOpen() {
        this.setState({
            height: this.ref.inner.offsetHeight,
            transition: 'height ${this.props.transitionTime}ms ${this.props.easing}',
            isClosed: false,
            hasBeenOpened: true,
            inTransition: true,
            shouldContinueOpen: false,
        });
    }

    handleTriggerClick(event) {
        event.preventDefault();

        if(this.props.handleTriggerClick) {
            this.props.handleTriggerClick(this.props.accordionPosition);
        } else {
            if(this.state.isClosed === true) {
                this.openCollapsible();
                this.props.onOpening();
            } else {
                this.closeCollapsible();
                this.props.onClosing();
            }
        }
    }

    handleTransitionEnd() {
        if(!this.state.isClosed) {
            this.setState({
                height: 'auto',
                overflow: this.props.overflowWhenOpen,
                inTransition: false,
            });
            this.props.onOpen();
        } else {
            this.setState({
                inTransition: false,
            });
            this.props.onClose();
        }
    }

    render() {
        var dropDownStyle = {
          height: this.state.height,
          WebkitTransition: this.state.transition,
          msTransition: this.state.transition,
          transition: this.state.transition,
          overflow: this.state.overflow,
        }

        var openClass = this.state.isClosed ? 'is-closed' : 'is-open';

        const triggerClassString = 'Collapsible__trigger ${openClass}';
        const outerClassString = 'Collapsible__contentOuter ${this.props.contentOuterClass}';
        const innerClassString = 'Collapsible__contentInner ${this.props.contentInnerClass}';

        return (
            <div className='Collapsible'>
                <span
                    className={triggerClassString.trim()}
                    onClick={this.handleTriggerClick}>{trigger}
                </span>
                <div className={outerClassString.trim()} ref='outer' style={dropDownStyle}
                    onTransitionEnd={this.handleTransitionEnd}>
                  <div className={innerClassString.trim()} ref='inner'>
                    {children}
                  </div>
                </div>
            </div>
        )
    }
}

Collapsible.propTypes = {
    open: PropTypes.bool,
    transitionTime: PropTypes.number,
    easing: PropTyes.string,
    openedClassName: PropTypes.string,
    triggerClassName: PropTypes.string,
    triggerOpenedClassName: PropTypes.string,
    contentOuterClassName: PropTypes.string,
    contentInnerClassName: PropTypes.string,
    accordionPosition: propTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    handleTriggerClick: PropTypes.func,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
    onOpening: PropTypes.func,
    onclosing: PropTypes.func,
    trigger: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element
    ]),
    triggerWhenOpen: PropTypes.oneOfType([
        PropTypes.string,
        Proptypes.element
    ]),
    overflowWhenOpen: PropTypes.oneOf([
        'hidden',
        'visible',
        'auto',
        'scroll',
        'inherit',
        'initial',
        'unset'
    ]),
    triggerSibling: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.func,
    ])
};

Collapsible.defaultProps = {
    open: false,
    transitionTime: 400,
    easing: 'linear',
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