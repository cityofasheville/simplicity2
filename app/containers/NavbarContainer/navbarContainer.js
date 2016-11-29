/*
 *
 * NavbarContainer
 *
 */

import React from 'react';
import { connect } from 'react-redux';
// import { browserHistory } from 'react-router';
// import { FormattedMessage } from 'react-intl';
// import messages from './navbarContainerMessages';
// import styles from './navbarContainerStyles.css';
// import NavbarLink from 'components/NavbarLink/navbarLink';
// import LoginContainer from 'containers/LoginContainer/loginContainer';

export class NavbarContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      navbarCollapse: 'collapse',
      navbarDropdown: '',
      navbarDisplay: 'block',
    };

    this.toggleNavbarCollapse = this.toggleNavbarCollapse.bind(this);
    this.toggleNavbarDropdown = this.toggleNavbarDropdown.bind(this);
    this.setNavbarDisplay = this.setNavbarDisplay.bind(this);
  }

  setNavbarDisplay() {
    if (window.location.pathname === '/search-results') {
      this.setState({ navbarDisplay: 'none' });
    } else {
      this.setState({ navbarDisplay: 'block' });
    }
  }

  toggleNavbarCollapse() {
    if (this.state.navbarCollapse === 'collapse') {
      this.setState({ navbarCollapse: 'collapsed' });
    } else {
      this.setState({ navbarCollapse: 'collapse' });
    }
  }

  toggleNavbarDropdown() {
    if (this.state.navbarDropdown === '') {
      this.setState({ navbarDropdown: 'open' });
    } else {
      this.setState({ navbarDropdown: '' });
    }
  }

  render() {
    return (
      <div style={{ display: this.state.navbarDisplay }}>
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" onClick={this.toggleNavbarCollapse} aria-expanded="false">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <a className="navbar-brand" href="/">SimpliCity</a>
            </div>
            <div className={[this.state.navbarCollapse, 'navbar-collapse'].join(' ')}>
              <ul className="nav navbar-nav navbar-right">
                <li><a href="/my-simplicity">My SimpliCity</a></li>
                <li><a href="/topics">Topics</a></li>
                <li><a href="/search-results?text="><i className="fa fa-search"></i></a></li>
                <li className={['dropdown', this.state.navbarDropdown].join(' ')}>
                  <a className="dropdown-toggle" onClick={this.toggleNavbarDropdown} data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Cameron Carlyle <span className="caret"></span></a>
                  <ul className="dropdown-menu">
                    <li><a href="/profile">Profile</a></li>
                    <li><a href="/log-out">Log Out</a></li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { navbarContainer } = state;
  const props = {
    navbarContainer,
    location: ownProps,
  };
  return props;
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(NavbarContainer);
