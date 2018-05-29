import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Icon from '../../../shared/Icon';
import { IM_CREDIT_CARD } from '../../../shared/iconConstants';
import PageHeader from '../../../shared/PageHeader';
import ButtonGroup from '../../../shared/ButtonGroup';
import LinkButton from '../../../shared/LinkButton';
import LoadingAnimation from '../../../shared/LoadingAnimation';
import Error from '../../../shared/Error';
import { buildTree, findTop } from './pcard_compliance_utilities';
import PCardDaysCirclePack from './PCardDaysCirclePack';
import PCardDaysTable from './PCardDaysTable';
import { refreshLocation } from '../../../utilities/generalUtilities';

const PCardCompliance = (props) => {
  const getNewUrlParams = (nodePath, time) => (
    {
      nodePath,
      time,
    }
  );

  if (props.data.loading) {
    return <LoadingAnimation />;
  }
  if (props.data.error) {
    return <Error message={props.data.error.message} />;
  }

  const pcard_statements_status = buildTree(props.data.pcard_statements_status);
  const filteredStatements = findTop(pcard_statements_status, 'root_03');

  return (
    <div>
      <PageHeader h1="P card compliance" icon={<Icon path={IM_CREDIT_CARD} size={50} />}>
        <ButtonGroup alignment="">
          <LinkButton pathname="/" positionInGroup={props.location.query.placeSearch ? 'left' : ''} query={{ entities: props.location.query.entities, search: props.location.query.search, hideNavbar: props.location.query.hideNavbar }}>Back</LinkButton>
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
                  selected={props.location.query.dept}
                  onChange={(event) => {
                    refreshLocation(getNewUrlParams(event.target.value, document.getElementById('time').value), props.location);
                  }}
                >
                  {
                    pcard_statements_status.children.map((dept) => {
                      if (dept.key !== null) {
                        return <option value={dept.path} name={dept.name} key={dept.key}>{dept.name}</option>;
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
                <select name="time" id="time" className="form-control" onChange={(event) => {
                  refreshLocation(getNewUrlParams(document.getElementById('department').value, event.target.value), props.location);
                }}>
                  <option value="30" name="time">the last 30 days</option>
                  <option value="60" name="time">the last 60 days</option>
                  <option value="90" name="time">the last 90 days</option>
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
        <PCardDaysCirclePack data={{ key: 'root', children: findTop(pcard_statements_status, props.location.query.nodePath || 'root') }} />
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
            <PCardDaysTable data={findTop(pcard_statements_status, props.location.query.nodePath || 'root')} />
          </div>
        </div>
      </div>
    </div>
  );
};

const pCardQuery = gql`
  query pCardQuery($before: String, $after: String) {
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

const PCardComplianceWithData = graphql(pCardQuery, {
  options: ownProps => ({
    variables: {
      before: '2018-05-24',
      after: '2017-04-24', //TODO: generalize
    },
  }),
})(PCardCompliance);

export default PCardComplianceWithData;
