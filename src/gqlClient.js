import { ApolloClient } from 'apollo-client';
import fetch from 'unfetch';
import { createHttpLink } from 'apollo-link-http';
import { IntrospectionFragmentMatcher, InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import firebase from 'firebase';
import { withClientState } from 'apollo-link-state';
import { resolvers } from './resolvers';
import { defaultState } from './defaultState';
import { fragmentTypes } from './fragmentTypes';

let SERVER_URL = 'https://data-api1.ashevillenc.gov/graphql';
if (process.env.USE_LOCAL_API === 'true') {
  SERVER_URL = 'http://localhost:8080/graphql';
}

const httpLink = createHttpLink({ uri: SERVER_URL, fetch });

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('token') || null;
  if (firebase.apps.length > 0) {
    const signedInUser = firebase.auth().currentUser;
    if (signedInUser) {
      const newToken = signedInUser.getIdToken(true).then(idToken => (idToken));
      operation.setContext(({ headers }) => (Object.assign({}, headers, { authorization: newToken })));
      return forward(operation);
    }
  }
  operation.setContext(({ headers }) => (Object.assign({}, headers, { authorization: token })));
  return forward(operation);
});

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: fragmentTypes,
});

const cache = new InMemoryCache({ fragmentMatcher });

const stateLink = withClientState({
  cache,
  defaults: defaultState,
  resolvers,
});

const aClient = new ApolloClient({
  link: ApolloLink.from([
    stateLink,
    authLink,
    httpLink,
  ]),
  cache,
});

aClient.onResetStore(stateLink.writeDefaults);

export const client = aClient;

