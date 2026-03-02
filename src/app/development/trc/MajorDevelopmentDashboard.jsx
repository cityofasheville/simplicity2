import { Link } from 'react-router';
import SubNavbar from '../../SubNavbar';

function MajorDevelopmentDashboard(props) {
  const nav_items = [
    { name: 'Overview', path: '/development/major/' },
    { name: 'Process', path: '/development/major/process' },
    { name: 'Project Details', path: '/development/major/details' },
    { name: 'Get Involved', path: '/development/major/engage' },
    { name: 'Get Notifications', path: 'https://notifications.ashevillenc.gov/' },
    { name: 'FAQ', path: '/development/major/faq' },
    // { name: 'City Website', path: 'https://www.ashevillenc.gov' },
  ];
  return (
    <>
      <SubNavbar
        navTitle="Major Development navigation"
        navItems={nav_items}
        burgerName="Major Development Menu"
        mobileBreakpoint="md"
      />
      <div className="py-6">{props.children}</div>
    </>
  );
}

export default MajorDevelopmentDashboard;
