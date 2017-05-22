import ApolloClient, { createNetworkInterface } from 'apollo-client';


const SERVER_URL = 'https://data-api1.ashevillenc.gov/graphql';
// const SERVER_URL = 'http://localhost:8080/graphql';

const networkInterface = createNetworkInterface({ uri: SERVER_URL });

/* eslint-disable no-param-reassign */
networkInterface.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {};
    }
    // get the authentation token from storage if it exists
    req.options.headers.authorization = sessionStorage.getItem('token') || null;
    next();
  },
}]);
/* eslint-enable no-param-reassign */

export const client = new ApolloClient({
  networkInterface,
});

export const apollo = client.reducer();
