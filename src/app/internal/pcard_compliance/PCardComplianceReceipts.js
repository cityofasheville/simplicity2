import React from 'react';
import { graphql } from 'react-apollo';
import moment from 'moment';
import gql from 'graphql-tag';
import Icon from '../../../shared/Icon';
import { IM_CREDIT_CARD } from '../../../shared/iconConstants';
import PageHeader from '../../../shared/PageHeader';
import ButtonGroup from '../../../shared/ButtonGroup';
import LinkButton from '../../../shared/LinkButton';
import LoadingAnimation from '../../../shared/LoadingAnimation';
import Error from '../../../shared/Error';
import { buildReceiptsTree, findTop } from './pcard_compliance_utilities';
import PCardReceiptsCirclePack from './PCardReceiptsCirclePack';
import PCardReceiptsTable from './PCardReceiptsTable';
import { refreshLocation } from '../../../utilities/generalUtilities';

const getStartDate = numDays => (
  moment.utc().subtract(numDays, 'd').format('YYYY-MM-DD')
);

const PCardComplianceReceipts = (props) => {
  const getNewUrlParams = (nodePath, time) => {
    const dept = document.getElementById('department');
    return {
      nodePath,
      time,
      dept: dept.options[dept.selectedIndex].getAttribute('name'),
    };
  };

  if (props.data.loading) {
    return <LoadingAnimation />;
  }
  if (props.data.error) {
    return <Error message={props.data.error.message} />;
  }

  const pcard_transactions = buildReceiptsTree(props.data.pcard_transactions);
  const filteredTransactions = findTop(pcard_transactions, props.location.query.nodePath || 'root_01')

  return (
    <div>
      <PageHeader h1="P card compliance" icon={<Icon path={IM_CREDIT_CARD} size={50} />}>
        <ButtonGroup alignment="">
          <LinkButton pathname="/pcard_compliance" positionInGroup="left" query={{ nodePath: props.location.query.nodePath || 'root_01', time: props.location.query.time || '30', dept: props.location.query.dept || 'Administration Services' }}>Reconcilation</LinkButton>
          <LinkButton pathname="/pcard_compliance/receipts" positionInGroup="right" active query={{ nodePath: props.location.query.nodePath || 'root_01', time: props.location.query.time || '30', dept: props.location.query.dept || 'Administration Services' }}>Receipts</LinkButton>
        </ButtonGroup>
      </PageHeader>
      <div>
        <div className="data-filters__container">
          <div className="data-filters__inner">
            <div className="form-group">
              <label htmlFor="department" className="control-label">view:</label>
              <div>
                <select
                  name="department"
                  id="department"
                  className="form-control"
                  onChange={(event) => {
                    refreshLocation(getNewUrlParams(event.target.value, document.getElementById('time').value), props.location);
                  }}
                >
                  {
                    pcard_transactions.children.map((dept) => {
                      if (dept.key !== null) {
                        return <option value={dept.path} name={dept.name} key={dept.key} selected={props.location.query.dept === dept.name}>{dept.name}</option>;
                      }
                      return null;
                    })
                  }
                </select>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="time" className="control-label">
                during:
              </label>
              <div>
                <select
                  name="time"
                  id="time"
                  className="form-control"

                  onChange={(event) => {
                  refreshLocation(getNewUrlParams(document.getElementById('department').value, event.target.value), props.location);
                }}
              >
                  <option value="30" name="days" selected={props.location.query.time === '30'}>the last 30 days</option>
                  <option value="60" name="days" selected={props.location.query.time === '60'}>the last 60 days</option>
                  <option value="90" name="days" selected={props.location.query.time === '90'}>the last 90 days</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          marginTop: '20px',
        }}
      >
        {/* TODO - instead of root use the user's department */}
        <PCardReceiptsCirclePack data={{ key: 'root', children: filteredTransactions, dept: props.location.query.dept || 'Multiple Departments' }} />
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
              style={{ height: '250px', background: '#f1f1f1', flexBasis: '80%', paddingLeft: '5px' }}
            >
              <p>Hover over the circlepack visualization to see details.</p>
            </div>
            <PCardReceiptsTable data={filteredTransactions} />
          </div>
        </div>
      </div>
    </div>
  );
};

const pCardTransactionQuery = gql`
  query pCardTransactionQuery($before: String, $after: String) {
    pcard_transactions  (before: $before, after: $after) {
      dept_id
      department
      div_id
      division
      cardholder
      statement_id
      charge_date
      amount
      vendor_id
      vendor_name
      description
      receipt
    }
  }
`;

const PCardComplianceReceiptsWithData = graphql(pCardTransactionQuery, {
  options: ownProps => ({
    variables: {
      before: moment.utc().format('YYYY-MM-DD'),
      after: getStartDate(ownProps.location.query.time ? parseInt(ownProps.location.query.time, 10) : 30),
    },
  }),
})(PCardComplianceReceipts);

export default PCardComplianceReceiptsWithData;
