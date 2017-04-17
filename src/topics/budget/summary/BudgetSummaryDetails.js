import React from 'react';
import { Link } from 'react-router';
import BudgetDetailsTable from './BudgetDetailsTable';
import BudgetDetailsTreemap from './BudgetDetailsTreemap';

const testFunc = (args) => {
  console.log(args);
};

const BudgetSummaryDetails = props => (
  <div>
    <div className="row">
      <div className="col-sm-12">
        <h1>
          Budget
          <div className="btn-group pull-right" style={{ marginLeft: '10px' }}>
            <Link to={{ pathname: '/topics/budget', query: { entity: props.location.query.entity, id: props.location.query.id, label: props.location.query.label, hideNavbar: props.location.query.hideNavbar } }}>
              <button className="btn btn-primary" style={{ borderTopRightRadius: '0px', borderBottomRightRadius: '0px' }}>Summary</button>
            </Link>
            <Link to={{ pathname: '/topics/budget/details', query: { entity: props.location.query.entity, id: props.location.query.id, label: props.location.query.label, mode: props.location.query.mode || 'expenditures', hideNavbar: props.location.query.hideNavbar } }}>
              <button className="btn btn-primary active" style={{ borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px' }}>Details</button>
            </Link>
          </div>
          <div className="pull-right">
            <div className="btn-group">
              <Link to={{ pathname: '/topics/budget/details', query: { entity: props.location.query.entity, id: props.location.query.id, label: props.location.query.label, mode: 'expenditures', hideNavbar: props.location.query.hideNavbar } }}>
                <button className={props.location.query.mode !== 'revenue' ? 'btn btn-primary active' : 'btn btn-primary'} style={{ borderTopRightRadius: '0px', borderBottomRightRadius: '0px' }}>Expenditures</button>
              </Link>
              <Link to={{ pathname: '/topics/budget/details', query: { entity: props.location.query.entity, id: props.location.query.id, label: props.location.query.label, mode: 'revenue', hideNavbar: props.location.query.hideNavbar } }}>
                <button className={props.location.query.mode === 'revenue' ? 'btn btn-primary active' : 'btn btn-primary'} style={{ borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px' }}>Revenue</button>
              </Link>
            </div>
          </div>
        </h1>
      </div>
    </div>
    <BudgetDetailsTreemap diveDeeper={testFunc} categoryType="department" />
    <hr style={{ marginTop: '60px' }}></hr>
    <BudgetDetailsTable />
  </div>
);

BudgetSummaryDetails.propTypes = {
  location: React.PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

export default BudgetSummaryDetails;
