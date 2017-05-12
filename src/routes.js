import React from 'react';
// import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { ApolloProvider } from 'react-apollo';

// GraphQL Client
import { client } from './gql/gqlClient';

// Routed components
import App from './App/App';
import Home from './App/Home';
import MySimpliCity from './App/MySimpliCity';
import Search from './App/search/Search';
// Locations
import Locations from './App/Locations';
import Address from './App/address/Address';
import AddressList from './App/address/AddressList';
import Property from './App/property/Property';
import Properties from './App/property/Properties';
import Street from './App/street/Street';
import Neighborhood from './App/neighborhood/Neighborhood';
import Owner from './App/owner/Owner';
// Topics
import Topics from './App/Topics';
import DevelopmentSummary from './App/development/DevelopmentSummary';
import DevelopmentDetail from './App/development/DevelopmentDetail';
import DevelopmentSLADashboard from './App/sla_dashboard/SLADashboard';
import CrimeSummary from './App/crime/CrimeSummary';
import CrimeDetail from './App/crime/CrimeDetail';
import Maintenance from './App/maintenance/Maintenance';
// Budget
import BudgetSummary from './App/budget/BudgetSummary';
import BudgetDetailsContainer from './App/budget/BudgetDetailsContainer';
import SummaryDepartments from './App/budget/SummaryDepartments';
import SummaryUse from './App/budget/SummaryUse';

// Google Analytics
const ReactGA = require('react-ga');

let logPageView = () => {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
};

if (window.location.href.indexOf('dashboards.ashevillenc.gov') > -1) {
  ReactGA.initialize('UA-16340971-12');
} else {
  logPageView = null;
}  // later add an else for SimpliCity2

const Routes = props => (
  <ApolloProvider store={props.store} client={client} >
    <Router history={browserHistory} onUpdate={logPageView === null ? null : () => logPageView()}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route path="search" component={Search}></Route>
        <Route path="my-simplicity" component={MySimpliCity}></Route>
        <Route path="locations">
          <IndexRoute component={Locations} />
          <Route path="address">
            <IndexRoute component={Address} />
            <Route path="addressList" component={AddressList}></Route>
          </Route>
          <Route path="property">
            <IndexRoute component={Property} />
            <Route path="properties" component={Properties}></Route>
          </Route>
          <Route path="street" component={Street}></Route>
          <Route path="neighborhood" component={Neighborhood}></Route>
          <Route path="owner" component={Owner}></Route>
        </Route>
        <Route path="topics" component={Topics} />
        <Route path="development">
          <IndexRoute component={DevelopmentSummary} />
          <Route path="detail" component={DevelopmentDetail}></Route>
          <Route path="sla-dashboard" component={DevelopmentSLADashboard}></Route>
        </Route>
        <Route path="crime">
          <IndexRoute component={CrimeSummary} />
          <Route path="detail" component={CrimeDetail}></Route>
        </Route>
        <Route path="budget">
          <IndexRoute component={BudgetSummary} />
          <Route path="details" component={BudgetDetailsContainer}></Route>
          <Route path="summaryUse" component={SummaryUse}></Route>
          <Route path="summaryDepartments" component={SummaryDepartments}></Route>
          <Route path="summaryCashFlow" component={BudgetDetailsContainer}></Route>
          <Route path="detailsTreemap" component={BudgetDetailsContainer}></Route>
          <Route path="detailsTable" component={BudgetDetailsContainer}></Route>
        </Route>
        <Route path="maintenance">
          <IndexRoute component={Maintenance} />
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

