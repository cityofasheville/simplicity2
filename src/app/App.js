import React from 'react';
import Navbar from './Navbar';


import AuthProviderModal from '../utilities/auth/authProviderModal';

const displayNavbar = (hideNavbar) => {
  if (window.location.href.indexOf('dashboards.ashevillenc.gov') < 0 && hideNavbar !== 'true') {
    return (<Navbar />);
  }
  return '';
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
  children: React.PropTypes.node,
};

export default App;
