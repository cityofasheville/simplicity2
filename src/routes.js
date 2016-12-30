import React from 'react';
// import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { ApolloProvider } from 'react-apollo';

// GraphQL Client
import { client } from './modules/gql/gqlClient';

// Routed components
import App from './components/App';
import Home from './components/Home';
import SearchResults from './components/SearchResults';
import MySimpliCity from './components/MySimpliCity';
import Topics from './topics/Topics';
import Development from './topics/development/citywide/development';
import DevelopmentSLADashboard from './topics/development/slaDashboard/slaDashboard';

const Routes = props => (
  <ApolloProvider store={props.store} client={client} >
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route path="search-results" component={SearchResults}></Route>
        <Route path="my-simplicity" component={MySimpliCity}></Route>
        <Route path="topics">
          <IndexRoute component={Topics} />
          <Route path="development">
            <IndexRoute component={Development} />
            <Route path="sla-dashboard" component={DevelopmentSLADashboard}></Route>
          </Route>
        </Route>
      </Route>
    </Router>
  </ApolloProvider>
);

Routes.propTypes = {
  /* eslint-disable */
  store: React.PropTypes.object.isRequired, 
};

export default Routes;

