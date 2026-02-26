import React from 'react';
import { Link } from 'react-router';

function SubNavbar({
  navTitle = 'Submenu navigation',
  navItems = [],
  burgerName = 'Submenu',
  mobileBreakpoint = 'md',
}) {
  const [navbarOpen, setNavBarOpen] = React.useState(false);

  function toggleNavbar() {
    setNavBarOpen(!navbarOpen);
  }

  return (
    <>
      <nav className="layout-full border-b border-coa-blue-light" aria-label={navTitle}>
        <button
          id="hamburger"
          type="button"
          className={`block ${mobileBreakpoint}:hidden navbar-toggle py-2 text-lg text-coa-blue-dark`}
          onClick={toggleNavbar}
          aria-expanded={navbarOpen}
          aria-controls="menu-container"
        >
          <i className="bi bi-list" aria-hidden="true"></i>
          <i className="bi bi-x-lg" aria-hidden="true"></i>
          <span className="ml-2">{burgerName}</span>
        </button>
        <ul
          className={`${
            navbarOpen ? `flex` : `hidden ${mobileBreakpoint}:flex  `
          } flex-col ${mobileBreakpoint}:flex-row w-full ${mobileBreakpoint}:items-center gap-2 mb-4 ${mobileBreakpoint}:mb-0 `}
        >
          {navItems.map((item, index) => {
            let isActive = false;
            if (!item.path.includes('https://')) {
              isActive = window.location.pathname === item.path;
            }
            return (
              <li className="" key={index}>
                {item.path.includes('https://') ? (
                  <a href={item.path} className={`px-2 py-1 text-nowrap`}>
                    {item.name}
                  </a>
                ) : isActive ? (
                  <Link
                    to={item.path}
                    aria-describedby="current"
                    className={`inline-block px-2 py-1 ${mobileBreakpoint}:py-4 text-nowrap border-l-2 ${mobileBreakpoint}:border-0 ${mobileBreakpoint}:border-t-2 border-coa-blue-dark`}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <Link
                    to={item.path}
                    className={`inline-block px-2 py-1 ${mobileBreakpoint}:py-4 text-nowrap border-0 border-coa-blue-dark`}
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
        <span className="hidden" id="current">
          current page
        </span>
      </nav>
    </>
  );
}

export default SubNavbar;
