import React from 'react';
import PropTypes from 'prop-types';
import Navbar from './Navbar';
import CityInfoBar from './CityInfoBar';

import AuthProviderModal from '../utilities/auth/authProviderModal';

const displayNavbar = (hideNavbar) => {
  if (window.location.href.indexOf('dashboards.ashevillenc.gov') < 0 && hideNavbar !== 'true') {
    return (<Navbar />);
  }
  return (<CityInfoBar />);
};

const App = props => (
  <div className="">
    <div id="skip"><a href="#content">Skip to Main Content</a></div>
    {
      displayNavbar(props.location.query.hideNavbar) // eslint-disable-line react/prop-types
    }
    <div className="container" id="content">
      { props.children }
    </div>
    <AuthProviderModal />
  </div>
);

App.propTypes = {
  children: PropTypes.node,
};

export default App;
