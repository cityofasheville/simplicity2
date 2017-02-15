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
import DevelopmentSummary from './topics/development/summary/DevelopmentSummary';
import DevelopmentDetail from './topics/development/detail/DevelopmentDetail';
import DevelopmentSLADashboard from './topics/development/slaDashboard/slaDashboard';
import CrimeSummary from './topics/crime/summary/CrimeSummary';
import CrimeDetail from './topics/crime/detail/CrimeDetail';

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
            <IndexRoute component={DevelopmentSummary} />
            <Route path="detail" component={DevelopmentDetail}></Route>
            <Route path="sla-dashboard" component={DevelopmentSLADashboard}></Route>
          </Route>
          <Route path="crime">
            <IndexRoute component={CrimeSummary} />
            <Route path="detail" component={CrimeDetail}></Route>
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

