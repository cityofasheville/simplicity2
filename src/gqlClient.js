import { ApolloClient } from 'apollo-client';
import fetch from 'unfetch';
import { createHttpLink } from 'apollo-link-http';
import { IntrospectionFragmentMatcher, InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { withClientState } from 'apollo-link-state';
import { resolvers } from './resolvers';
import { defaultState } from './defaultState';
import { fragmentTypes } from './fragmentTypes';

let SERVER_URL = 'https://data-api1.ashevillenc.gov/graphql';
if (process.env.REACT_APP_USE_DEV_API === true || process.env.REACT_APP_USE_DEV_API === 'true') {
  SERVER_URL = 'https://dev-data-api2.ashevillenc.gov/graphql';
}
if (process.env.REACT_APP_USE_LOCAL_API === true || process.env.REACT_APP_USE_LOCAL_API === 'true') {
  SERVER_URL = 'http://localhost:8080/graphql';
}

const httpLink = createHttpLink({ uri: SERVER_URL, fetch });

// const authLink = setContext(
//   request =>
//     new Promise((success, fail) => {
//       const signedInUser = firebase.auth().currentUser;
//       if (signedInUser) {
//         signedInUser.getIdToken(true)
//         .then((idToken) => {
//           localStorage.setItem('token', idToken);
//           success({ headers: {
//             authorization: idToken,
//           } });
//           fail(Error(request.statusText));
//         });
//       } else {
//         success({ headers: {
//           authorization: localStorage.getItem('token') || null,
//         } });
//         fail(Error(request.statusText));
//       }
//     })
// );

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
    httpLink,
  ]),
  cache,
});

aClient.onResetStore(stateLink.writeDefaults);

export const client = aClient;

