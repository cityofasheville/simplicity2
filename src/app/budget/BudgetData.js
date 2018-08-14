import React from 'react';
import { browserHistory } from 'react-router';
import PageHeader from '../../shared/PageHeader';
import ButtonGroup from '../../shared/ButtonGroup';
import Button from '../../shared/Button';
import Icon from '../../shared/Icon';
import { IM_COIN_DOLLAR } from '../../shared/iconConstants';
import { withLanguage } from '../../utilities/lang/LanguageContext';
import { english } from './english';
import { spanish } from './spanish';

const BudgetData = (props) => {
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
        h1={content.understand_the_budget_data}
        icon={<Icon path={IM_COIN_DOLLAR} size={60} />}
      >
        <ButtonGroup>
          <Button onClick={browserHistory.goBack}>{content.back}</Button>
        </ButtonGroup>
      </PageHeader>
      <div className="row">
        <div className="col-sm-12">
          <p>{content.budget_data_explanation}</p>
        </div>
      </div>
    </div>
  );
};

export default withLanguage(BudgetData);
