import React from 'react';
import { IndexLink, Link } from 'react-router';

import AuthControl from '../utilities/auth/authControl';


export default class Navbar extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      navbarCollapse: 'collapse',
      navbarDisplay: 'block',
    };

    this.toggleNavbarCollapse = this.toggleNavbarCollapse.bind(this);
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
              <IndexLink to="/" className="navbar-brand">SimpliCity</IndexLink>
              {window.location.href.indexOf('dashboards.ashevillenc.gov') === -1 &&
                <div style={{ color: '#bf1bbf', fontStyle: 'italic', float: 'left', fontSize: '19px', height: '60px', padding: '19.5px 15px', lineHeight: '1' }}>Pre-Beta</div>
              }
            </div>
            <div className={[this.state.navbarCollapse, 'navbar-collapse'].join(' ')}>
              <ul className="nav navbar-nav navbar-right">
                <li><Link to="/my-simplicity" activeClassName="active">My SimpliCity</Link></li>
                <li><Link to="/topics" activeClassName="active">Topics</Link></li>
                <li><a href="/search"><i className="fa fa-search"></i></a></li>
                <AuthControl />
              </ul>
            </div>
          </div>
          {window.location.href.indexOf('dashboards.ashevillenc.gov') === -1 &&
            <a href="https://docs.google.com/a/ashevillenc.gov/forms/d/e/1FAIpQLSdjNwOmoDY3PjQOVreeSL07zgI8otIIPWjY7BnejWMAjci8-w/viewform?c=0&w=1" target="_blank" style={{ color: '#bf1bbf', marginLeft: '15px', fontStyle: 'italic' }}>Click here to give feedback or sign up for user testing</a>
          }
        </nav>
      </div>
    );
  }
}

