import React from 'react';
import { IndexLink, Link, browserHistory } from 'react-router';
import Icon from '../shared/Icon';
import { IM_SEARCH } from '../shared/iconConstants';
import AuthControl from '../utilities/auth/authControl';
import LangSwitcher from '../utilities/lang/LangSwitcher';

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
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container-fluid navbar__inner">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" onClick={this.toggleNavbarCollapse} aria-expanded="false">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <div className="pull-left">
                <IndexLink to="/">
                  <div className="logo">
                    <img src={require('./citylogo-flatblue.png')} alt="City of Asheville logo"></img>
                    <span className="logo__text">
                      <h1>SimpliCity</h1>
                      <h2>City of Asheville, NC</h2>
                    </span>
                  </div>
                </IndexLink>              
                <br />
              </div>
            </div>
            <div className={[this.state.navbarCollapse, 'navbar-collapse'].join(' ')}>
              <ul className="nav navbar-nav navbar-right">
                {/* <li><Link to="/my-simplicity" activeClassName="active">My SimpliCity</Link></li> */}
                <li><Link to="/dashboards" activeClassName="active">Dashboards</Link></li>
                <li><Link to="https://docs.google.com/a/ashevillenc.gov/forms/d/e/1FAIpQLSdjNwOmoDY3PjQOVreeSL07zgI8otIIPWjY7BnejWMAjci8-w/viewform?c=0&w=1" target="_blank" activeClassName="active">Feedback</Link></li>
                <li><a onClick={() => { browserHistory.push('/search?entities=address,property,neighborhood,street,owner') }}><Icon path={IM_SEARCH} size={16} /></a></li>
                <AuthControl />
                <li>
                  <hr style={{
                    border: 'none',
                    borderLeft: '1px solid #4077a5',
                    height: '20px',
                    width: '1px',
                  }}
                  />
                </li>
                <LangSwitcher />
              </ul>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}
