/**
*
* Login
*
*/

import React from 'react';

import { FormattedMessage } from 'react-intl';
import messages from './loginMessages';

class Login extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { user } = this.props;
    const linkName = (user.loggedIn) ? <FormattedMessage {...messages.logoutLabel} /> : <FormattedMessage {...messages.loginLabel} />;

    if (this.props.user.loggedIn) {
      return (

        <a className={this.props.className} href="." onClick={(e) => { e.preventDefault(); this.props.user.logout(this.props.dispatch); }}>
          { linkName }
        </a>
      );
    }

    return (
      <a className={this.props.className} href="login">
      { linkName }
      </a>
    );
  }
}

Login.propTypes = {
  className: React.PropTypes.string,
  user: React.PropTypes.object,
  dispatch: React.PropTypes.func,
};

export default Login;
