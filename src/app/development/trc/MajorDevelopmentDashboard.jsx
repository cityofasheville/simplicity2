import { Link } from 'react-router';
import SubNavbar from '../../SubNavbar';

function MajorDevelopmentDashboard(props) {
  const nav_items = [
    { name: 'Major Development Overview', path: '/development/major/' },
    { name: 'Development Process', path: '/development/major/process' },
    { name: 'Project Details', path: '/development/major/details' },
    { name: 'Get Involved', path: '/development/major/engage' },
    { name: 'Get Notifications', path: 'https://notifications.ashevillenc.gov/' },
    { name: 'FAQ', path: '/development/major/faq' },
  ];
  return (
    <>
      <SubNavbar
        navTitle="Major Development navigation"
        navItems={nav_items}
        burgerName="Major Development Menu"
        mobileBreakpoint="lg"
      >
        <a
          href="#content_major_dev"
          className="absolute -left-[999px] -top-[-999px] z-[100] bg-primary px-6 py-3 text-white font-semibold shadow-lg focus:left-0 focus:top-0"
        >
          Skip sub navigation and jump to major development content
        </a>
      </SubNavbar>
      <div id="content_major_dev" className="py-6">
        {props.children}
      </div>
    </>
  );
}

export default MajorDevelopmentDashboard;
