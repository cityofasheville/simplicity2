import TRCDataTable from './TRCDataTable';

function MajorDevDetails() {
  return (
    <div className="">
      <h1 className="text-4xl text-coa-blue-medium my-5">Major Development Details</h1>
      <div>
        <div className="my-6">
          <ul className="flex flex-wrap gap-4">
            <li>
              <a href="/permits">All Permit Applications</a>
            </li>
            <li>
              <a href="/">Search Nearby Development</a>
            </li>
            <li>
              <a href="/permits/search">Search Permits by Address or ID</a>
            </li>
            <li>
              <a
                href="https://data-avl.opendata.arcgis.com/datasets/b8fdb63db30b42d0875afb617e1551f4_2/explore?location=35.604370%2C-82.530822%2C11.13&showTable=true"
                target="_blank"
              >
                Open Data Portal - Permits
              </a>
            </li>
          </ul>
        </div>
        <p className="mb-6">
          The map and table below contain proposed, large-scale, private development projects for
          which a permit application has been submitted. You can also explore permit applications
          using the above links.
        </p>
        <TRCDataTable />
      </div>
    </div>
  );
}

export default MajorDevDetails;
