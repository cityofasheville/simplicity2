import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import HomelessnessEnrollment from './HomelessnessEnrollment';
import HomelessnessDataCompleteness from './HomelessnessDataCompleteness';
import HomelessnessVeteransExits from './HomelessnessVeteransExits';

const HomelessnessDetails = props => (
  <div>
    <div className="row">
      <div className="col-sm-12">
        <h1>
          <div className="btn-group pull-right" style={{ marginLeft: '10px' }}>
            <Link to={{ pathname: '/homelessness', query: { entity: props.location.query.entity, id: props.location.query.id, label: props.location.query.label, hideNavbar: props.location.query.hideNavbar } }}>
              <button className="btn btn-primary" style={{ borderTopRightRadius: '0px', borderBottomRightRadius: '0px' }}>Summary</button>
            </Link>
            <Link to={{ pathname: '/homelessness/veterans', query: { entity: props.location.query.entity, id: props.location.query.id, label: props.location.query.label, hideNavbar: props.location.query.hideNavbar } }}>
              <button className="btn btn-primary" style={{ borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px', borderTopRightRadius: '0px', borderBottomRightRadius: '0px' }}>Veterans</button>
            </Link>
            <Link to={{ pathname: '/homelessness/details', query: { entity: props.location.query.entity, id: props.location.query.id, label: props.location.query.label, hideNavbar: props.location.query.hideNavbar } }}>
              <button className="btn btn-primary active" style={{ borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px' }}>Details</button>
            </Link>
          </div>
          Homelessness in Asheville/Buncombe County
        </h1>
        <div className="pull-left">
          <a className="inText" href="http://www.ashevillenc.gov/civicax/filebank/blobdload.aspx?blobid=27777" target="_blank">Five year strategic plan on homelessness in Buncombe county</a>
        </div>
      </div>
    </div>
    <div className="row">
      <div className="col-sm-12">
        <HomelessnessEnrollment />
      </div>
    </div>
    <hr />
    <div className="row">
      <div className="col-sm-12">
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
    <div className="row">
      <div className="col-sm-12">
        <h3>Data Completeness Report Card</h3>
        <p>
          Explanatory text about what data completeness is, how it is evaluated, and what it means.
        </p>
        <HomelessnessDataCompleteness />
      </div>
    </div>
  </div>
);

HomelessnessDetails.propTypes = {
  location: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

export default HomelessnessDetails;
