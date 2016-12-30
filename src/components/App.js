import React from 'react';
import Navbar from './Navbar';


import AuthProviderModal from '../modules/auth/authProviderModal';


const App = props => (
  <div className="">
    <Navbar />
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
