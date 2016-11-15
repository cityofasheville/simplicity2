// These are the pages you can go to.
// They are all wrapped in the App component, which should contain the navbar etc
// See http://blog.mxstbr.com/2016/01/react-apps-with-pages for more information
// about the code splitting business
import { getAsyncInjectors } from './utils/asyncInjectors';

const errorLoading = (err) => {
  console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
};

const loadModule = (cb) => (componentModule) => {
  cb(null, componentModule.default);
};

export default function createRoutes(store) {
  // create reusable async injectors using getAsyncInjectors factory
  const { injectReducer, injectSagas } = getAsyncInjectors(store);

  return [
    {
      path: '/',
      name: 'home',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/HomePage/homePageReducer'),
          System.import('containers/HomePage/homePageSagas'),
          System.import('containers/HomePage/homePage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('home', reducer.default);
          injectSagas(sagas.default);

          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/my-simplicity',
      name: 'mySimpliCity',
      getComponent(location, cb) {
        System.import('containers/MySimpliCityPage/mySimpliCityPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    }, {
      path: '/topics',
      name: 'topics',
      getComponent(location, cb) {
        System.import('containers/TopicsPage/topicsPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    }, {
      path: '/topics/topic-container-page',
      name: 'topicContainerPage',
      getComponent(location, cb) {
        System.import('containers/TopicContainerPage/topicContainerPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    }, {
      path: '/topics/development-dashboard',
      name: 'developmentDashboard',
      getComponent(location, cb) {
        System.import('topics/development/citywide/DevelopmentDashboard/developmentDashboard')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    }, {
      path: '/search-results',
      name: 'searchResultsPage',
      getComponent(location, cb) {
        System.import('containers/SearchResultsPage/searchResultsPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    }, {
      path: '*',
      name: 'notfound',
      getComponent(nextState, cb) {
        System.import('containers/NotFoundPage/notFoundPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    },
  ];
}
