import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import CIPFilter from './CIPFilter';
import CategoryDetails from './CategoryDetails';
import PageHeader from '../../shared/PageHeader';
import Icon from '../../shared/Icon';
import { IM_CITY } from '../../shared/iconConstants';
import LoadingAnimation from '../../shared/LoadingAnimation';
import Error from '../../shared/Error';
import { withLanguage } from '../../utilities/lang/LanguageContext';
import { english } from './english';
import { spanish } from './spanish';

const GET_CATEGORIES = gql`
  query cip_project_categories {
    cip_project_categories {
      category_name
      category_number
      bond_count
    }
  }
`;

const CapitalProjectsSummary = props => (
  <Query
    query={GET_CATEGORIES}
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

      let allCats = Array.from(data.cip_project_categories);
      allCats.sort((a, b) => (a.category_number > b.category_number) ? 1 : ((b.category_number > a.category_number) ? -1 : 0)).map((item) => item.category_name); // eslint-disable-line
      allCats = allCats.map(cat => cat.category_name);

      const getSelected = () => {
        if (props.location.query.selected === undefined) {
          return allCats;
        } else if (props.location.query.selected.length === 0) {
          return [];
        }
        const selected = props.location.query.selected.split(',')
          .map(cat => decodeURIComponent(cat));
        return selected;
      };

      const bondCategories = Array.from(data.cip_project_categories)
        .filter(cat => parseInt(cat.bond_count, 10) > 0)
        .map(cat => cat.category_name);
      return (
        <div>
          <PageHeader
            h1={content.capital_projects}
            externalLinkText={content.view_cip_plan}
            externalLink="https://drive.google.com/file/d/0B2t_Ch5LbY5eZ19Db0hFYThVR0V6b2JqcXo4NGhFTDk2OVZr/view" // eslint-disable-line
            dataLinkPath="/capital_projects/data"
            dataLinkText={content.understand_the_capital_projects_data}
            icon={<Icon path={IM_CITY} size={60} />}
          >
            <span>{content.search_by_note}</span>
            <br></br>
            <a className="" href="http://arcg.is/Sy5KC" target="_blank">
              {content.try_project_map}
            </a>
          </PageHeader>
          <CIPFilter
            selected={getSelected()}
            location={props.location}
            categories={allCats}
            bond_categories={bondCategories}
          />
          <hr style={{ marginTop: '5px', marginBottom: '5px' }} />
          <CategoryDetails
            location={props.location}
            categories={getSelected()}
            sortedCategories={allCats}
          />
        </div>
      );
    }}
  </Query>
);

export default withLanguage(CapitalProjectsSummary);
