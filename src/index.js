import React from 'react';
import { render } from 'react-dom';
import 'babel-polyfill';

// Import Routes
import Routes from './routes';

// Import styles
require('./styles/styles.scss');

require('./favicon.ico');
require('./manifest.json');

render(
  (<Routes />),
  document.getElementById('app'),
);
