import React from 'react';
import SimpleReactTable from '../../../components/SimpleReactTable';

const BudgetDetailsTable = props => (
  <div className="row">
    <div className="col-sm-12">
      <h3>Table of expenditures</h3>
      <div style={{ marginBottom: '15px' }}>
        Some explanatory text here describing something important to the users that is relevant to know, that we want to communicate to them about this particular chart.<br />
        Click the triangles at left to expand rows for more detail.
      </div>
      <SimpleReactTable />
    </div>
  </div>
);

BudgetDetailsTable.propTypes = {
  data: React.PropTypes.array, // eslint-disable-line react/forbid-prop-types
};

BudgetDetailsTable.defaultProps = {
  data: [],
};

export default BudgetDetailsTable;


