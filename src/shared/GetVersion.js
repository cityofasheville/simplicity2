import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const VERSION = gql`
query version {
  version
}
`;

const GetVersion = () => {
  return (
    <Query
      query={VERSION}
    >
      {({ loading, error, data }) => {
        if (error) {
          console.log(error);
          return null;
        }
        
        if (loading) {
          return null;
        } 
        
        console.log('api version: ', data.version);

        return null;
      }}
    </Query>
  );
};

export default GetVersion;