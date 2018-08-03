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
import TRCDashboard from './app/development/trc/TRCDashboard';
import VolumeDashboard from './app/development/volume/VolumeDashboard';
import GranularVolume from './app/development/volume/GranularVolume';
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
// Finance
import PCardCompliance from './app/internal/pcard_compliance/PCardCompliance';
import PCardComplianceReceipts from './app/internal/pcard_compliance/PCardComplianceReceipts';
// City Website
import AnalyticsCirclePack from './app/internal/city_website_analytics/AnalyticsCirclePack';

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
  <ApolloProvider client={client} >
    <Router history={browserHistory} onUpdate={logPageView === null ? null : () => logPageView()}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route path="search">
          <IndexRoute component={Search} />
          <Route path="googlePlaceMatches" component={GooglePlaceResults}></Route>
        </Route>
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
          <Route path="details" component={CategoryDetails}></Route>
          <Route path="data" component={CIPData}></Route>
        </Route>
        <Route path="crime">
          <IndexRoute component={CrimeSummary} />
        </Route>
        <Route path="bpt_projects">
          <IndexRoute component={ProjectFlowDashboard} />
        </Route>
        <Route path="pcard_compliance">
          <IndexRoute component={PCardCompliance} />
          <Route path="receipts" component={PCardComplianceReceipts} />
        </Route>
        <Route path="city_website_analytics">
          <IndexRoute component={AnalyticsCirclePack} />
        </Route>
        <Route path="development">
          <IndexRoute component={DevelopmentSummary} />
          <Route path="detail" component={DevelopmentDetail}></Route>
          <Route path="sla-dashboard" component={DevelopmentSLADashboard}></Route>
          <Route path="trc" component={TRCDashboard}></Route>
          <Route path="volume" component={VolumeDashboard}></Route>
          <Route path="granular_volume" component={GranularVolume}></Route>
        </Route>
        <Route path="homelessness">
          <IndexRoute component={HomelessnessSummary} />
          <Route path="veterans" component={HomelessnessVeterans}></Route>
          <Route path="data" component={HomelessnessData}></Route>
          <Route path="veteranEnrollments" component={HomelessnessVeteransEnrollment}></Route>
          <Route path="veteranChronicAssignments" component={HomelessnessVeteransChronicAssignments}></Route>
          <Route path="veteranInflowOutflow" component={HomelessnessVeteransInflowOutflow}></Route>
          <Route path="veteranExitTime" component={HomelessnessVeteransExitTime}></Route>
          <Route path="counts" component={HomelessnessCounts}></Route>
          <Route path="demographics" component={HomelessnessDemographics}></Route>
          <Route path="enrollments" component={HomelessnessEnrollment}></Route>
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

