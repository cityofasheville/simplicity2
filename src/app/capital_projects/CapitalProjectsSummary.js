import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import CIPFilter from './CIPFilter';
import CategoryDetails from './CategoryDetails';
import { longCategory } from './cip_utilities';

const CapitalProjectsSummary = (props) => {
  const selectedArr = [];
  const getSelected = () => {
    if (props.location.query.selected === undefined) {
      return ['Transportation', 'Housing', 'Parks', 'Public Safety', 'Other'];
    } else if (props.location.query.selected.length === 0) {
      return selectedArr;
    }
    const selected = props.location.query.selected.split(',');
    for (let category of selected) {
      const longName = longCategory(category);
      if (!selectedArr.includes(longName)) {
        selectedArr.push(longName);
      }
    }
    return selectedArr;
  };

  return (
    <div>
      <div className="row">
        <div className="col-sm-12">
          <h1>
            <a href="http://arcg.is/Sy5KC" className="pull-right" target="_blank" style={{ fontSize: '16px' }}>
              <div className="alert alert-success alert-sm" style={{ cursor: 'pointer', zIndex: '1000' }}>Try our Project Map to search geographically and by address.
              </div>
            </a>
            <span style={{ marginRight: '5px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="69" height="69">
                <path d="M45,57a2,2 0 0,1-3,1l-2-3V39l-6,10-11-6l9-18h-6l-8 14l-3-3V33l8-14h20a4,4 0 0,1 4,4zm16,12l-41-34l1-3 42,35 8-10a5,5 0 0,1 9,0l22,29h-57l13-16zm-28-18l7,10 1,25a8,8 0 0,1-6-4l-1-17-8-11-18,31a4,4 0 0,1-2-2l-1-6 17-32zm13-36a7,7 0 0,1 14,0a7,7 0 0,1-14,0" fill="#4077a5" />
              </svg>
            </span>
            Capital Projects
          </h1>
          <div className="pull-left">
            <a className="inText" href="http://www.ashevillenc.gov/civicax/filebank/blobdload.aspx?blobid=28348#page=146" target="_blank">View the City&apos;s General Capital Improvement Plan (CIP)</a>
          </div>
          <div className="pull-right">
            <Link className="inText" to={{ pathname: '/capital_projects/data' }}>Understand this data</Link>
          </div>
        </div>
      </div>
      <hr style={{ marginBottom: '10px' }} />
      <CIPFilter selected={getSelected()} location={props.location} />
      <hr style={{ marginTop: '5px', marginBottom: '5px' }} />
      <CategoryDetails location={props.location} categories={getSelected()} />
    </div>
  );
};

CapitalProjectsSummary.propTypes = {
  location: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

export default CapitalProjectsSummary;
