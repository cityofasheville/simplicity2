import React from 'react';
import firebase from 'firebase';
import firebaseui from 'firebaseui';
import PropTypes from 'prop-types';
import { graphql, compose, withApollo } from 'react-apollo';
import { updateUser } from '../utilities/auth/graphql/authMutations';
import { getUser } from '../utilities/auth/graphql/authQueries';
import Navbar from './Navbar';
import Footer from './Footer';
import CityInfoBar from './CityInfoBar';
import AuthProviderModal from '../utilities/auth/authProviderModal';
import { defaultAuthState } from '../utilities/auth/graphql/authDefaultState';

const displayNavbar = (hideNavbar) => {
  if (window.location.href.indexOf('dashboards.ashevillenc.gov') < 0 && hideNavbar !== 'true') {
    return (<Navbar />);
  }
  return (<CityInfoBar />);
};

const authProviders = [
  firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  //firebase.auth.EmailAuthProvider.PROVIDER_ID,
];

const initializeFirebaseAuthUI = () => {
  // Initialize the FirebaseUI Widget using Firebase.
  const authUi = new firebaseui.auth.AuthUI(firebase.auth());

  // The start method will wait until the DOM is loaded.
  authUi.start('#firebaseui-auth-container', {
    signInSuccessUrl: '/',
    signInOptions: authProviders,
    // TODO:  Terms of service url.
    tosUrl: '<your-tos-url>',
  });
};

const firebaseLogout = (dispatch) => {
  return firebase.auth().signOut()
    .then(() => {
      dispatch(userLoggedOut());
    }, (error) => {
      dispatch(logoutError(error));
    });
};

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    firebase.initializeApp({
      apiKey: 'AIzaSyAEwpGQsTfOhwxUXaLX43FNAPA7BfL4SQ0',
      authDomain: 'simplicityii-878be.firebaseapp.com',
      databaseURL: 'https://simplicityii-878be.firebaseio.com',
      storageBucket: 'simplicityii-878be.appspot.com',
    });

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const userData = {
          email: user.email,
          name: user.displayName,
          provider: user.providerData[0].providerId,
          token: null, //hmmm....will it not have a token here that could just be used?
          logout: firebaseLogout,
        };
        user.getToken(true) /* forceRefresh */
        .then((idToken) => {
          userData.token = idToken;
          sessionStorage.setItem('token', idToken);
          this.props.updateUser({
            variables: {
              loggedIn: true,
              privilege: userData.privilege,
              name: userData.name,
              email: userData.email,
              provider: userData.provider,
              token: userData.token,
            },
          });
        }, (error) => {
          store.dispatch(loginError(error));
          console.log(`TOKEN ERROR: ${JSON.stringify(error)}`);
        });
      } else {
        console.log('hello');
        firebase.auth().signOut()
          .then(() => {
            console.log('test');
            this.props.client.resetStore();
          }, (error) => {
            dispatch(logoutError(error)); //todo
          });
      }
    });
    
    initializeFirebaseAuthUI();
  }
  
  render() {
    return (
      <div className="">
        <div id="skip"><a href="#content">Skip to Main Content</a></div>
        {
          displayNavbar(this.props.location.query.hideNavbar) // eslint-disable-line react/prop-types
        }
        <div className="container" id="content">
          { this.props.children }
        </div>
        <Footer />
        <AuthProviderModal />
      </div>
    );
  }
}

Main.propTypes = {
  children: PropTypes.node,
};

const App = compose(
  graphql(updateUser, { name: 'updateUser' }),
  graphql(getUser, {
    props: ({ data: { user } }) => ({
      user,
    }),
  })
)(Main);

export default withApollo(App);
