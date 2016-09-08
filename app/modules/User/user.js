
// Import Firebase - for now (8/25/16), the use of require and import of individual
// submodules is needed to avoid problems with webpack (import seems to require
// beta version of webpack 2).
const firebase = require('firebase/app');
require('firebase/auth');
require('firebase/database');
require('firebase/storage');

import { userLoggedIn, userLoggedOut } from './userActions';
import messages from './userMessages';
import { ERROR_MESSAGE } from 'containers/App/appConstants';

export default class User {

  constructor(store) {
    this.store = store;
    store.subscribe(this.storeListener.bind(this));
  }

  storeListener() {
    // const state = this.store.getState();
  }

  firebaseLogout(dispatch) {
    return firebase.auth().signOut().then(() => {
      dispatch(userLoggedOut());
    }, (error) => {
      dispatch({
        type: ERROR_MESSAGE,
        data: {
          message: messages.logoutError,
          error,
        },
      });
    });
  }

  firebaseAuthStateListener(user) {
    if (user) {
      // User is signed in.
      const userData = userLoggedIn({
        email: user.email,
        name: user.displayName,
        provider: user.providerData[0].providerId,
        token: null,
        logout: this.firebaseLogout,
      });
      this.store.dispatch(userData);
      this.store.dispatch({ type: ERROR_MESSAGE, data: { message: messages.testError } });
    }
  }
}
