/**
*
* Login
*
*/

import React from 'react';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

class Login extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const linkName = <FormattedMessage {...messages.loginLabel} />;
    return (
      <div>
        <a href='login'>
          { linkName }
        </a>
      </div>
    );
  }
}

export default Login;
