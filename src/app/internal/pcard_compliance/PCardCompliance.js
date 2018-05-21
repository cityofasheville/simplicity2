import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Icon from '../../../shared/Icon';
import { IM_CREDIT_CARD } from '../../../shared/iconConstants';
import PageHeader from '../../../shared/PageHeader';
import ButtonGroup from '../../../shared/ButtonGroup';
import LinkButton from '../../../shared/LinkButton';
import LoadingAnimation from '../../../shared/LoadingAnimation';
import Error from '../../../shared/Error';
import { buildTree } from './pcard_compliance_utilities';
import PCardDaysSunburst from './PCardDaysSunburst';

const PCardCompliance = (props) => {
  if (props.data.loading) {
    return <LoadingAnimation />;
  }
  if (props.data.error) {
    return <Error message={props.data.error.message} />;
  }

  const pcard_statements_status = buildTree(props.data.pcard_statements_status);
  console.log(pcard_statements_status);

  return (
    <div>
      <PageHeader h1="P card compliance" h3="TODO Dept" icon={<Icon path={IM_CREDIT_CARD} size={50} />}>
        <ButtonGroup alignment="">
          <LinkButton pathname="/" positionInGroup={props.location.query.placeSearch ? 'left' : ''} query={{ entities: props.location.query.entities, search: props.location.query.search, hideNavbar: props.location.query.hideNavbar }}>Back</LinkButton>
        </ButtonGroup>
      </PageHeader>
      <div className="row">
        <PCardDaysSunburst data={pcard_statements_status} />
      </div>
    </div>
  );
};

const pCardQuery = gql`
  query pCardQuery($before: String, $after: String) {
    pcard_statements_status (before: $before, after: $after) {
      dept_id
      department
      div_id
      division
      cardholder
      statement_code
      statement_id
      statement_status
      fiscal_year
      fiscal_period
      invoiced_date
      reconciled_date
      days_invoiced_to_reconciled
      approved_date
      days_reconciled_to_approved
      days_since_invoiced
      days_since_reconciled
    }
  }
`;

const PCardComplianceWithData = graphql(pCardQuery, {
  options: ownProps => ({
    variables: {
      before: '2018-05-01',
      after: '2018-04-01', //TODO: generalize
    },
  }),
})(PCardCompliance);

export default PCardComplianceWithData;
