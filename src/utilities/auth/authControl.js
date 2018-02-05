import React from 'react';
import firebase from 'firebase';
import { graphql, compose, withApollo } from 'react-apollo';
import { getUser, getDropdownOpen, getModalOpen } from './graphql/authQueries';
import { updateAuthDropdown, updateUser, updateAuthModal } from './graphql/authMutations';
import { defaultAuthState } from './graphql/authDefaultState';

const AuthControl = (props) => {
  const displayName = (props.user.name) ? props.user.name : props.user.email;

  if (props.user.loggedIn === true) {
    return (
      <li className={['dropdown', props.dropdownOpen ? 'open' : ''].join(' ')}>
        <a
          className="dropdown-toggle"
          onClick={() => props.updateAuthDropdown({
            variables: {
              open: !props.dropdownOpen,
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
                  const defaultUser = defaultAuthState.user;
                  props.updateUser({
                    variables: {
                      loggedIn: defaultUser.loggedIn,
                      privilege: defaultUser.privilege,
                      name: defaultUser.name,
                      email: defaultUser.email,
                      provider: defaultUser.provider,
                      token: defaultUser.token,
                    },
                  });
                }, (error) => {
                  console.log(error);
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
              open: !props.modalOpen,
            },
          });
        }}
        className=""
      >Log In
    </a>
    </li>
  );
};

const AuthControlComposed = compose(
  graphql(updateAuthModal, { name: 'updateAuthModal' }),
  graphql(updateUser, { name: 'updateUser' }),
  graphql(updateAuthDropdown, { name: 'updateAuthDropdown' }),
  graphql(getModalOpen, {
    props: ({ data: { modal } }) => ({
      modalOpen: modal.open,
    }),
  }),
  graphql(getDropdownOpen, {
    props: ({ data: { dropdown } }) => ({
      dropdownOpen: dropdown.open,
    }),
  }),
  graphql(getUser, {
    props: ({ data: { user } }) => ({
      user,
    }),
  })
)(AuthControl);

export default withApollo(AuthControlComposed);

