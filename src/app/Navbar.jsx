import React from 'react';
import { IndexLink, Link, browserHistory } from 'react-router';
import Icon from '../shared/Icon';
import { IM_SEARCH } from '../shared/iconConstants';
import LangSwitcher from '../utilities/lang/LangSwitcher';

function Navbar() {
  const [navbarOpen, setNavBarOpen] = React.useState(false);

  function toggleNavbar() {
    setNavBarOpen(!navbarOpen);
  }

  return (
    <header className="w-full bg-sky-100 border-b border-blue-dark">
      <nav
        className="w-full flex flex-col md:flex-row md:items-center md:justify-between"
        aria-label="Main navigation"
      >
        <div className="border-b md:border-0 border-coa-blue-light min-h-20 px-6 py-4 flex items-center justify-between">
          <div className="">
            <IndexLink to="/">
              <div className="flex items-center gap-4 logo">
                <img
                  src={require('../images/citylogo-flatblue.png')}
                  alt="City of Asheville logo"
                  className="h-16 w-16 hidden xs:block"
                ></img>
                <span className="text-coa-blue-dark">
                  <h1 className="text-4xl font-light">SimpliCity</h1>
                  <span className="font-light">City of Asheville, NC</span>
                </span>
              </div>
            </IndexLink>
          </div>
          <button
            id="hamburger"
            type="button"
            className="block md:hidden navbar-toggle text-2xl text-coa-blue-dark"
            onClick={toggleNavbar}
            aria-expanded={navbarOpen}
            aria-controls="menu-container"
          >
            <span className="sr-only">Toggle navigation</span>
            <i className="bi bi-list" aria-hidden="true"></i>
            <i className="bi bi-x-lg" aria-hidden="true"></i>
          </button>
        </div>
        <div
          id="menu-container"
          aria-hidden={!navbarOpen}
          className={`${navbarOpen ? 'block w-full' : 'hidden'} w-full md:w-auto md:block`}
        >
          <ul className="flex flex-col md:flex-row md:gap-6 md:items-center text-coa-blue-dark text-lg px-6">
            <li className="py-2 md:py-0">
              <Link to="/dashboards" activeClassName="active">
                Dashboards
              </Link>
            </li>
            <li className="py-2 md:py-0">
              <Link to="/search?entities=address,property,neighborhood,street,owner">
                <Icon path={IM_SEARCH} size={16} />
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
