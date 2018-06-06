import { defaultSearchState } from './app/search/graphql/searchDefaultState';
import { defaultAuthState } from './utilities/auth/graphql/authDefaultState';
import { defaultBudgetState } from './app/budget/graphql/budgetDefaultState';
import { defaultLangState } from './utilities/lang/graphql/langDefaultState';

export const defaultState = Object.assign({}, defaultSearchState, defaultAuthState, defaultBudgetState, defaultLangState);
