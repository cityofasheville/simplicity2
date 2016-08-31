/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

const selectGlobal = () => (state) => state.global;

const selectCurrentUser = () => createSelector(
  selectGlobal(),
  (globalState) => globalState.currentUser
);

const selectLoading = () => createSelector(
  selectGlobal(),
  (globalState) => globalState.loading
);

const selectError = () => createSelector(
  selectGlobal(),
  (globalState) => globalState.error
);

const selectRepos = () => createSelector(
  selectGlobal(),
  (globalState) => globalState.userData.repositories
);

const selectLocationState = () => {
  let prevRoutingState;
  let prevRoutingStateJS;

  return (state) => {
    const routingState = state.route; // or state.route

    if (!(routingState === prevRoutingState)) {
      prevRoutingState = routingState;
      prevRoutingStateJS = routingState; // was .toJS() - we should be able to delete/simplify
    }

    return prevRoutingStateJS;
  };
};

export {
  selectGlobal,
  selectCurrentUser,
  selectLoading,
  selectError,
  selectRepos,
  selectLocationState,
};
