import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import LoadingAnimation from "../../shared/LoadingAnimation";
import Error from "../../shared/Error";
import CIPMainDashboard from "./CIPMainDashboard";
import { CIPTextReplacements } from "./CIPTextReplacements";

const GET_PROJECTS = gql`
  query cip_projects($categories: [String]) {
    cip_projects(categories: $categories) {
      gis_id
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

const ProjectDataWrapper = (props) => {
  return (
    <Query
      query={GET_PROJECTS}
      variables={{
        categories: props.categories,
        types: props.types,
      }}
    >
      {({ loading, error, data }) => {
        if (loading) return <LoadingAnimation />;
        if (error) return <Error message={error.message} />;

        const actualCategories = props.categories;
        actualCategories.sort(
          (a, b) =>
            props.sortedCategories.indexOf(a) >
            props.sortedCategories.indexOf(b)
        );

        //filtering categoies to remove dcref
        let filteredCategories = props.categories.filter(
          (category) => category !== "DCREF"
        );

        // changing any misc categories to "Other"
        let projectData = [];
        for (let project of data.cip_projects) {
          if (project.gis_id) {
            if (filteredCategories.includes(project.category)) {
              projectData.push(project);
            } else {
              project.category = "Other";
              projectData.push(project);
            }
          }

          if (CIPTextReplacements[project.type]) {
            project.type = CIPTextReplacements[project.type];
          }
        }

        //types is used in query, which is why we wait until after query to update the text
        let typesUpdated = [
          "Bond 2016",
          "Bond 2024",
          "Capital Improvement Plan",
          "Helene Recovery",
        ];

        return (
          <div>
            <CIPMainDashboard
              location={props.location}
              categories={filteredCategories}
              types={typesUpdated}
              sortedCategories={filteredCategories}
              data={projectData}
            />
          </div>
        );
      }}
    </Query>
  );
};

export default ProjectDataWrapper;
