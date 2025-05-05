import React from 'react';

import { Query, useQuery } from 'react-apollo';
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
import CategoryDetailsWrapper from './CategoryDetailsWrapper';
// import { useLocation } from 'react-router-dom';


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
      allCats
  .sort((a, b) => {
    if (a.category_name === "Other") return 1;
    if (b.category_name === "Other") return -1;
    return a.category_number - b.category_number;
  })
  .map(item => item.category_name);
      allCats = allCats.map(cat => cat.category_name);

      return (
        <div>
          <PageHeader
            h1={content.capital_projects}
          >
            <span>{content.search_by_note}</span>
            <br></br>
            <a className="" href="https://gis.ashevillenc.gov/arcgis/apps/experiencebuilder/experience/?id=1397c75f257248b5b030f6b420618e88" target="_blank">
              {content.try_project_map}
            </a>
          </PageHeader>
          <CategoryDetailsWrapper
            location={props.location}
            categories={allCats}
            types ={allTypes}
            sortedCategories={allCats}
          />
        </div>
      );
    }}
  </Query>
  
  );

export default withLanguage(CapitalProjectsSummary);


// import React from "react";
// import { Query } from "react-apollo";
// import gql from "graphql-tag";
// import PageHeader from "../../shared/PageHeader";
// import LoadingAnimation from "../../shared/LoadingAnimation";
// import Error from "../../shared/Error";
// import { english } from "./english";
// import { spanish } from "./spanish";
// import { withLanguage } from '../../utilities/lang/LanguageContext';
// import CategoryDetails from "./CategoryDetails";
// // import CategoryDetailsWrapper from "./";

// const GET_CATEGORIES = gql`
//   query cip_project_categories {
//     cip_project_categories {
//       category_name
//       category_number
//       bond_count
//     }
//   }
// `;

// const GET_PROJECTS = gql`
//   query cip_projects($categories: [String]) {
//     cip_projects(categories: $categories) {
//       project
//       display_name
//       type
//       administering_department
//       owner_department
//       zip_code
//       category
//       coa_contact
//       phone_number
//       email_address
//       project_description
//       project_updates
//       status
//       encumbered
//       total_project_funding_budget_document
//       total_spent
//       target_construction_start
//       target_construction_end
//       actual_construction_end
//       amount_behind_schedule
//       estimated_construction_duration
//       project_webpage_more_information
//       communication_plan
//       photo_url
//       latitude
//       longitude
//     }
//   }
// `;

// const CapitalProjectsSummary = (props) => (
//   <Query query={GET_CATEGORIES}>
//     {({ loading, error, data }) => {
//       if (loading) return <LoadingAnimation />;
//       if (error) return <Error message={error.message} />;

//       console.log(data)
//       // Sort and extract category names
//       let allCats = Array.from(data.cip_project_categories);
//       console.log(allCats)

// allCats.sort((a, b) => {
//         if (a.category_name === "Other") return 1;
//         if (b.category_name === "Other") return -1;
//         return a.category_number - b.category_number;
//       });

//       const categoryNames = allCats.map((item) => item.category_name);

//       return (
//         <Query query={GET_PROJECTS} variables={{ categories: categoryNames }}>
//           {({ loading: loadingProjects, error: errorProjects, data: projectData }) => {
//             if (loadingProjects) return <LoadingAnimation />;
//             if (errorProjects) return <Error message={errorProjects.message} />;

//             const content = props.language.language === "Spanish" ? spanish : english;
//             const allTypes = ["Bond 2016", "Bond 2024", "Operating Budget", "Helene"];

//             return (
//               <div>
//                 {/* <PageHeader h1={content.capital_projects}>
//                   <span>{content.search_by_note}</span>
//                   <br />
//                   <a
//                     className=""
//                     href="https://gis.ashevillenc.gov/arcgis/apps/experiencebuilder/experience/?id=1397c75f257248b5b030f6b420618e88"
//                     target="_blank"
//                   >
//                     {content.try_project_map}
//                   </a>
//                 </PageHeader> */}
//                 <CategoryDetails
//               location={props.location}
//               categories={allCats}
//               types={allTypes}
//               sortedCategories={allCats}
//               filteredProjects={projectData}
//             />
//               </div>
//             );
//           }}
//         </Query>
//       );
//     }}
//   </Query>
// );

// export default withLanguage(CapitalProjectsSummary);

