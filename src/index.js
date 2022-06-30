import React from 'react';
import { createRoot } from 'react-dom/client';
import 'babel-polyfill';

// Import Routes
import Routes from './routes';

// Import styles
require('./styles/styles.scss');

const container = document.getElementById('root');
const root = createRoot(container); 
root.render(<Routes />);

// render(
//   (<Routes />),
//   document.getElementById('app'),
// );
