import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';

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

export const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
});

//export const state = client.extract();
