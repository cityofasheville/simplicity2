import { Link } from 'react-router';
import SubNavbar from '../../SubNavbar';

function PermitsHome(props) {
  const nav_items = [
    { name: 'Browse All Permits', path: '/permits' },
    { name: 'Permit Search', path: '/permits/search' },
    {
      name: 'Development Services Portal',
      path: 'https://www.ashevillenc.gov/department/development-services/development-portal/',
    },
  ];
  return (
    <>
      <SubNavbar
        navTitle="Permits navigation"
        navItems={nav_items}
        burgerName="Permits Menu"
        mobileBreakpoint="lg"
      >
        <a
          href="#content_permits"
          className="absolute -left-[999px] -top-[-999px] z-[100] bg-primary px-6 py-3 text-white font-semibold shadow-lg focus:left-0 focus:top-0"
        >
          Skip sub navigation and jump to permits content
        </a>
      </SubNavbar>
      <div id="content_permits" className="py-6">
        {props.children}
      </div>
    </>
  );
}

export default PermitsHome;
