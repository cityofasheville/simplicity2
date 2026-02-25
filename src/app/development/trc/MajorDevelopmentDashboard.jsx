import { Link } from 'react-router';
import SubNavbar from '../../SubNavbar';

function MajorDevelopmentDashboard(props) {
  const nav_items = [
    { name: 'Overview', path: '/development/major/' },
    { name: 'Project Types', path: '/development/major/types' },
    { name: 'Process', path: '/development/major/process' },
    { name: 'Permit Search', path: '/development/major/search' },
    { name: 'All Permits', path: '/permits' },
    { name: 'Project Details', path: '/development/major/details' },
    { name: 'Get Involved', path: '/development/major/engage' },
    { name: 'FAQ', path: '/development/major/faq' },
    { name: 'City Website', path: 'https://www.ashevillenc.gov' },
  ];
  return (
    <>
      <SubNavbar
        navTitle="Development Services navigation"
        navItems={nav_items}
        burgerName="Development Services Menu"
        mobileBreakpoint="lg"
      />
      <div className="py-6">{props.children}</div>
    </>
  );
}

export default MajorDevelopmentDashboard;
