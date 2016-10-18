import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class MySimpliCityCards extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    /*
     * Leaving this console.log here for now. If you log out while on this page,
     * we get what looks like a GraphQL server error, but then it goes ahead and
     * refetches the data again and refreshes the page correctly. Seems like it might
     * be an Apollo bug - leaving it alone for now.
     */
    console.log(`DATA: ${JSON.stringify(this.props.data)}`);
    if (this.props.data.loading) {
      return <div><p>Loading ... </p></div>;
    } else if (this.props.data.my_simplicity) {
      return (
        <div>
          <p>MySimpliCity Subscriptions = {JSON.stringify(this.props.data.my_simplicity.subscriptions)}</p>
        </div>
      );
    }
    return <div><p>Please refresh the page</p></div>;
  }
}

MySimpliCityCards.propTypes = {
  data: React.PropTypes.object,
  dispatch: React.PropTypes.func,
};

const myQuery = gql`
  query {
    my_simplicity {
      email
      groups
      subscriptions
    }
  }
`;

export default graphql(myQuery)(MySimpliCityCards);
