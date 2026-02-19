import { Link } from 'react-router';

function MajorDevelopmentDashboard(props) {
  return (
    <div id="" className="container-fluid h-100">
      <nav
        className="my-4 py-4 w-full overflow-x-auto"
        aria-label="Development dashboard navigation"
      >
        <ul className="flex gap-3 text-coa-blue-dark font-normal">
          <li>
            <Link to="/development/major/" className="px-2 py-1 text-nowrap">
              Overview
            </Link>
          </li>
          <li>
            <Link to="/development/major/types" className="px-2 py-1 text-nowrap">
              Project Types
            </Link>
          </li>
          <li>
            <Link to="/development/major/process" className="px-2 py-1 text-nowrap">
              Process
            </Link>
          </li>
          <li>
            <Link to="/development/major/search" className="px-2 py-1 text-nowrap">
              Development &amp; Permit Search
            </Link>
          </li>
          <li>
            <Link to="/development/major/details" className="px-2 py-1 text-nowrap">
              Project Details
            </Link>
          </li>
          <li>
            <Link to="/development/major/engage" className="px-2 py-1 text-nowrap">
              Get Involved
            </Link>
          </li>
          <li>
            <Link to="/development/major/faq" className="px-2 py-1 text-nowrap">
              FAQ
            </Link>
          </li>
        </ul>
      </nav>
      <div>{props.children}</div>
    </div>
  );
}

export default MajorDevelopmentDashboard;
