import React from "react";
import PropTypes from "prop-types";
import { graphql, compose, withApollo } from "react-apollo";
import { updateUser } from "../utilities/auth/graphql/authMutations";
import { getUser } from "../utilities/auth/graphql/authQueries";
import Navbar from "./Navbar";
import EnvBanner from "./EnvBanner";
import Banner from "./Banner";
import Footer from "./Footer";
import ErrorBoundary from "../shared/ErrorBoundary";
import CityInfoBar from "./CityInfoBar";
import { defaultAuthState } from "../utilities/auth/graphql/authDefaultState";
import LanguageProvider from "../utilities/lang/LanguageContext";

const displayNavbar = (hideNavbar) => {
  if (hideNavbar || window.location.pathname === "/mini_search") {
    return null;
  }
  if (window.location.href.indexOf("dashboards.ashevillenc.gov") < 0) {
    return <Navbar />; // / Navbar is SimpliCity
  }
  // CityInfoBar is dashboards
  return <CityInfoBar />;
};

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
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

  render() {
    return (
      <div
        className={
          this.props.location.query.hideNavbar
            ? "app-parent hidden-navbar"
            : "app-parent"
        }
      >
        <LanguageProvider>
          <a href="#content" className="skip-nav-link">
            Skip to Main Content
          </a>
          {displayNavbar(this.props.location.query.hideNavbar)}
          <div className="container" id="content">
            <EnvBanner />
            <Banner message={(
              <div>
                <p style={{ fontWeight: '500', fontSize: '1.5rem', textAlign: 'center' }}>
                  <em>Maintenance Notification:</em>
                </p>
                <p>
                  The City of Asheville GIS team will be performing system maintenance on March 14-15, 2024. 
                  During this time, all GIS services will be temporarily unavailable and some parts of Simplicity may not function as expected.
                  Thanks for your patience as we work to improve our systems.
                </p>
              </div>
            )} 
              color="orange" 
            />
            <ErrorBoundary>{this.props.children}</ErrorBoundary>
          </div>
          {!this.props.location.query.hideNavbar && <Footer />}
          {
            // <AuthProviderModal />
          }
        </LanguageProvider>
      </div>
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
  graphql(updateUser, { name: "updateUser" }),
  graphql(getUser, {
    props: ({ data: { user } }) => ({
      user,
    }),
  })
)(Main);

export default withApollo(App);
