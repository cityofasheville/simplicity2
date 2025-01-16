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

const GET_CATEGORIES = gql`
  query cip_project_categories {
    cip_project_categories {
      category_name
      category_number
      bond_count
    }
  }
`;

const CapitalProjectsSummary = props => {
  const [selectedCats, setSelectedCats] = useState(['Transportation & Infrastructure', 'Building Construction', 'Water', 'Other', 'DCREF', 'Housing Program', 'Parks & Recreation' ])
  const [selectedTypes, setSelectedTypes] = useState(['Bond 2016', 'Bond 2024', 'CIP', 'Helene'])
  const [updatedURL, setUpdatedURL] = useState('')
  const [allTypes] = useState(['Bond 2016', 'Bond 2024', 'CIP', 'Helene'])
  

  const [selected, setSelected] = useState({
    categories: [],
    types: []
  });

  const getSelectedFromURL = () => {
    let url = window.location.href;
    let selected = {
      categories: [],
      types: []
    };
    const params = new URLSearchParams(url.split('?')[1]);

    const allCats = ['Transportation & Infrastructure', 'Building Construction', 'Water', 'Other', 'DCREF', 'Housing Program', 'Parks & Recreation' ];

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

  useEffect(() => {
    const selected = getSelectedFromURL();
    setSelected(selected);
    setSelectedCats(selected.categories);
    setSelectedTypes(selected.types);
  }, [updatedURL]);  // Dependency on URL search params

  return(
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

      // before we were programatically getting an array of all the categories, but I ended up hard coding them in getSelectedFromURL() 
      // above, because that function needs them, and I needed the getSelectedFromURL()
      // function to not be in the <Query> component, so it couldn't get them programatically. The <CategoryDetails> component is using the code below, but I could consolidate
      // so that all functions are using the hard coded categories. Maybe that's better...
      // const allTypes = ['Bond 2016', 'Bond 2024', 'CIP', 'Helene']
      let allCats = Array.from(data.cip_project_categories);
      allCats.sort((a, b) => (a.category_number > b.category_number) ? 1 : ((b.category_number > a.category_number) ? -1 : 0)).map((item) => item.category_name); // eslint-disable-line
      allCats = allCats.map(cat => cat.category_name);

      const bondCategories = Array.from(data.cip_project_categories)
        .filter(cat => parseInt(cat.bond_count, 10) > 0)
        .map(cat => cat.category_name);

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
            selected={selectedCats}
            location={props.location}
            filter_variable={allCats}
            variableString={'categories'}
            setUpdatedURL={setUpdatedURL}
          />

            <h3>Types</h3>
            <CIPFilter
            selected={selectedTypes}
            location={props.location}
            filter_variable={allTypes}
            variableString={'types'}
            setUpdatedURL={setUpdatedURL}
          />
          <hr style={{ marginTop: '5px', marginBottom: '5px' }} />
          <CategoryDetails
            location={props.location}
            // Mystery I have not been able to figure out: if I use the commented code below, and click a box, 
            // an error is thrown. Is it fine doing it the way that works, even though it's different from 
            // how it's done in the CIPfilter component?
            // categories={selectedCats}
            // types={selectedTypes}
            categories={getSelectedFromURL().categories}
            types={getSelectedFromURL().types}
            sortedCategories={allCats}
          />
        </div>
      );
    }}
  </Query>
  );
};

export default withLanguage(CapitalProjectsSummary);
