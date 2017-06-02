import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import HomelessnessPITSummary from './HomelessnessPITSummary';
import HomelessnessEnrollment from './HomelessnessEnrollment';
import HomelessnessTargetPops from './HomelessnessTargetPops';
import HomelessnessVeterans from './HomelessnessVeterans';
import HomelessnessVeteransExits from './HomelessnessVeteransExits';

const HomelessnessSummary = props => (
  <div>
    <div className="row">
      <div className="col-sm-12">
        <h1>
          Homelessness in Asheville / Buncombe County
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
          <p>
            <a className="inText" href="http://www.ashevillenc.gov/civicax/filebank/blobdload.aspx?blobid=27777" target="_blank">Five year strategic plan on homelessness in Buncombe county</a>
          </p>
        </div>
      </div>
    </div>
    <div className="row">
      <div className="col-sm-12">
        <p>
          Text Block 1: Introductory paragraph/s (short) here about the five year strategic plan, and a quick overview of homelessness challenges, or how performance is measured/evaluated. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.
        </p>
      </div>
    </div>
    <div className="row">
      <div className="col-sm-12">
        <HomelessnessPITSummary />
      </div>
    </div>
    <hr />
    <div className="row">
      <div className="col-sm-12">
        <HomelessnessEnrollment />
      </div>
    </div>
    <hr />
    <div className="row">
      <div className="col-sm-12">
        <HomelessnessTargetPops />
      </div>
    </div>
    <div className="row">
      <div className="col-sm-12">
        <HomelessnessVeterans />
        <HomelessnessVeteransExits />
      </div>
    </div>
    <div className="row">
      <div className="col-sm-12">
        <h3>Flow Diagram</h3>
        <p>
         Text Block 6: Describe how entry and exit determined? Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.
        </p>
        TODO: Flow diagram of entrance points to exit points. Should this section go adjacent to the HMIS enrollments section??
      </div>
    </div>
  </div>
);

HomelessnessSummary.propTypes = {
  location: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};


export default HomelessnessSummary;
