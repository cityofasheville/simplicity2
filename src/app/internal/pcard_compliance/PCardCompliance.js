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
import { buildTree, findTop } from './pcard_compliance_utilities';
import PCardDaysCirclePack from './PCardDaysCirclePack';
import PCardDaysTable from './PCardDaysTable';

const PCardCompliance = (props) => {
  if (props.data.loading) {
    return <LoadingAnimation />;
  }
  if (props.data.error) {
    return <Error message={props.data.error.message} />;
  }

  const pcard_statements_status = buildTree(props.data.pcard_statements_status);
  const filteredStatements = findTop(pcard_statements_status, 'root_03');

  return (
    <div>
      <PageHeader h1="P card compliance" icon={<Icon path={IM_CREDIT_CARD} size={50} />}>
        <ButtonGroup alignment="">
          <LinkButton pathname="/" positionInGroup={props.location.query.placeSearch ? 'left' : ''} query={{ entities: props.location.query.entities, search: props.location.query.search, hideNavbar: props.location.query.hideNavbar }}>Back</LinkButton>
        </ButtonGroup>
      </PageHeader>
      <div className="row">
        <div className="col-sm-12">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            <PCardDaysCirclePack data={{ key: 'root', children: filteredStatements }} title={'Finance'} />
            <div
              style={{
                flexBasis: '65%',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                }}
              >
                <div
                  style={{ height: '250px', background: '#f1f1f1', flexBasis: '80%' }}
                >
                  Hover over the circlepack visualization to see breakdowns.
                </div>
                <PCardDaysTable data={filteredStatements} />
              </div>
            </div>
          </div>
        </div>
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
      after: '2017-04-01', //TODO: generalize
    },
  }),
})(PCardCompliance);

export default PCardComplianceWithData;
