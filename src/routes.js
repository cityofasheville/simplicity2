import React from 'react';
import PropTypes from 'prop-types';
// import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { ApolloProvider } from 'react-apollo';

// GraphQL Client
import { client } from './utilities/gqlClient';

// Routed components
import App from './app/App';
import Home from './app/Home';
import MySimpliCity from './app/MySimpliCity';
import Search from './app/search/Search';
// Locations
import Locations from './app/Locations';
import Address from './app/address/Address';
import AddressList from './app/address/AddressList';
import Property from './app/property/Property';
import Properties from './app/property/Properties';
import Street from './app/street/Street';
import Neighborhood from './app/neighborhood/Neighborhood';
import Owner from './app/owner/Owner';
// Topics
import Topics from './app/Topics';
import DevelopmentSummary from './app/development/DevelopmentSummary';
import DevelopmentDetail from './app/development/DevelopmentDetail';
import DevelopmentSLADashboard from './app/sla_dashboard/SLADashboard';
import CrimeSummary from './app/crime/CrimeSummary';
import CrimeDetail from './app/crime/CrimeDetail';
import Maintenance from './app/maintenance/Maintenance';
// Budget
import BudgetSummary from './app/budget/BudgetSummary';
import BudgetDetailsContainer from './app/budget/BudgetDetailsContainer';
import SummaryDepartments from './app/budget/SummaryDepartments';
import SummaryUse from './app/budget/SummaryUse';
import SummaryCashFlow from './app/budget/SummaryCashFlow';
import BudgetData from './app/budget/BudgetData';
// Capital Projects
import CapitalProjectsSummary from './app/capital_projects/CapitalProjectsSummary';
import BondDetails from './app/capital_projects/BondDetails';
import BondsData from './app/capital_projects/BondsData';
import CIPData from './app/capital_projects/CIPData';
// Homelessness
import HomelessnessSummary from './app/homelessness/HomelessnessSummary';
import HomelessnessCounts from './app/homelessness/HomelessnessCounts';
import HomelessnessDemographics from './app/homelessness/HomelessnessDemographics';
import HomelessnessVeterans from './app/homelessness/HomelessnessVeterans';
import HomelessnessVeteransInflowOutflow from './app/homelessness/HomelessnessVeteransInflowOutflow';
import HomelessnessVeteransExitTime from './app/homelessness/HomelessnessVeteransExitTime';
import HomelessnessEnrollment from './app/homelessness/HomelessnessEnrollment';
import HomelessnessData from './app/homelessness/HomelessnessData';

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
        <Route path="locations" component={Locations} />
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
        <Route path="dashboards" component={Topics} />
        <Route path="budget">
          <IndexRoute component={BudgetSummary} />
          <Route path="details" component={BudgetDetailsContainer}></Route>
          <Route path="summaryUse" component={SummaryUse}></Route>
          <Route path="summaryDepartments" component={SummaryDepartments}></Route>
          <Route path="summaryCashFlow" component={SummaryCashFlow}></Route>
          <Route path="detailsTreemap" component={BudgetDetailsContainer}></Route>
          <Route path="detailsTable" component={BudgetDetailsContainer}></Route>
          <Route path="data" component={BudgetData}></Route>
        </Route>
        <Route path="capital_projects">
          <IndexRoute component={CapitalProjectsSummary} />
          <Route path="details" component={BondDetails}></Route>
          <Route path="bondsData" component={BondsData}></Route>
          <Route path="CIPData" component={CIPData}></Route>
        </Route>
        <Route path="crime">
          <IndexRoute component={CrimeSummary} />
          <Route path="detail" component={CrimeDetail}></Route>
        </Route>
        <Route path="development">
          <IndexRoute component={DevelopmentSummary} />
          <Route path="detail" component={DevelopmentDetail}></Route>
          <Route path="sla-dashboard" component={DevelopmentSLADashboard}></Route>
        </Route>
        <Route path="homelessness">
          <IndexRoute component={HomelessnessSummary} />
          <Route path="veterans" component={HomelessnessVeterans}></Route>
          <Route path="data" component={HomelessnessData}></Route>
          <Route path="veteranInflowOutflow" component={HomelessnessVeteransInflowOutflow}></Route>
          <Route path="veteranExitTime" component={HomelessnessVeteransExitTime}></Route>
          <Route path="counts" component={HomelessnessCounts}></Route>
          <Route path="demographics" component={HomelessnessDemographics}></Route>
          <Route path="enrollments" component={HomelessnessEnrollment}></Route>
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
  store: PropTypes.object.isRequired, 
};

export default Routes;

