import React from 'react';
import Treemap from '../../../components/Treemap';

const data = [
  { name: 'Salaries & Wages', size: 122009, amount: '$61,574,371' },
  { name: 'Fringe Benefits', size: 49485, amount: '$24,973,691' },
  { name: 'Operating Costs', size: 91816, amount: '$46,337,004' },
  { name: 'Debt Service', size: 24066, amount: '$12,145,694' },
  { name: 'Capital Outlay', size: 32621, amount: '$16,463,056' },
];

const testFunc = (args) => {
  console.log(args.name);
};

const BudgetSummary = props => (
  <div>
    <div className="row">
      <h1 className="col-xs-6">Budget</h1>
    </div>
    <Treemap data={data} diveDeeper={testFunc} />
  </div>
);

BudgetSummary.propTypes = {

};

export default BudgetSummary;
