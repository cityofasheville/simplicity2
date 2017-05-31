import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import HomelessnessPITSummary from './HomelessnessPITSummary';
import HomelessnessEnrollment from './HomelessnessEnrollment';

const HomelessnessSummary = props => (
  <div>
    <div className="row">
      <div className="col-sm-12">
        <h1>
          Homelessness in Asheville/Buncombe County
          <div className="btn-group pull-right" style={{ marginLeft: '10px' }}>
            <Link to={{ pathname: '/homelessness', query: { entity: props.location.query.entity, id: props.location.query.id, label: props.location.query.label, hideNavbar: props.location.query.hideNavbar } }}>
              <button className="btn btn-primary active" style={{ borderTopRightRadius: '0px', borderBottomRightRadius: '0px' }}>Summary</button>
            </Link>
            <Link to={{ pathname: '/homelessness/details', query: { entity: props.location.query.entity, id: props.location.query.id, label: props.location.query.label, hideNavbar: props.location.query.hideNavbar } }}>
              <button className="btn btn-primary" style={{ borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px' }}>Details</button>
            </Link>
          </div>
        </h1>
        <div className="pull-left">
          <a className="inText" href="http://www.ashevillenc.gov/civicax/filebank/blobdload.aspx?blobid=27777" target="_blank">Five year strategic plan on homelessness in Buncombe county</a>
        </div>
      </div>
    </div>
    <div className="row">
      <div className="col-sm-12">
        <HomelessnessPITSummary />
      </div>
    </div>
    <div className="row">
      <div className="col-sm-12">
        <HomelessnessEnrollment />
      </div>
    </div>
  </div>
);

HomelessnessSummary.propTypes = {
  location: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};


export default HomelessnessSummary;
