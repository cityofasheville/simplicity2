/**
*
* GqlTest
*
*/

import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import TopicContainerPage from '../../../../containers/TopicContainerPage/topicContainerPage';
import SearchBox from '../../../../containers/SearchBox/searchBox';

class DevelopmentDashboard extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <TopicContainerPage>
        <div>
          <h3>Results of a couple hardcoded searches:</h3>
          <p>{JSON.stringify(this.props.data.address)}</p>
          <p>{JSON.stringify(this.props.data.search)}</p>
        </div>
        <div>
          <h2>Search by Civic Address ID</h2>
          <p>Try 230095</p>
          <SearchBox />
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
    search (searchString: "60", searchContexts:["civicAddressId", "alialiuncomefree"]) {
      type
      results {
        ... on SillyResult {
          id
          text
          score
        }
        ... on AddressResult {
          full_address
        }
      }
    }
    address (id: ${sampleCivicAddressId}) {
      full_address
      is_in_city
      pin
    }
  }
`;

export default graphql(myQuery)(DevelopmentDashboard);
