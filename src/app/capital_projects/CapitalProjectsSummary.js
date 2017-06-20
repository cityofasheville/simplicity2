import React from 'react';
import PropTypes from 'prop-types';
import CapitalProjectsSummaryCard from './CapitalProjectsSummaryCard';
import PageHeader from '../../shared/PageHeader';

const CapitalProjectsSummary = props => (
  <div>
    <PageHeader h1="Capital Projects" />
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
        <p>Add section here</p>
      </div>
    </div>
  </div>
);

CapitalProjectsSummary.propTypes = {
  location: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

export default CapitalProjectsSummary;
