/**
*
* GqlTest
*
*/

import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import TopicContainerPage from '../../../../containers/TopicContainerPage/topicContainerPage';

class DevelopmentSLADashboard extends React.Component { // eslint-disable-line react/prefer-stateless-function

  stats(permits, cFields) {
    const counters = {};
    cFields.forEach((field) => {
      counters[field] = {};
    });
    permits.forEach((permit) => {
      for (let i = 0; i < cFields.length; ++i) {
        const field = cFields[i];
        const c = permit[field];
        if (!(c in counters[field])) counters[field][c] = 0;
        ++counters[field][c];
      }
    });
    return counters;
  }

  render() {
    let counters = {};
    if (!this.props.data.loading) {
      counters = this.stats(this.props.data.permits, ['type', 'subtype', 'sla']);
    }
    return (
      <TopicContainerPage>
        <div><br /></div>
        <div id="full-period-stats">
          Full period stats:
          <br />
          {JSON.stringify(counters)}
        </div>
        <div id="performance-over-time">
          Performance over time
        </div>
      </TopicContainerPage>
    );
  }
}

DevelopmentSLADashboard.propTypes = {
  data: React.PropTypes.object,
  dispatch: React.PropTypes.func,
};

const myQuery = gql`
  query {
    permits {
      permit_id
      type
      subtype
      category
      app_date
      app_status
      app_status_date
      trips
      violation
      violation_count
      violation_days
      sla
      building
      fire
      zoning
      addressing
    }
  }
`;

export default graphql(myQuery)(DevelopmentSLADashboard);
