import { searchResolvers } from './app/search/graphql/searchResolvers';
import { authResolvers } from './utilities/auth/graphql/authResolvers';

export const resolvers = Object.assign({}, searchResolvers, authResolvers);
