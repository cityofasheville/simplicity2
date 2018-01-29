import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { withClientState } from 'apollo-link-state';
import gql from 'graphql-tag';

let SERVER_URL = 'https://data-api1.ashevillenc.gov/graphql';
if (process.env.USE_LOCAL_API === 'true') {
  SERVER_URL = 'http://localhost:8080/graphql';
}

const httpLink = createHttpLink({ uri: SERVER_URL });
const middlewareLink = setContext(() => ({
  headers: {
    authorization: sessionStorage.getItem('token') || null,
  },
}));
const link = middlewareLink.concat(httpLink);

const cache = new InMemoryCache();

// put elsewhere ... figure out
const defaultState = {
  searchText: {
    __typename: 'searchText',
    search: '',
  },
};

const stateLink = withClientState({
  cache,
  defaults: defaultState,
  resolvers: {
    Mutation: {
      updateSearchText: (_, { text }, { cache }) => {
        const query = gql`
          query getSearchText {
            searchText @client {
              search
            }
          }
        `;
        const data = {
          searchText: {
            search: text,
          },
        };
        cache.writeQuery({ query, data });
      },
    },
  },
});

export const client = new ApolloClient({
  link: ApolloLink.from([
    stateLink,
    link,
  ]),
  cache,
});

//export const state = client.extract();
