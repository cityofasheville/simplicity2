import { Link } from 'react-router';
import SubNavbar from '../../SubNavbar';

function PermitsHome(props) {
  const nav_items = [
    { name: 'Browse All Permits', path: '/permits' },
    { name: 'Permit Search', path: '/permits/search' },
    { name: 'Development Services Portal', path: 'https://develop.ashevillenc.gov/' },
  ];
  return (
    <>
      <SubNavbar
        navTitle="Permits navigation"
        navItems={nav_items}
        burgerName="Permits Menu"
        mobileBreakpoint="lg"
      />
      <div className="py-6">{props.children}</div>
    </>
  );
}

export default PermitsHome;
