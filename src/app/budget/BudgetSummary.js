import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import SummaryUse from './SummaryUse';
import SummaryDepartments from './SummaryDepartments';
import SummaryCashFlow from './SummaryCashFlow';
import PageHeader from '../../shared/PageHeader';
import ButtonGroup from '../../shared/ButtonGroup';
import LinkButton from '../../shared/LinkButton';
import Icon from '../../shared/Icon';
import { IM_COIN_DOLLAR } from '../../shared/iconConstants';
import LoadingAnimation from '../../shared/LoadingAnimation';
import Error from '../../shared/Error';


const BudgetSummary = (props) => {
  if (props.data.loading) {
    return <LoadingAnimation />;
  }
  if (props.data.error) {
    return <Error message={props.data.error.message} />;
  }

  return (
    <div className="template__budget-summary">
      <PageHeader
        h1={props.data.budgetParameters.in_budget_season ? `Proposed Budget ${parseInt(props.data.budgetParameters.end_year, 10) - 1}-${props.data.budgetParameters.end_year}` : `Budget ${parseInt(props.data.budgetParameters.end_year, 10) - 1}-${props.data.budgetParameters.end_year}`}
        externalLinkText="Full budget document"
        externalLink="http://www.ashevillenc.gov/civicax/filebank/blobdload.aspx?blobid=30387"
        dataLinkPath="/budget/data"
        icon={<Icon
          path={IM_COIN_DOLLAR}
          size={60}
        />}
      >
        <ButtonGroup alignment="">
          <LinkButton pathname="/budget" query={{ entity: props.location.query.entity, id: props.location.query.id, label: props.location.query.label, hideNavbar: props.location.query.hideNavbar }} active positionInGroup="left">Summary</LinkButton>
          <LinkButton pathname="/budget/details" query={{ entity: props.location.query.entity, id: props.location.query.id, label: props.location.query.label, mode: props.location.query.mode || 'expenditures', hideNavbar: props.location.query.hideNavbar }} positionInGroup="right">Details</LinkButton>
        </ButtonGroup>
      </PageHeader>
      <div className="row">
        <div className="col-md-6">
          <SummaryUse />
        </div>
        <div className="col-md-6">
          <SummaryDepartments />
        </div>
        <div tabIndex={0} className="note text-center">Bar chart totals exclude interfund transfers</div>
      </div>
      <hr />
      <SummaryCashFlow />
    </div>
  );
};

BudgetSummary.propTypes = {
  location: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

const getBudgetParametersQuery = gql`
  query getBudgetParametersQuery {
    budgetParameters {
      start_year
      end_year
      in_budget_season
    }
  }
`;

export default graphql(getBudgetParametersQuery, {})(BudgetSummary);
