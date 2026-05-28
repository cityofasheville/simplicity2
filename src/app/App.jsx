import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose, withApollo } from 'react-apollo';
import { updateUser } from '../utilities/auth/graphql/authMutations';
import { getUser } from '../utilities/auth/graphql/authQueries';
import Navbar from './Navbar';
import EnvBanner from './EnvBanner';
import Banner from './Banner';
import Footer from './Footer';
import ErrorBoundary from '../shared/ErrorBoundary';
// import CityInfoBar from './CityInfoBar';
import { defaultAuthState } from '../utilities/auth/graphql/authDefaultState';
import LanguageProvider from '../utilities/lang/LanguageContext';
import Disclaimer from './Disclaimer';

// const displayNavbar = (hideNavbar) => {
//   if (hideNavbar || window.location.pathname === '/mini_search') {
//     return null;
//   }
//   if (window.location.href.indexOf('dashboards.ashevillenc.gov') < 0) {
//     return <Navbar />; // / Navbar is SimpliCity
//   }
//   // CityInfoBar is dashboards
//   return <CityInfoBar />;
// };

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disclaimerAccepted: false,
    };
    this.hideNavbar = this.props.location.query.hideNavbar ? true : false;

    this.handleAcceptDisclaimer = this.handleAcceptDisclaimer.bind(this);
  }

  handleAcceptDisclaimer() {
    localStorage.setItem('disclaimerAccepted', 'true');
    this.setState({ disclaimerAccepted: true });
  }

  componentDidMount() {
    const accepted = localStorage.getItem('disclaimerAccepted');
    if (accepted === 'true') {
      this.setState({ disclaimerAccepted: true });
    }

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

  //

  render() {
    const { disclaimerAccepted } = this.state;

    return (
      <>
        <div className="relative min-h-screen flex flex-col">
          <LanguageProvider>
            <a
              href="#main"
              className="absolute -left-64 -top-64 z-[100] bg-primary px-6 py-3 text-white font-semibold shadow-lg focus:left-0 focus:top-0"
            >
              Skip to main content
            </a>
            {!this.hideNavbar && <Navbar />}
            {/* <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="content"> */}
            <main className="flex-grow w-full" id="main">
              <div className="layout-grid w-full h-100">
                <EnvBanner />
                <Banner path="*">
                  <p className="text-center font-medium text-xl">
                    <em>IMPORTANT: Planned Maintenance Outage for All GIS Services</em>
                  </p>
                  <p className="text-center text-xl mb-4">Thursday, May 28, 6 p.m. – 10 p.m.</p>
                  <p className="text-center">
                    During this time, the SimpliCity address search may not function as expected.
                  </p>
                </Banner>
                <ErrorBoundary>{this.props.children}</ErrorBoundary>
              </div>
            </main>

            {!this.hideNavbar && <Footer />}
            {
              // <AuthProviderModal />
            }
          </LanguageProvider>
        </div>
        {!disclaimerAccepted && <Disclaimer onAccept={this.handleAcceptDisclaimer} />}
      </>
    );
  }
}

Main.propTypes = {
  children: PropTypes.node,
  updateUser: PropTypes.func,
};

Main.defaultProps = {
  children: undefined,
  updateUser: undefined,
};

const App = compose(
  graphql(updateUser, { name: 'updateUser' }),
  graphql(getUser, {
    props: ({ data: { user } }) => ({
      user,
    }),
  }),
)(Main);

export default withApollo(App);
