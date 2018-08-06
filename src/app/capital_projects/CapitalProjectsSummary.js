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
            h1="Capital Projects"
            externalLinkText="View the City&apos;s General Capital Improvement Plan (CIP)"
            externalLink="http://www.ashevillenc.gov/civicax/filebank/blobdload.aspx?blobid=30725#page=146" // eslint-disable-line
            dataLinkPath="/capital_projects/data"
            icon={<Icon path={IM_CITY} size={60} />}
          >
            <span>You can search geographically AND by address:</span>
            <br></br>
            <a className="" href="http://arcg.is/Sy5KC" target="_blank">
              Try our Project Map
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

export default CapitalProjectsSummary;
