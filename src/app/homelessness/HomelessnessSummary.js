import React from 'react';
import PropTypes from 'prop-types';
import HomelessnessCounts from './HomelessnessCounts';
import HomelessnessDemographics from './HomelessnessDemographics';
import HomelessnessEnrollment from './HomelessnessEnrollment';
import PageHeader from '../../shared/PageHeader';
import ButtonGroup from '../../shared/ButtonGroup';
import LinkButton from '../../shared/LinkButton';
import Icon from '../../shared/Icon';
import { IM_BED } from '../../shared/iconConstants';

const HomelessnessSummary = props => (
  <div>
    <PageHeader h1="Homelessness in Asheville / Buncombe County" dataLinkPath="/homelessness/data" externalLink="http://www.ashevillenc.gov/civicax/filebank/blobdload.aspx?blobid=27777" externalLinkText="Five Year Strategic Plan on Homelessness in Buncombe County" icon={<Icon path={IM_BED} size={50} />}>
      <ButtonGroup>
        <LinkButton pathname="/homelessness" query={{ entity: props.location.query.entity, id: props.location.query.id, label: props.location.query.label, hideNavbar: props.location.query.hideNavbar }} active positionInGroup="left">Summary</LinkButton>
        <LinkButton pathname="/homelessness/veterans" query={{ entity: props.location.query.entity, id: props.location.query.id, label: props.location.query.label, hideNavbar: props.location.query.hideNavbar }} positionInGroup="right">Veterans</LinkButton>
      </ButtonGroup>
    </PageHeader>
    <div className="row">
      <div className="col-sm-12">
        <HomelessnessCounts />
      </div>
    </div>
    <hr />
    <div className="row">
      <div className="col-sm-12">
        <HomelessnessDemographics />
      </div>
    </div>
    <hr />
    <div className="row">
      <div className="col-sm-12">
        <h3>What is being done about homelessness?</h3>
        <p>
          The Homeless Initiative Advisory Committee (HIAC), a joint committee of the City of Asheville and Buncombe County in North Carolina, completed a Five Year Strategic Plan on Homelessness for the Buncombe County Continuum of Care (NC-501) following a year of intensive planning and collaboration throughout the entire community. The City of Asheville and Buncombe County unanimously voted to adopt the Asheville-Buncombe Homeless Initiative Advisory Committee’s <a className="inText" href="http://www.ashevillenc.gov/civicax/filebank/blobdload.aspx?blobid=27777" target="_blank">Five Year Strategic Plan on Homelessness in Buncombe County</a> in the spring of 2017.
        </p>
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
