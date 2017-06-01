import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import HomelessnessPITSummary from './HomelessnessPITSummary';
import HomelessnessEnrollment from './HomelessnessEnrollment';
import HomelessnessTargetPops from './HomelessnessTargetPops';
import HomelessnessLivingSituation from './HomelessnessLivingSituation';

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
          There could be an introductory paragraph here about the homelessness intiative work, and a quick overview of homelessness challenges, or how performance is measured/evaluated.
        </p>
      </div>
    </div>
    <div className="row">
      <div className="col-sm-12">
        <h3>Point-in-Time Counts</h3>
        <p>
          We could add some explanatory / introductory text here, like what the PIT is and when it is done, why it is important, so that users can better understand the visualization. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.
        </p>
        <HomelessnessPITSummary />
      </div>
    </div>
    <hr />
    <div className="row">
      <div className="col-sm-12">
        <h3>Homelessness over the last 12 years by living situation</h3>
        <p>
          We could add some explanatory text here. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.
        </p>
        <HomelessnessLivingSituation />
      </div>
    </div>
    <hr />
    <div className="row">
      <div className="col-sm-12">
        <h3>Homelessness over the last 12 years: Target Populations</h3>
        <p>
          We could add some explanatory text here, like what are the target populations, why are these the target populations, etc. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.
        </p>
        <HomelessnessTargetPops />
      </div>
    </div>
    <hr />
    <div className="row">
      <div className="col-sm-12">
        <h3>HMIS</h3>
        <p>
          We could add some explanatory text here, like what the HMIS, what are HMIS enrollments, what the change over time tells us, etc. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.
        </p>
        <HomelessnessEnrollment />
      </div>
    </div>
  </div>
);

HomelessnessSummary.propTypes = {
  location: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};


export default HomelessnessSummary;
