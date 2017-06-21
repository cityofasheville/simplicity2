import React from 'react';
import PropTypes from 'prop-types';
import BudgetDetailsTable from './BudgetDetailsTable';
import BudgetDetailsTreemap from './BudgetDetailsTreemap';
import PageHeader from '../../shared/PageHeader';
import ButtonGroup from '../../shared/ButtonGroup';
import LinkButton from '../../shared/LinkButton';

const BudgetSummaryDetails = (props) => {
  return (
    <div>
      <PageHeader h1="Proposed Budget 2017-2018" externalLinkText="Full budget document" externalLink="http://www.ashevillenc.gov/civicax/filebank/blobdload.aspx?blobid=27587" dataLinkPath="/budget/data">
        <ButtonGroup>
          <LinkButton pathname="/budget" query={{ entity: props.location.query.entity, id: props.location.query.id, label: props.location.query.label, hideNavbar: props.location.query.hideNavbar }} positionInGroup="left" text="Summary" />
          <LinkButton pathname="/budget/details" query={{ entity: props.location.query.entity, id: props.location.query.id, label: props.location.query.label, mode: props.location.query.mode || 'expenditures', hideNavbar: props.location.query.hideNavbar }} positionInGroup="right" active text="Details" />
        </ButtonGroup>
      </PageHeader>
      <BudgetDetailsTreemap categoryType="department" {...props} />
      <hr style={{ marginTop: '20px' }}></hr>
      <BudgetDetailsTable {...props} />
    </div>
  );
};

BudgetSummaryDetails.propTypes = {
  location: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

export default BudgetSummaryDetails;
