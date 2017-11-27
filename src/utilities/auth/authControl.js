import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withApollo } from 'react-apollo';

import { authControlDropdownClicked, loginLinkClicked } from './authActions';

const AuthControl = (props) => {
  const open = (props.open) ? 'open' : '';

  const displayName = (props.user.name) ? props.user.name : props.user.email;

  if (props.user.loggedIn === true) {
    return (
      <li className={['dropdown', open].join(' ')}>
        <a className="dropdown-toggle" onClick={() => props.dispatch(authControlDropdownClicked())} data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{displayName} <span className="caret"></span></a>
        <ul className="dropdown-menu">
          <li >
            <a href="#" onClick={(e) => { e.preventDefault(); props.user.logout(props.dispatch); props.client.resetStore(); }} className="">Log Out</a>
          </li>
        </ul>
      </li>
    );
  }

  return (
    <li>
      <a href="#" onClick={(e) => { e.preventDefault(); props.dispatch(loginLinkClicked()); }} className="">Log In</a>
    </li>
  );
};

AuthControl.propTypes = {
  dispatch: PropTypes.func,
  user: PropTypes.object,
  open: PropTypes.bool,
};

const mapStateToProps = state => (
  {
    user: state.auth.user,
    open: state.auth.dropdown.open,
  }
);

const mapDispatchToProps = dispatch => (
  {
    dispatch,
  }
);

const AuthControlConnected = connect(mapStateToProps, mapDispatchToProps)(AuthControl);

export default withApollo(AuthControlConnected);

