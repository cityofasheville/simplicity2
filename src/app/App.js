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
  if (hideNavbar) {
    return null
  }
  if (window.location.href.indexOf('dashboards.ashevillenc.gov') < 0) {
    return (<Navbar />); /// Navbar is SimpliCity
  }
  // CityInfoBar is dashboards
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
    signInFlow: 'popup',
    // TODO:  Terms of service url.
    tosUrl: '<your-tos-url>',
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
        user.getIdToken()
        .then((token) => {
          sessionStorage.setItem('token', token);
          this.props.updateUser({
            variables: {
              loggedIn: true,
              privilege: user.email.endsWith('ashevillenc.gov') ? 2 : 1,
              name: user.displayName,
              email: user.email,
              provider: user.providerData[0].providerId,
            },
          });
        }, (error) => {
          console.log(`TOKEN ERROR: ${JSON.stringify(error)}`);
        });
      } else {
        const defaultUser = defaultAuthState.user;
        this.props.updateUser({
          variables: {
            loggedIn: defaultUser.loggedIn,
            privilege: defaultUser.privilege,
            name: defaultUser.name,
            email: defaultUser.email,
            provider: defaultUser.provider,
          },
        });
      }
    });

    initializeFirebaseAuthUI();
  }

  render() {
    return (
      <div style={{paddingTop: this.props.location.query.hideNavbar ? '0px' : '0px'}}>
        <div id="skip"><a href="#content">Skip to Main Content</a></div>
        {
          displayNavbar(this.props.location.query.hideNavbar) // eslint-disable-line react/prop-types
        }
        <div className="container" id="content">
          { this.props.children }
        </div>
        { !this.props.location.query.hideNavbar && <Footer /> }
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
