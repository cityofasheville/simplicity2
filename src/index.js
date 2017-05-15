import React from 'react';
import { render } from 'react-dom';
import 'babel-polyfill';
import { initAuth } from './utilities/auth/';

// Import Redux Store
import configureStore from './configureStore';

// Import Routes
import Routes from './routes';

// Import styles
require('./styles/styles.scss');

const store = configureStore();

initAuth(store);

render((
  <Routes store={store} />
), document.getElementById('app'));
