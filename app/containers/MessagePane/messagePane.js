/*
 *
 * MessagePane
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import styles from './messagePaneStyles.css';
import { CLEAR_MESSAGE } from 'containers/App/appConstants';

export class MessagePane extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    let content;
    if (this.props.hasMessage) {
      content = (
        <span style={{ color: 'red' }}>
          <a href="." onClick={(e) => { e.preventDefault(); this.props.dispatch({ type: CLEAR_MESSAGE }); }}>X</a> &nbsp;
          <FormattedMessage {...this.props.message} />
        </span>
      );
    } else {
      content = '';
    }

    return (
      <div className={styles.messagePane}>
        <hr />
        {content}
        <hr />
      </div>
    );
  }
}

MessagePane.propTypes = {
  hasMessage: React.PropTypes.bool,
  message: React.PropTypes.object,
  dispatch: React.PropTypes.func,
};

function mapStateToProps(state) {
  const { global } = state;
  const props = {
    hasMessage: global.hasMessage,
    message: global.message,
  };
  return props;
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MessagePane);
