import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
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
import { withLanguage } from '../../utilities/lang/LanguageContext';
import { english } from './english';
import { spanish } from './spanish';

const GET_BUDGET_PARAMETERS = gql`
  query getBudgetParametersQuery {
    budgetParameters {
      start_year
      end_year
      in_budget_season
    }
  }
`;

const BudgetSummary = props => (
  <Query
    query={GET_BUDGET_PARAMETERS}
  >
    {({ loading, error, data }) => {
      if (loading) return <LoadingAnimation />;
      if (error) return <Error message={error.message} />;

      // set language
      let content;
      switch (props.language.language) {
        case 'Spanish':
          content = spanish;
          break;
        default:
          content = english;
      }
      return (
        <div className="template__budget-summary">
          <PageHeader
            h1={data.budgetParameters.in_budget_season ?
              `${content.proposed_budget} ${parseInt(data.budgetParameters.end_year, 10) - 1}-${data.budgetParameters.end_year}` : // eslint-disable-line
              `${content.budget} ${parseInt(data.budgetParameters.end_year, 10) - 1}-${data.budgetParameters.end_year}` // eslint-disable-line
            }
            externalLinkText={content.full_budget_document}
            externalLink="http://www.ashevillenc.gov/civicax/filebank/blobdload.aspx?blobid=30387"
            dataLinkPath="/budget/data"
            dataLinkText={content.understand_the_budget_data}
            icon={<Icon
              path={IM_COIN_DOLLAR}
              size={60}
            />}
          >
            <ButtonGroup alignment="">
              <LinkButton
                pathname="/budget"
                query={
                  {
                    entity: props.location.query.entity,
                    id: props.location.query.id,
                    label: props.location.query.label,
                    hideNavbar: props.location.query.hideNavbar
                  }
                }
                active
                positionInGroup="left"
              >{content.summary}
              </LinkButton>
              <LinkButton
                pathname="/budget/details"
                query={
                  {
                    entity: props.location.query.entity,
                    id: props.location.query.id,
                    label: props.location.query.label,
                    mode: props.location.query.mode || 'expenditures',
                    hideNavbar: props.location.query.hideNavbar
                  }
                }
                positionInGroup="right"
              >{content.details}
              </LinkButton>
            </ButtonGroup>
          </PageHeader>
          <div className="row">
            <div className="col-md-6">
              <SummaryUse />
            </div>
            <div className="col-md-6">
              <SummaryDepartments />
            </div>
            <div tabIndex={0} className="note text-center">{content.bar_chart_note}</div>
          </div>
          <hr />
          <SummaryCashFlow />
        </div>
      );
    }}
  </Query>
);

export default withLanguage(BudgetSummary);
