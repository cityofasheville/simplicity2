import expect from 'expect';

import locationState from 'containers/App/locationState';

describe('locationState', () => {
  it('should select the route as a plain JS object', () => {
    const route = {
      locationBeforeTransitions: null,
    };
    const mockedState = {
      route,
    };
    expect(locationState()(mockedState)).toEqual(route);
  });
});
