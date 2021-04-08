import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Collapsible from '../../shared/Collapsible';
import ProjectsTable from './ProjectsTable';
import { getFundsAllocatedAndExpended, filterProjects } from './cip_utilities';
import Icon from '../../shared/Icon';
import {
  IM_SHIELD3,
  IM_TREE,
  IM_HOME2,
  IM_BUS,
  LI_BOLD,
  IM_INFO,
  IM_DROPLET,
  IM_HAMMER,
} from '../../shared/iconConstants';
import LoadingAnimation from '../../shared/LoadingAnimation';
import Error from '../../shared/Error';
import { withLanguage } from '../../utilities/lang/LanguageContext';
import { english } from './english';
import { spanish } from './spanish';

const getIcon = (type, bond) => {
  switch (type) {
    case 'Transportation & Infrastructure':
      if (bond) {
        return (
          <span>
            <Icon path={IM_BUS} size={25} color="#4077a5" />
            <Icon path={LI_BOLD} size={16} color="#4077a5" viewBox="0 0 24 24" />
          </span>
        );
      }
      return <Icon path={IM_BUS} size={25} color="#4077a5" />;
    case 'Parks & Recreation':
      if (bond) {
        return (
          <span>
            <Icon path={IM_TREE} size={25} color="#4077a5" />
            <Icon path={LI_BOLD} size={16} color="#4077a5" viewBox="0 0 24 24" />
          </span>
        );
      }
      return <Icon path={IM_TREE} size={25} color="#4077a5" />;
    case 'Housing Program':
      if (bond) {
        return (
          <span>
            <Icon path={IM_HOME2} size={25} color="#4077a5" />
            <Icon path={LI_BOLD} size={16} color="#4077a5" viewBox="0 0 24 24" />
          </span>
        );
      }
      return <Icon path={IM_HOME2} size={25} color="#4077a5" />;
    case 'Public Safety':
      return <Icon path={IM_SHIELD3} size={25} color="#4077a5" />;
    case 'Water':
      return <Icon path={IM_DROPLET} size={25} color="#4077a6" />;
    case 'Building Construction':
      return <Icon path={IM_HAMMER} size={25} color="#4077a6" />;
    case 'Other':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="25px"
          transform="translate(0,4)"
          version="1.1"
          viewBox="0 0 16 16"
          width="25px"
        >
          <g
            fill="none"
            fillRule="evenodd"
            id="Icons with numbers"
            stroke="none"
            strokeWidth="1"
          >
            <g
              fill="#4077a5"
              id="Group"
              transform="translate(-528.000000, -576.000000)"
            >
              <path
                d="M536,592 C531.581722,592 528,588.418278 528,584 C528,579.581722 531.581722,576 536,576 C540.418278,576 544,579.581722 544,584 C544,588.418278 540.418278,592 536,592 Z M541,586 C542.10457,586 543,585.10457 543,584 C543,582.89543 542.10457,582 541,582 C539.89543,582 539,582.89543 539,584 C539,585.10457 539.89543,586 541,586 Z M531,586 C532.10457,586 533,585.10457 533,584 C533,582.89543 532.10457,582 531,582 C529.89543,582 529,582.89543 529,584 C529,585.10457 529.89543,586 531,586 Z M536,586 C537.10457,586 538,585.10457 538,584 C538,582.89543 537.10457,582 536,582 C534.89543,582 534,582.89543 534,584 C534,585.10457 534.89543,586 536,586 Z M536,586"
                id="Oval 12 copy"
              />
            </g>
          </g>
        </svg>
      );
    default:
      return null;
  }
};

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

const GET_PROJECTS = gql`
  query cip_projects($categories: [String]) {
    cip_projects (categories: $categories) {
      project
      display_name
      type
      administering_department
      owner_department
      zip_code
      category
      coa_contact
      phone_number
      email_address
      project_description
      project_updates
      status
      encumbered
      total_project_funding_budget_document
      total_spent
      target_construction_start
      target_construction_end
      actual_construction_end
      amount_behind_schedule
      estimated_construction_duration
      project_webpage_more_information
      communication_plan
      photo_url
      latitude
      longitude
    }
  }
  `;

const CategoryDetails = props => (
  <Query
    query={GET_PROJECTS}
    variables={{
      categories: props.categories,
    }}
  >
    {({ loading, error, data }) => {
      if (loading) return <LoadingAnimation />;
      if (error) return <Error message={error.message} />;

      // set language
      let content;
      switch (props.language.language) {
        case 'Spanish':
          content = spanish;
          break;
        default:
          content = english;
      }

      const getBondText = (type) => {
        switch (type) {
          case 'Transportation & Infrastructure':
            return content.transportation_bond_info;
          case 'Parks & Recreation':
            return content.parks_bond_info;
          case 'Housing Program':
            return content.housing_bond_info;
          default:
            return '';
        }
      };

      const getKeyText = categories => (
        <div>
          <p>
            <span>
              { [
                'Transportation & Infrastructure',
                'Housing Program',
                'Parks & Recreation',
                'Water',
                'Building Construction',
                'Other'].map((cat, index) => {
                if (categories.includes(cat)) {
                  return (
                    <span
                      key={index}
                      style={categories.indexOf(cat) !== 0 ?
                        { marginLeft: '10px', color: '#4077a5' } :
                        { marginLeft: '0px', color: '#4077a5' }}
                    >{getIcon(cat)}&nbsp;<b>{cat}</b>
                    </span>);
                }
                return null;
              })}
            </span>
            <span
              style={{ marginLeft: '5px' }}
            >{categories.slice(0, categories.length - 1).join(', ')} {categories.length > 1 ? 'and' : ''} {categories[categories.length - 1]} {content.funding_info}
            </span>
            {categories.includes('Other') &&
              <span>&nbsp;{content.other_category_note}
              </span>
            }
          </p>
          { ['Transportation & Infrastructure', 'Housing Program', 'Parks & Recreation'].map((cat, index) => {
            if (categories.includes(cat)) {
              return (
                <p
                  key={index}
                >
                  <span
                    style={{ color: '#4077a5' }}
                  >{getIcon(cat, true)}&nbsp;<b>{cat} Bond</b>
                  </span><span style={{ marginLeft: '5px' }}>{getBondText(cat)}</span>
                </p>);
            }
            return null;
          })}
        </div>
      );

      const actualCategories = props.categories;
      actualCategories.sort((a, b) =>
        props.sortedCategories.indexOf(a) > props.sortedCategories.indexOf(b));
      const filteredProjects = filterProjects(
        data.cip_projects,
        actualCategories,
        props.location.query.mode,
      );
      const fundingDetails = getFundsAllocatedAndExpended(
        filteredProjects,
        actualCategories,
        props.location.query.mode,
      );
      const messageOrTable = (filteredProjects === undefined || filteredProjects.length === 0) ?
        (
          <div style={{ marginTop: '20px' }} className="alert alert-info alert-sm">
            {content.select_a_category}
          </div>
        ) : <ProjectsTable data={filteredProjects} />;

      return (
        <div>
          <div className="row">
            <div className="col-sm-12">
              <div className="funding-summary">
                <div className="col-sm-4 col-xs-4">
                  <h2>
                    <span className="label-text">
                      <span
                        title={content.total_budget_note} // eslint-disable-line
                        style={{ marginRight: '5px' }}
                      ><Icon path={IM_INFO} size={16} color="#4077a7" />
                      </span>{content.total_budget}:
                    </span>
                    <span className="amount">{getDollars(fundingDetails[0].allocated)}</span>
                  </h2>
                </div>
                <div className="col-sm-4 col-xs-4">
                  <h2>
                    <span className="label-text">{content.under_contract}:</span>
                    <span
                      className="amount"
                    >{getDollars(fundingDetails[0]['Under contract'])}
                    </span>
                  </h2>
                </div>
                <div className="col-sm-4 col-xs-4">
                  <h2>
                    <span className="label-text">{content.spent}:</span>
                    <span
                      className="amount"
                    >{getDollars(fundingDetails[0]['Expended funds'])}
                    </span>
                  </h2>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12">
                  <Collapsible trigger={content.collapsible_text}>
                    {getKeyText(actualCategories, props.location.query.mode)}
                    <div style={{ marginTop: '15px' }}>
                      <div>
                        <p>
                          <span
                            style={{ fontStyle: 'italic' }}
                          >{content.project_budgets_note}
                          </span>
                        </p>
                        <p>
                          <span
                            style={{ fontStyle: 'italic' }}
                          >{content.ongoing_programs}
                            <a
                              className="inText"
                              href="http://www.ashevillenc.gov/civicax/filebank/blobdload.aspx?blobid=30725#page=146" // eslint-disable-line
                              target="_blank"
                            >&nbsp;FY 18-19 {content.adopted_annual_budget}
                            </a>.
                          </span>
                        </p>
                      </div>
                    </div>
                  </Collapsible>
                </div>
              </div>
              {messageOrTable}
            </div>
          </div>
        </div>
      );
    }}
  </Query>
);

export default withLanguage(CategoryDetails);
