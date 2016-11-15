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

import NavbarLink from 'components/NavbarLink/navbarLink';
import LoginContainer from 'containers/LoginContainer/loginContainer';

export class NavbarContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    console.log(this.props)
    return (
      <div className={styles.navbarContainer}>
        <nav>
          <Link className={styles.navbarTitle} to="/"><FormattedMessage {...messages.title} /></Link>
            <div className={styles.searchComponentWrapper}>
              <button className={styles.allDropdown}>
                All <i className="fa fa-caret-down" aria-hidden="true"></i>
              </button>
              <input
                className={styles.searchInput}
                ref= {(searchInput)=> this._searchInput = searchInput}
                onKeyUp={()=>{browserHistory.push(`/search-results?text=${this._searchInput.value}`)}}
                placeholder="Search for a location, name or ID..."
                type="text"
              />
              <button className={styles.searchButton}>
                <i className="fa fa-search" aria-hidden="true"></i>
              </button>
            </div>
          <ul className={styles.navbarRight}>
            <li>
              <Link className={styles.navbarLink} to="topics" activeClassName={styles.active}>Topics</Link>
            </li>
            <li>
              <Link className={styles.navbarLink} to="performance" activeClassName={styles.active}>Performance</Link>
            </li>
            <li>
              <Link className={styles.navbarLink} to="map" activeClassName={styles.active}>Map</Link>
            </li>
            <li>
              <Link className={styles.navbarLink} to="my-simplicity" activeClassName={styles.active} >My SimpliCity</Link>
            </li>

            <li><LoginContainer className={styles.navbarLink}  /></li>
          </ul>
        </nav>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
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

export default connect(mapStateToProps, mapDispatchToProps, null, {pure:false})(NavbarContainer);
