/*
 *
 * NavbarContainer
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import messages from './navbarContainerMessages';
import styles from './navbarContainerStyles.css';

import LoginContainer from 'containers/LoginContainer/loginContainer';

export class NavbarContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className={styles.navbarContainer}>
        <nav>
          <h3 className={styles.navbarTitle}><Link to="/"><FormattedMessage {...messages.title} /></Link></h3>
          <ul className={styles.navbarRight}>
            <li><Link to="/my-simplicity">My SimpliCity</Link></li>
            <li><Link to="/topics">Topics</Link></li>
            <li><LoginContainer /></li>
          </ul>
        </nav>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { navbarContainer } = state;
  const props = {
    navbarContainer,
  };
  return props;
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NavbarContainer);
