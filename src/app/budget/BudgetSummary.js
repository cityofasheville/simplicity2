import React from 'react';
import PropTypes from 'prop-types';
import SummaryUse from './SummaryUse';
import SummaryDepartments from './SummaryDepartments';
import SummaryCashFlow from './SummaryCashFlow';
import PageHeader from '../../shared/PageHeader';
import ButtonGroup from '../../shared/ButtonGroup';
import LinkButton from '../../shared/LinkButton';
import Icon from '../../shared/Icon';
import { IM_COIN_DOLLAR } from '../../shared/iconConstants';

const BudgetSummary = props => (
  <div>
    <PageHeader h1="Proposed Budget 2017-2018" externalLinkText="Full budget document" externalLink="http://www.ashevillenc.gov/civicax/filebank/blobdload.aspx?blobid=27587" dataLinkPath="/budget/data" icon={<Icon path={IM_COIN_DOLLAR} size={60} />}>
      <ButtonGroup>
        <LinkButton pathname="/budget" query={{ entity: props.location.query.entity, id: props.location.query.id, label: props.location.query.label, hideNavbar: props.location.query.hideNavbar }} active positionInGroup="left">Summary</LinkButton>
        <LinkButton pathname="/budget/details" query={{ entity: props.location.query.entity, id: props.location.query.id, label: props.location.query.label, mode: props.location.query.mode || 'expenditures', hideNavbar: props.location.query.hideNavbar }} positionInGroup="right">Details</LinkButton>
      </ButtonGroup>
    </PageHeader>
    <div className="row">
      <div className="col-sm-6">
        <SummaryUse />
      </div>
      <div className="col-sm-6">
        <SummaryDepartments />
      </div>
    </div>
    <hr />
    <SummaryCashFlow />
  </div>
);

BudgetSummary.propTypes = {
  location: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

export default BudgetSummary;
