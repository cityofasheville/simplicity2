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
import { useState, useEffect } from 'react';
import useLocation from 'react-router'

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

      const allTypes = ['Bond 2016', 'Bond 2024', 'Operating Budget', 'Helene']
      let allCats = Array.from(data.cip_project_categories);
      allCats.sort((a, b) => (a.category_number > b.category_number) ? 1 : ((b.category_number > a.category_number) ? -1 : 0)).map((item) => item.category_name); // eslint-disable-line
      allCats = allCats.map(cat => cat.category_name);


      const getSelectedFromURL = () => {
        let url = window.location.href;
        const params = new URLSearchParams(url.split('?')[1]);

        let selected = {
          categories: [],
          types: []
        };

        if (params.has('categories')) {
          selected.categories = params.get('categories') === '' ? [] : params.get('categories').split(',');
        } else {
          selected.categories = allCats;
        }
    
        if (params.has('types')) {
          selected.types = params.get('types') === '' ? [] : params.get('types').split(',');
        } else {
          selected.types = allTypes;
        }
    
        return selected;
      };

      return (
        <div>
          <PageHeader
            h1={content.capital_projects}
            // externalLinkText={content.view_cip_plan}
            // externalLink="https://drive.google.com/file/d/0B2t_Ch5LbY5eZ19Db0hFYThVR0V6b2JqcXo4NGhFTDk2OVZr/view" // eslint-disable-line
            // // dataLinkPath="/capital_projects/data"
            // // dataLinkText={content.understand_the_capital_projects_data}
            // icon={<Icon path={IM_CITY} size={60} />}
          >
            <span>{content.search_by_note}</span>
            <br></br>
            <a className="" href="https://gis.ashevillenc.gov/arcgis/apps/experiencebuilder/experience/?id=1397c75f257248b5b030f6b420618e88" target="_blank">
              {content.try_project_map}
            </a>
          </PageHeader>
          <h3>Categories</h3>
          <CIPFilter
            selected={getSelectedFromURL().categories}
            location={props.location}
            filter_variable={allCats}
            variableString={'categories'}
          />

            <h3>Types</h3>
            <CIPFilter
            selected={getSelectedFromURL().types}
            location={props.location}
            filter_variable={allTypes}
            variableString={'types'}
          />
          <hr style={{ marginTop: '5px', marginBottom: '5px' }} />
          <CategoryDetails
            location={props.location}
            categories={getSelectedFromURL().categories}
            types={getSelectedFromURL().types}
            sortedCategories={allCats}
          />
        </div>
      );
    }}
  </Query>
  
  );

export default withLanguage(CapitalProjectsSummary);
