import { searchResolvers } from './app/search/graphql/searchResolvers';
import { authResolvers } from './utilities/auth/graphql/authResolvers';
import { budgetResolvers } from './app/budget/graphql/budgetResolvers';

export const resolvers = {
  Mutation: Object.assign(
    {},
    searchResolvers.Mutation,
    authResolvers.Mutation,
    budgetResolvers.Mutation
  ),
};
