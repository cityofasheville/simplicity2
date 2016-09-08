/**
 *
 * App.react.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import Helmet from 'react-helmet';

// Import the CSS reset, which HtmlWebpackPlugin transfers to the build folder
import 'sanitize.css/sanitize.css';

import Footer from 'components/Footer/footer';
import Banner from './banner-metal.jpg';
import A from 'components/A/a';
import MessagePane from 'containers/MessagePane/messagePane';
import LoginContainer from 'containers/LoginContainer/loginContainer';

import styles from './appStyles.css';

function App(props) {
  return (
    <div className={styles.wrapper}>
      <Helmet
        titleTemplate="%s - React.js Boilerplate"
        defaultTitle="React.js Boilerplate"
        meta={[
          { name: 'description', content: 'A React.js Boilerplate application' },
        ]}
      />
      <A className={styles.logoWrapper} href="https://twitter.com/mxstbr">
        <img className={styles.logo} src={Banner} alt="react-boilerplate - Logo" />
      </A>
      <MessagePane />
      <LoginContainer />
      {React.Children.toArray(props.children)}
      <Footer />
    </div>
  );
}

App.propTypes = {
  children: React.PropTypes.node,
};

export default App;
