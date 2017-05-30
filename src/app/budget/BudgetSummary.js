import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import SummaryUse from './SummaryUse';
import SummaryDepartments from './SummaryDepartments';
import SummaryCashFlow from './SummaryCashFlow';

const BudgetSummary = props => (
  <div>
    <div className="row">
      <div className="col-sm-12">
        <h1>
          Proposed Budget 2017-18
          <div className="btn-group pull-right" style={{ marginLeft: '10px' }}>
            <Link to={{ pathname: '/budget', query: { entity: props.location.query.entity, id: props.location.query.id, label: props.location.query.label, hideNavbar: props.location.query.hideNavbar } }}>
              <button className="btn btn-primary active" style={{ borderTopRightRadius: '0px', borderBottomRightRadius: '0px' }}>Summary</button>
            </Link>
            <Link to={{ pathname: '/budget/details', query: { entity: props.location.query.entity, id: props.location.query.id, label: props.location.query.label, mode: props.location.query.mode || 'expenditures', hideNavbar: props.location.query.hideNavbar } }}>
              <button className="btn btn-primary" style={{ borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px' }}>Details</button>
            </Link>
          </div>
        </h1>
        <div className="pull-left">
          <a className="inText" href="http://www.ashevillenc.gov/civicax/filebank/blobdload.aspx?blobid=27587" target="_blank">Full budget document</a>
        </div>
      </div>
    </div>
    <div className="row">
      <div className="col-sm-6">
        <SummaryUse />
      </div>
      <div className="col-sm-6">
        <SummaryDepartments />
      </div>
    </div>
    <hr />
    <SummaryCashFlow />
  </div>
);

BudgetSummary.propTypes = {
  location: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

export default BudgetSummary;
