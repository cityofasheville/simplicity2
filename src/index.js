import React from 'react';
import { render } from 'react-dom';
import 'babel-polyfill';

// Import Routes
import Routes from './routes';

// Import styles
require('./styles/styles.scss');

render((
  <Routes />
), document.getElementById('app'));
