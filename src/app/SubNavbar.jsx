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
      <nav className="layout-full py-4 border-b border-coa-blue-light" aria-label={navTitle}>
        <button
          id="hamburger"
          type="button"
          className={`block ${mobileBreakpoint}:hidden navbar-toggle text-lg text-coa-blue-dark`}
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
            navbarOpen ? 'flex flex-col py-2 w-full' : 'hidden'
          } ${mobileBreakpoint}:flex ${mobileBreakpoint}:flex-row ${mobileBreakpoint}:items-center gap-2 ${mobileBreakpoint}:py-0`}
        >
          {navItems.map((item, index) => (
            <li className="" key={index}>
              {item.path.includes('https://') ? (
                <a href={item.path} className={`px-2 py-1 text-nowrap`}>
                  {item.name}
                </a>
              ) : (
                <Link to={item.path} className={`px-2 py-1 text-nowrap`}>
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <span className="sm:hidden md:hidden lg:hidden xl:hidden"></span>
    </>
  );
}

export default SubNavbar;
