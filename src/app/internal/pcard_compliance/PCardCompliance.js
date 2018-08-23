import React from 'react';
import gql from 'graphql-tag';
import { graphql, compose, Query, withApollo } from 'react-apollo';
import moment from 'moment';
import { refreshLocation } from '../../../utilities/generalUtilities';
import PageHeader from '../../../shared/PageHeader';
import ButtonGroup from '../../../shared/ButtonGroup';
import LinkButton from '../../../shared/LinkButton';
import LoadingAnimation from '../../../shared/LoadingAnimation';
import Error from '../../../shared/Error';
import Icon from '../../../shared/Icon';
import { IM_CREDIT_CARD } from '../../../shared/iconConstants';
import { buildTree, findTop } from './pcard_compliance_utilities';
import PCardDaysCirclePack from './PCardDaysCirclePack';
import PCardDaysTable from './PCardDaysTable';
import { getUser } from '../../../utilities/auth/graphql/authQueries';

const getStartDate = numDays => (
  moment.utc().subtract(numDays, 'd').format('YYYY-MM-DD')
);

const GET_PCARDSTATEMENTS = gql`
  query pcard_statements_status($before: String, $after: String) {
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

const PCardCompliance = props => (
  <Query
    query={GET_PCARDSTATEMENTS}
    variables={{
      before: moment.utc().format('YYYY-MM-DD'),
      after: getStartDate(props.location.query.time ? parseInt(props.location.query.time, 10) : 30),
    }}
  >
    {({ loading, error, data }) => {
      if (loading) return <LoadingAnimation />;
      if (error) return <Error message={error.message} />;

      const getNewUrlParams = (nodePath, time) => {
        const dept = document.getElementById('department');
        return {
          nodePath,
          time,
          dept: dept.options[dept.selectedIndex].getAttribute('name'),
        };
      };

      const statements = buildTree(data.pcard_statements_status);
      const filteredStatements = findTop(statements, props.location.query.nodePath || 'root_01');

      return (
        <div>
          <PageHeader h1="P card compliance" icon={<Icon path={IM_CREDIT_CARD} size={50} />}>
            <ButtonGroup alignment="">
              <LinkButton pathname="/pcard_compliance" positionInGroup="left" active query={{ nodePath: props.location.query.nodePath || 'root_01', time: props.location.query.time || '30', dept: props.location.query.dept || 'Administration Services' }}>Reconcilation</LinkButton>
              <LinkButton pathname="/pcard_compliance/receipts" positionInGroup="right" query={{ nodePath: props.location.query.nodePath || 'root_01', time: props.location.query.time || '30', dept: props.location.query.dept || 'Administration Services' }}>Receipts</LinkButton>
            </ButtonGroup>
          </PageHeader>
          <div>
            <div className="data-filters__container">
              <div className="data-filters__inner">
                <div className="form-group">
                  <label htmlFor="department" className="control-label">view:</label>
                  <select
                    name="department"
                    id="department"
                    className="form-control"
                    onChange={(event) => {
                      refreshLocation(getNewUrlParams(event.target.value, document.getElementById('time').value), props.location);
                    }}
                  >
                    {
                      statements.children.map((dept) => {
                        if (dept.key !== null) {
                          return <option value={dept.path} name={dept.name} key={dept.key} selected={props.location.query.dept === dept.name}>{dept.name}</option>;
                        }
                        return null;
                      })
                    }
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="time" className="control-label">
                    during:
                  </label>
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
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              marginTop: '20px',
            }}
          >
            {/* TODO - instead of root use the user's department */}
            <PCardDaysCirclePack data={{ key: 'root', children: filteredStatements, dept: props.location.query.dept || 'Multiple Departments' }} />
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
                  style={{
                    height: '250px',
                    background: '#f1f1f1',
                    flexBasis: '80%',
                    paddingLeft: '5px',
                  }}
                >
                  <p>Hover over the circlepack visualization to see details.</p>
                </div>
                <PCardDaysTable data={filteredStatements} />
              </div>
            </div>
          </div>
        </div>
      );
    }}
  </Query>
);

// TODO: this part should NOT be necessary!!
// should be able to do user @client in the Query component query... could be artefact of
// how overall architecture is still setup half 'old' apollo... ??
// redo it all with the 'new' apollo way and the schema and then should
// in theory no longer have to manually wrap this comonent in withApollo...
const PCardComplianceComposed = compose(
  graphql(getUser, {
    props: ({ data: { user } }) => ({
      user,
    }),
  })
)(PCardCompliance);

export default withApollo(PCardComplianceComposed);
