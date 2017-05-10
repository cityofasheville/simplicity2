import React from 'react';
import Navbar from './Navbar';


import AuthProviderModal from '../modules/auth/authProviderModal';

const displayNavbar = (hideNavbar) => {
  if (window.location.href.indexOf('dashboards') < 0 && hideNavbar !== 'true') {
    return (<Navbar />);
  }
  return '';
};

const App = props => (
  <div className="">
    {
      displayNavbar(props.location.query.hideNavbar) // eslint-disable-line react/prop-types
    }
    <div className="container">
      { props.children }
    </div>
    <AuthProviderModal />
  </div>
);

App.propTypes = {
  children: React.PropTypes.node,
};

export default App;
