/**
*
* GqlTest
*
*/

import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import TopicContainerPage from '../../../../containers/TopicContainerPage/topicContainerPage';

class DevelopmentDashboard extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <TopicContainerPage>
        <div>
          <p>{JSON.stringify(this.props.data.address)}</p>
        </div>
      </TopicContainerPage>
    );
  }
}

DevelopmentDashboard.propTypes = {
  data: React.PropTypes.object,
  dispatch: React.PropTypes.func,
};

const sampleCivicAddressId = '230095';

const myQuery = gql`
  query {
    address (id: ${sampleCivicAddressId}) {
      full_address
      is_in_city
      pin
    }
  }
`;

export default graphql(myQuery)(DevelopmentDashboard);
