/*
 *
 * LoginContainer
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import Login from 'components/Login/login';

export class LoginContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Login className = {this.props.className} user={this.props.user} dispatch={this.props.dispatch} />
    );
  }
}

LoginContainer.propTypes = {
  user: React.PropTypes.object,
  dispatch: React.PropTypes.func,
  className: React.PropTypes.string,
};

function mapStateToProps(state) {
  const { user } = state;
  const props = {
    user,
  };
  return props;
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
