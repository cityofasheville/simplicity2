import React from 'react';
import { IndexLink, Link, browserHistory } from 'react-router';
import Icon from '../shared/Icon';
import { IM_SEARCH } from '../shared/iconConstants';
import LangSwitcher from '../utilities/lang/LangSwitcher';

export default class Navbar extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
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
      <header className="w-full bg-sky-100 border-b border-blue-dark">
        <nav className="w-full min-h-20 px-6 py-4 flex items-center justify-between">
          <div className="">
            <IndexLink to="/">
              <div className="flex items-center gap-4 logo">
                <img
                  src={require('../images/citylogo-flatblue.png')}
                  alt="City of Asheville logo"
                  className="h-16 w-16"
                ></img>
                <span className="text-coa-blue-dark">
                  <h1 className="text-4xl font-light">SimpliCity</h1>
                  <span className="font-light">City of Asheville, NC</span>
                </span>
              </div>
            </IndexLink>
          </div>

          <button
            type="button"
            className="block lg:hidden navbar-toggle"
            onClick={this.toggleNavbarCollapse}
            aria-expanded="false"
          >
            <span className="sr-only">Toggle navigation</span>
            <i className="bi bi-list" aria-hidden="true"></i>
          </button>

          <div className={[this.state.navbarCollapse, 'navbar-collapse'].join(' ')}>
            <ul className="flex gap-6 items-center text-coa-blue-dark text-lg">
              <li>
                <Link to="/dashboards" activeClassName="active">
                  Dashboards
                </Link>
              </li>
              <li>
                <a
                  onClick={() => {
                    browserHistory.push(
                      '/search?entities=address,property,neighborhood,street,owner'
                    );
                  }}
                >
                  <Icon path={IM_SEARCH} size={16} />
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </header>
    );
  }
}
