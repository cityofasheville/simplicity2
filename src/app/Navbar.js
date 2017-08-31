import React from 'react';
import { IndexLink, Link } from 'react-router';
import Icon from '../shared/Icon';
import { IM_SEARCH } from '../shared/iconConstants';
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
        <nav className="navbar navbar-default navbar-fixed-top" style={{ backgroundColor: '#f6fcff', borderBottom: '1px solid #e7eaff'}}>
          <div className="container-fluid">
            <div className="pull-left" style={{ marginRight: '5px', marginTop: '5px', marginBottom: '5px' }}>
              <a href="http://www.ashevillenc.gov" target="_blank"><img src={require('./citylogo-flatblue.png')} width="80px" height="80px" alt="City of Asheville logo"></img></a>
            </div>
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" onClick={this.toggleNavbarCollapse} aria-expanded="false">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <div className="pull-left">
                <IndexLink to="/" className="navbar-brand" style={{ fontSize: '30px', marginBottom: '-10px' }}>SimpliCity</IndexLink>
                <br />
                <a href="http://www.ashevillenc.gov" target="_blank" style={{ fontSize: '12px', fontStyle: 'italic' }}>City of Asheville, NC</a>
              </div>
            </div>
            <div className={[this.state.navbarCollapse, 'navbar-collapse'].join(' ')}>
              <ul className="nav navbar-nav navbar-right">
                <li><Link to="/my-simplicity" activeClassName="active">My SimpliCity</Link></li>
                <li><Link to="/dashboards" activeClassName="active">Dashboards</Link></li>
                <li><a href="/search"><Icon path={IM_SEARCH} size={16} /></a></li>
                <AuthControl />
              </ul>
            </div>
          </div>
        </nav>
        {window.location.href.indexOf('dashboards.ashevillenc.gov') === -1 &&
          <div style={{ color: '#bf1bbf', fontStyle: 'italic', float: 'right', fontSize: '19px', padding: '5px 15px', lineHeight: '1' }}>
            Pre-Beta:&nbsp;
            <a href="https://docs.google.com/a/ashevillenc.gov/forms/d/e/1FAIpQLSdjNwOmoDY3PjQOVreeSL07zgI8otIIPWjY7BnejWMAjci8-w/viewform?c=0&w=1" target="_blank" style={{ color: '#bf1bbf', fontStyle: 'italic', fontSize: '16px' }}>Click here to give feedback or sign up for user testing</a>

          </div>
        }
      </div>
    );
  }
}

