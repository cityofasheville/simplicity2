import React from 'react';
import { browserHistory } from 'react-router';
import PageHeader from '../../shared/PageHeader';
import ButtonGroup from '../../shared/ButtonGroup';
import Button from '../../shared/Button';
import Icon from '../../shared/Icon';
import { IM_COIN_DOLLAR } from '../../shared/iconConstants'

const BudgetData = () => (
  <div>
    <PageHeader h1="Understand the budget data" icon={<Icon path={IM_COIN_DOLLAR} size={60} />}>
      <ButtonGroup>
        <Button onClick={browserHistory.goBack}>Back</Button>
      </ButtonGroup>
    </PageHeader>
    <div className="row">
      <div className="col-sm-12">
        <p>Some explanation of the data and limitations of the data, and some links to more detailed reports</p>
      </div>
    </div>
  </div>
);

export default BudgetData;
