import React from 'react';
// import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { ApolloProvider } from 'react-apollo';

// GraphQL Client
import { client } from './modules/gql/gqlClient';

// Routed components
import App from './components/App';
import Home from './components/Home';
import MySimpliCity from './components/MySimpliCity';
import Search from './containers/search/Search';
// Locations
import Locations from './locations/Locations';
import Address from './locations/address/Address';
import AddressList from './locations/address/AddressList';
import Property from './locations/property/Property';
import Properties from './locations/property/Properties';
import Street from './locations/street/Street';
import Neighborhood from './locations/neighborhood/Neighborhood';
import Owner from './locations/owner/Owner';
// Topics
import Topics from './topics/Topics';
import DevelopmentSummary from './topics/development/summary/DevelopmentSummary';
import DevelopmentDetail from './topics/development/detail/DevelopmentDetail';
import DevelopmentSLADashboard from './topics/development/sla_dashboard/SLADashboard';
import CrimeSummary from './topics/crime/summary/CrimeSummary';
import CrimeDetail from './topics/crime/detail/CrimeDetail';
import Maintenance from './topics/maintenance/Maintenance';
// Budget
import BudgetSummary from './topics/budget/summary/BudgetSummary';
import BudgetDetailsContainer from './containers/BudgetDetailsContainer';
import SummaryDepartments from './topics/budget/summary/SummaryDepartments';
import SummaryUse from './topics/budget/summary/SummaryUse';

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

