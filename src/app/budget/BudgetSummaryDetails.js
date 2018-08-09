import React from 'react';
import PropTypes from 'prop-types';
import BudgetDetailsTable from './BudgetDetailsTable';
import BudgetDetailsTreemap from './BudgetDetailsTreemap';
import PageHeader from '../../shared/PageHeader';
import ButtonGroup from '../../shared/ButtonGroup';
import LinkButton from '../../shared/LinkButton';
import Icon from '../../shared/Icon';
import { IM_COIN_DOLLAR } from '../../shared/iconConstants';
import { withLanguage } from '../../utilities/lang/LanguageContext';
import { english } from './english';
import { spanish } from './spanish';

const BudgetSummaryDetails = (props) => {
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
    <div>
      <PageHeader
        h1={props.data.budgetParameters.in_budget_season ?
          `${content.proposed_budget} ${parseInt(props.data.budgetParameters.end_year, 10) - 1}-${props.data.budgetParameters.end_year}` : // eslint-disable-line
          `${content.budget} ${parseInt(props.data.budgetParameters.end_year, 10) - 1}-${props.data.budgetParameters.end_year}`} // eslint-disable-line
        externalLinkText={content.full_budget_document}
        externalLink="http://www.ashevillenc.gov/civicax/filebank/blobdload.aspx?blobid=30387"
        dataLinkPath="/budget/data"
        dataLinkText={content.understand_the_budget_data}
        icon={<Icon path={IM_COIN_DOLLAR} size={60} />}
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
            active
          >{content.details}
          </LinkButton>
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

export default withLanguage(BudgetSummaryDetails);
