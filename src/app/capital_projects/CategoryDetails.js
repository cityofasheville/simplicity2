import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Collapsible from '../../shared/Collapsible';
import ProjectsTable from './ProjectsTable';
import { getFundsAllocatedAndExpended, filterProjects, longCategories } from './cip_utilities';
import Icon from '../../shared/Icon';
import { IM_SHIELD3, IM_TREE, IM_HOME2, IM_BUS, LI_BOLD } from '../../shared/iconConstants';
import LoadingAnimation from '../../shared/LoadingAnimation';
import Error from '../../shared/Error';

const getBondText = (type) => {
  switch (type) {
    case 'Transportation':
      return 'Transportation Bond projects are additional projects that support the completion of road resurfacing and sidewalk improvements; new sidewalk and greenway projects; and pedestrian safety projects such as bus shelters, accessible crossings, signals, and traffic calming.';
    case 'Parks':
      return 'Parks Bond projects are additional projects that support the completion of major improvements to five parks and recreation facilities; acquiring land for parks; and improving outdoor courts, playgrounds and ball field lighting throughout the city.';
    case 'Housing':
      return 'Housing Bond projects for housing affordability provide additional support for the Housing Trust Fund and other programs that assist in creating diverse and affordable housing choices. The projects also include support in the development of affordable housing on key City-owned sites.';
    default:
      return '';
  }
};

const getIcon = (type, bond) => {
  switch (type) {
    case 'Transportation':
      if (bond) {
        return <span><Icon path={IM_BUS} size={25} color="#4077a5" /><Icon path={LI_BOLD} size={16} color="#4077a5" viewBox="0 0 24 24" /></span>;
      }
      return <Icon path={IM_BUS} size={25} color="#4077a5" />;
    case 'Parks':
      if (bond) {
        return <span><Icon path={IM_TREE} size={25} color="#4077a5" /><Icon path={LI_BOLD} size={16} color="#4077a5" viewBox="0 0 24 24" /></span>;
      }
      return <Icon path={IM_TREE} size={25} color="#4077a5" />;
    case 'Housing':
      if (bond) {
        return <span><Icon path={IM_HOME2} size={25} color="#4077a5" /><Icon path={LI_BOLD} size={16} color="#4077a5" viewBox="0 0 24 24" /></span>;
      }
      return <Icon path={IM_HOME2} size={25} color="#4077a5" />;
    case 'Public Safety':
      return <Icon path={IM_SHIELD3} size={25} color="#4077a5" />;
    case 'Other':
      return <svg xmlns="http://www.w3.org/2000/svg" height="25px" transform="translate(0,4)" version="1.1" viewBox="0 0 16 16" width="25px"><g fill="none" fillRule="evenodd" id="Icons with numbers" stroke="none" strokeWidth="1"><g fill="#4077a5" id="Group" transform="translate(-528.000000, -576.000000)"><path d="M536,592 C531.581722,592 528,588.418278 528,584 C528,579.581722 531.581722,576 536,576 C540.418278,576 544,579.581722 544,584 C544,588.418278 540.418278,592 536,592 Z M541,586 C542.10457,586 543,585.10457 543,584 C543,582.89543 542.10457,582 541,582 C539.89543,582 539,582.89543 539,584 C539,585.10457 539.89543,586 541,586 Z M531,586 C532.10457,586 533,585.10457 533,584 C533,582.89543 532.10457,582 531,582 C529.89543,582 529,582.89543 529,584 C529,585.10457 529.89543,586 531,586 Z M536,586 C537.10457,586 538,585.10457 538,584 C538,582.89543 537.10457,582 536,582 C534.89543,582 534,582.89543 534,584 C534,585.10457 534.89543,586 536,586 Z M536,586" id="Oval 12 copy" /></g></g></svg>;
    default:
      return null;
  }
};

const getKeyText = categories => (
  <div>
    <p>
      <span>
        { ['Transportation', 'Housing', 'Parks', 'Public Safety', 'Other'].map((cat, index) => {
          if (categories.includes(cat)) {
            return <span key={index} style={categories.indexOf(cat) !== 0 ? { marginLeft: '10px', color: '#4077a5' } : { marginLeft: '0px', color: '#4077a5' }}>{getIcon(cat)}&nbsp;<b>{cat}</b></span>;
          }
          return null;
        }
        )}
      </span>
      <span style={{ marginLeft: '5px' }}>{categories.slice(0, categories.length - 1).join(', ')} {categories.length > 1 ? 'and' : ''} {categories[categories.length - 1]} projects within the City’s General Capital Improvement Program (CIP) are funded with a combination of general tax revenue, municipal debt and external grants or partnerships.</span>
      {categories.includes('Other') &&
        <span>&nbsp;Projects categorized as &quot;Other&quot; support facility upgrades and economic development initiatives.</span>
      }
    </p>
    { ['Transportation', 'Housing', 'Parks'].map((cat, index) => {
      if (categories.includes(cat)) {
        return <p key={index} ><span style={{ color: '#4077a5' }}>{getIcon(cat, true)}&nbsp;<b>{cat} Bond</b></span><span style={{ marginLeft: '5px' }}>{getBondText(cat)}</span></p>;
      }
      return null;
    })}
  </div>
);

const getDollars = (value) => {
  let formatted;
  if (Math.abs(value) > 1000000) {
    formatted = (Math.abs(value) / 1000000).toFixed(1).toLocaleString();
    if (formatted[formatted.length - 1] === '0') {
      formatted = formatted.slice(0, -2);
    }
    return [value < 0 ? '-$' : '$', formatted, ' M'].join('');
  } else if (Math.abs(value) > 1000) {
    return [value < 0 ? '-$' : '$', (Math.abs(value) / 1000).toFixed(0).toLocaleString(), ' k'].join('');
  }
  return [value < 0 ? '-$' : '$', Math.abs(value).toFixed(0).toLocaleString()].join('');
};

const CategoryDetails = (props) => {
  if (props.data.loading) { // eslint-disable-line react/prop-types
    return <LoadingAnimation />;
  }
  if (props.data.error) { // eslint-disable-line react/prop-types
    return <Error message={props.data.error.message} />; // eslint-disable-line react/prop-types
  }

  let actualCategories = Array.from(props.categories);
  if (props.location.query.mode === 'bond') {
    actualCategories = actualCategories.filter(cat => (['Transportation', 'Parks', 'Housing'].includes(cat)));
  }
  const sortedCats = ['Transportation', 'Housing', 'Parks', 'Public Safety', 'Other'];
  actualCategories.sort((a, b) => sortedCats.indexOf(a) > sortedCats.indexOf(b));
  const filteredProjects = filterProjects(props.data.cip_projects, actualCategories, props.location.query.mode);
  const fundingDetails = getFundsAllocatedAndExpended(filteredProjects, actualCategories, props.location.query.mode);

  return (
    <div>
      <div className="row">
        <div className="col-sm-12">
          <div className="funding-summary">
            <div className="col-sm-4 col-xs-4">
              <h2><span className="label-text">Total funding:</span> <span className="amount">{getDollars(fundingDetails[0].allocated)}</span></h2>
            </div>
            <div className="col-sm-4 col-xs-4">
              <h2><span className="label-text">Spent:</span> <span className="amount">{getDollars(fundingDetails[0]['Expended funds'])}</span></h2>
            </div>
            <div className="col-sm-4 col-xs-4">
              <h2><span className="label-text">Under contract:</span> <span className="amount">{getDollars(fundingDetails[0]['Under contract'])}</span></h2>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <Collapsible trigger="Click here to learn how projects in each category are supported">
                {getKeyText(actualCategories, props.location.query.mode)}
                <div style={{ marginTop: '15px' }}>
                  <div>
                    <p><span style={{ fontStyle: 'italic' }}>Please note: Current project budgets include prior year funding and may change throughout the life of the project.</span></p>
                    <p><span style={{ fontStyle: 'italic' }}>Ongoing programs and regular maintenance projects may not be represented in this dashboard. For a complete list including ongoing and maintenance projects within the City&apos;s General CIP, please view the adopted <a className="inText" href="http://www.ashevillenc.gov/civicax/filebank/blobdload.aspx?blobid=28348#page=146%20" target="_blank">FY 17-18 Annual Budget</a>.</span></p>
                  </div>
                </div>
              </Collapsible>
            </div>
          </div>
          <ProjectsTable data={filteredProjects} />
        </div>
      </div>
    </div>
  );
};

CategoryDetails.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string),
  location: PropTypes.object, // eslint-disable-line
};

CategoryDetails.defaultProps = {
  categories: ['Housing', 'Transportation', 'Parks', 'Public Safety', 'Other'],
};

const getProjectsQuery = gql`
  query getProjectsQuery($categories: [String]) {
    cip_projects (categories: $categories) {
      project
      display_name
      zip_code
      category
      coa_contact
      phone_number
      email_address
      project_description
      status
      encumbered
      total_project_funding_budget_document
      total_spent
      target_construction_start
      target_construction_end
      actual_construction_end
      estimated_construction_duration
      project_webpage_more_information
      photo_url
      contact
      show_pm_fields
      latitude
      longitude
    }
  }
`;

const CategoryDetailsGQL = graphql(getProjectsQuery, {
  options: ownProps => ({
    variables: {
      categories: longCategories(Array.from(ownProps.categories)),
    },
  }),
})(CategoryDetails);

export default CategoryDetailsGQL;
