import React from 'react';
import PropTypes from 'prop-types';
import CapitalProjectsSummaryCard from './CapitalProjectsSummaryCard';
import PageHeader from '../../shared/PageHeader';

const CapitalProjectsSummary = props => (
  <div>
    <PageHeader h1="Capital Projects" icon={<svg xmlns="http://www.w3.org/2000/svg" width="69" height="69">
        <path d="M45,57a2,2 0 0,1-3,1l-2-3V39l-6,10-11-6l9-18h-6l-8 14l-3-3V33l8-14h20a4,4 0 0,1 4,4zm16,12l-41-34l1-3 42,35 8-10a5,5 0 0,1 9,0l22,29h-57l13-16zm-28-18l7,10 1,25a8,8 0 0,1-6-4l-1-17-8-11-18,31a4,4 0 0,1-2-2l-1-6 17-32zm13-36a7,7 0 0,1 14,0a7,7 0 0,1-14,0" fill="#4077a5" /></svg>} />
    <div className="row">
      <div className="col-sm-12">
        <h2>Bonds</h2>
        <p>
          In 2016, Asheville&apos;s voters approved $74 million of bond funding for public improvements. The bond funding is categorized by three programs of work: Parks, Housing, and Transportation. The projects within these programs supplement projects that are already in the <a href="http://www.ashevillenc.gov/civicax/filebank/blobdload.aspx?blobid=26386#page=125" target="_blank" title="View the CIP plan pdf">City&apos;s Annual Operating Budget and Capital Improvement Program (CIP)</a>.
        </p>
      </div>
    </div>
    <div className="row">
      <div className="col-sm-4">
        <CapitalProjectsSummaryCard type="Transportation" />
      </div>
      <div className="col-sm-4">
        <CapitalProjectsSummaryCard type="Parks" />
      </div>
      <div className="col-sm-4">
        <CapitalProjectsSummaryCard type="Housing" />
      </div>
    </div>
    <hr />
    <div className="row">
      <div className="col-sm-12">
        <h2>Capital Improvement Program (CIP)</h2>
        <p>Details about the city&apos;s Capital Improvement Program coming soon!</p>
      </div>
    </div>
  </div>
);

CapitalProjectsSummary.propTypes = {
  location: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

export default CapitalProjectsSummary;
