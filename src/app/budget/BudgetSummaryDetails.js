import React from 'react';
import PropTypes from 'prop-types';
import { Link, browserHistory } from 'react-router';
import BudgetDetailsTable from './BudgetDetailsTable';
import BudgetDetailsTreemap from './BudgetDetailsTreemap';
import PageHeader from '../../shared/PageHeader';
import ButtonGroup from '../../shared/ButtonGroup';
import LinkButton from '../../shared/LinkButton';

const BudgetSummaryDetails = (props) => {
  const refreshLocation = (value) => {
    browserHistory.push([props.location.pathname, '?entity=', props.location.query.entity, '&id=', props.location.query.id, '&label=', props.location.query.label, '&mode=', value, '&hideNavbar=', props.location.query.hideNavbar].join(''));
  };

  return (
    <div>
      <PageHeader h1="Proposed Budget 2017-2018" externalLinkText="Full budget document" externalLink="http://www.ashevillenc.gov/civicax/filebank/blobdload.aspx?blobid=27587">
        <ButtonGroup>
          <LinkButton pathname="/budget" query={{ entity: props.location.query.entity, id: props.location.query.id, label: props.location.query.label, hideNavbar: props.location.query.hideNavbar }} positionInGroup="left" text="Summary" />
          <LinkButton pathname="/budget/details" query={{ entity: props.location.query.entity, id: props.location.query.id, label: props.location.query.label, mode: props.location.query.mode || 'expenditures', hideNavbar: props.location.query.hideNavbar }} positionInGroup="right" active text="Details" />
        </ButtonGroup>
      </PageHeader>
      <BudgetDetailsTreemap categoryType="department" {...props} radioCallback={refreshLocation} />
      <hr style={{ marginTop: '20px' }}></hr>
      <BudgetDetailsTable {...props} radioCallback={refreshLocation} />
    </div>
  );
};

BudgetSummaryDetails.propTypes = {
  location: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

export default BudgetSummaryDetails;
