import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { ApolloProvider } from 'react-apollo';

// GraphQL Client
import { client } from './gqlClient';

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
import GooglePlaceResults from './app/search/searchResults/GooglePlaceResults';
// Topics
import Topics from './app/Topics';
import DevelopmentSummary from './app/development/DevelopmentSummary';
import DevelopmentDetail from './app/development/DevelopmentDetail';
import DevelopmentSLADashboard from './app/development/sla_dashboard/SLADashboard';
import ProjectFlowDashboard from './app/internal/bpt_projects/ProjectFlow';
import CrimeSummary from './app/crime/CrimeSummary';
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
import CategoryDetails from './app/capital_projects/CategoryDetails';
import CIPData from './app/capital_projects/CIPData';
// Homelessness
import HomelessnessSummary from './app/homelessness/HomelessnessSummary';
import HomelessnessCounts from './app/homelessness/HomelessnessCounts';
import HomelessnessDemographics from './app/homelessness/HomelessnessDemographics';
import HomelessnessVeterans from './app/homelessness/HomelessnessVeterans';
import HomelessnessVeteransInflowOutflow from './app/homelessness/HomelessnessVeteransInflowOutflow';
import HomelessnessVeteransEnrollment from './app/homelessness/HomelessnessVeteransEnrollment';
import HomelessnessVeteransChronicAssignments from './app/homelessness/HomelessnessVeteransChronicAssignments';
import HomelessnessVeteransExitTime from './app/homelessness/HomelessnessVeteransExitTime';
import HomelessnessEnrollment from './app/homelessness/HomelessnessEnrollment';
import HomelessnessData from './app/homelessness/HomelessnessData';
// MiniSearch
import MiniSearch from './app/mini_search/MiniSearch';

// Google Analytics
const ReactGA = require('react-ga');

let logPageView = () => {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
};

if (window.location.href.indexOf('dashboards.ashevillenc.gov') > -1) {
  ReactGA.initialize('UA-16340971-12');
} else if (window.location.href.indexOf('simplicity.ashevillenc.gov') > -1) {
  ReactGA.initialize('UA-16340971-11');
} else {
  logPageView = null;
}

const Routes = () => (
  <ApolloProvider client={client}>
    <Router history={browserHistory} onUpdate={logPageView === null ? null : () => logPageView()}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route path="search">
          <IndexRoute component={Search} />
          <Route path="googlePlaceMatches" component={GooglePlaceResults} />
        </Route>
        <Route path="my-simplicity" component={MySimpliCity} />
        <Route path="locations" component={Locations} />
        <Route path="address">
          <IndexRoute component={Address} />
          <Route path="addressList" component={AddressList} />
        </Route>
        <Route path="property">
          <IndexRoute component={Property} />
          <Route path="properties" component={Properties} />
        </Route>
        <Route path="street" component={Street} />
        <Route path="neighborhood" component={Neighborhood} />
        <Route path="owner" component={Owner} />
        <Route path="dashboards" component={Topics} />
        <Route path="budget">
          <IndexRoute component={BudgetSummary} />
          <Route path="details" component={BudgetDetailsContainer} />
          <Route path="summaryUse" component={SummaryUse} />
          <Route path="summaryDepartments" component={SummaryDepartments} />
          <Route path="summaryCashFlow" component={SummaryCashFlow} />
          <Route path="detailsTreemap" component={BudgetDetailsContainer} />
          <Route path="detailsTable" component={BudgetDetailsContainer} />
          <Route path="data" component={BudgetData} />
        </Route>
        <Route path="capital_projects">
          <IndexRoute component={CapitalProjectsSummary} />
          <Route path="details" component={CategoryDetails} />
          <Route path="data" component={CIPData} />
        </Route>
        <Route path="crime">
          <IndexRoute component={CrimeSummary} />
        </Route>
        <Route path="bpt_projects">
          <IndexRoute component={ProjectFlowDashboard} />
        </Route>
        <Route path="development">
          <IndexRoute component={DevelopmentSummary} />
          <Route path="detail" component={DevelopmentDetail} />
          <Route path="sla-dashboard" component={DevelopmentSLADashboard} />
        </Route>
        <Route path="homelessness">
          <IndexRoute component={HomelessnessSummary} />
          <Route path="veterans" component={HomelessnessVeterans} />
          <Route path="data" component={HomelessnessData} />
          <Route path="veteranEnrollments" component={HomelessnessVeteransEnrollment} />
          <Route
            path="veteranChronicAssignments"
            component={HomelessnessVeteransChronicAssignments}
          />
          <Route path="veteranInflowOutflow" component={HomelessnessVeteransInflowOutflow} />
          <Route path="veteranExitTime" component={HomelessnessVeteransExitTime} />
          <Route path="counts" component={HomelessnessCounts} />
          <Route path="demographics" component={HomelessnessDemographics} />
          <Route path="enrollments" component={HomelessnessEnrollment} />
        </Route>
        <Route path="maintenance">
          <IndexRoute component={Maintenance} />
        </Route>
        <Route path="mini_search">
          <IndexRoute component={MiniSearch} />
        </Route>
      </Route>
    </Router>
  </ApolloProvider>
);

export default Routes;
