/**
 * The global state selectors
 */

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

export default selectLocationState;
