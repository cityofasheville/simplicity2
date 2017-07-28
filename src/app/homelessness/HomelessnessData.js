import React from 'react';
import { browserHistory } from 'react-router';
import PageHeader from '../../shared/PageHeader';
import ButtonGroup from '../../shared/ButtonGroup';
import Button from '../../shared/Button';
import Icon from '../../shared/Icon';
import { IM_BED } from '../../shared/iconConstants';

const HomelessnessData = () => (
  <div>
    <PageHeader h1="Understand the homelessness data" icon={<Icon path={IM_BED} size={50} />}>
      <ButtonGroup>
        <Button onClick={browserHistory.goBack}>Back</Button>
      </ButtonGroup>
    </PageHeader>
    <div className="row">
      <div className="col-sm-12">
        <p>
          The primary source of information for the Homelessness Data Dashboard is the North Carolina Homeless Management Information System (NC HMIS). The Asheville-Buncombe Continuum of Care participates in this statewide database to measure the needs of homeless persons, coordinate their care and report the outcome of these services.
        </p>
        <p>
          Several local non-profits maintain service records of homeless clients in NC HMIS. These records include emergency shelter stays, housing placement data, and basic demographic details, as well as, sensitive personal information like social security number, date of birth, and diagnosed medical conditions. Agencies are not allowed to collect or share this information without client consent and the data is essential to providing services. For this reason, only aggregate data is reported on this dashboard.
        </p>
        <p>
          Not all homeless service programs in the community use NC HMIS, so the data on this dashboard is currently limited to the organizations who use the database. Additional data and links to other organizations will be included in future dashboard updates with the goal of understanding homelessness and help people secure safe and affordable housing.
        </p>
      </div>
    </div>
  </div>
);

export default HomelessnessData;
