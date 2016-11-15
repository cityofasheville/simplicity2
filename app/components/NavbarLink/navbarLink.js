/**
*
* NavbarLink
*
*/

import React, { PropTypes } from 'react';

import { FormattedMessage } from 'react-intl';
import messages from './navbarLinkMessages';
import { Link } from 'react-router';


import styles from './navbarLinkStyles.css';

function NavbarLink(props) {
  return (
    <Link className={styles.navbarLink} activeStyle={{color: 'red'}} {...props}/>
  );
}

NavbarLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default NavbarLink;
