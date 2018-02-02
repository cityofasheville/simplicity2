import React from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase';
import { graphql, compose, withApollo } from 'react-apollo';
import { getUser, getDropdownOpen } from './graphql/authQueries';
import { updateAuthDropdown, updateUser, updateAuthModal } from './graphql/authMutations';


const AuthControl = (props) => {
  const open = (props.open) ? 'open' : '';
  const displayName = (props.user.name) ? props.user.name : props.user.email;

  if (props.user.loggedIn === true) {
    return (
      <li className={['dropdown', open].join(' ')}>
        <a
          className="dropdown-toggle"
          onClick={() => props.updateAuthDropdown({
            variables: {
              open: !props.open,
            },
          })}
          data-toggle="dropdown"
          role="button"
          aria-haspopup="true"
          aria-expanded="false"
        >{displayName}
          <span className="caret"></span>
        </a>
        <ul className="dropdown-menu">
          <li >
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                firebase.auth().signOut()
                .then(() => {
                  this.props.client.resetStore();
                }, (error) => {
                  dispatch(logoutError(error)); //todo
                });
              }}
              className=""
            >Log Out
            </a>
          </li>
        </ul>
      </li>
    );
  }

  return (
    <li>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          props.updateAuthModal({
            variables: {
              open: !props.open,
            },
          });
        }}
        className=""
      >Log In
    </a>
    </li>
  );
};

AuthControl.propTypes = {
  updateAuthDropdown: PropTypes.func,
  user: PropTypes.object,
  open: PropTypes.bool,
};

const AuthControlComposed = compose(
  graphql(updateAuthModal, { name: 'updateAuthModal' }),
  graphql(updateUser, { name: 'updateUser' }),
  graphql(updateAuthDropdown, { name: 'updateAuthDropdown' }),
  graphql(getDropdownOpen, {
    props: ({ data: { dropdown } }) => ({
      open: dropdown.open,
    }),
  }),
  graphql(getUser, {
    props: ({ data: { user } }) => ({
      user,
    }),
  })
)(AuthControl);

export default withApollo(AuthControlComposed);

