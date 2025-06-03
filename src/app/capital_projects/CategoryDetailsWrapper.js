import React, { useEffect, useState } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { getFundsAllocatedAndExpended, filterProjects } from "./cip_utilities";
import LoadingAnimation from "../../shared/LoadingAnimation";
import Error from "../../shared/Error";
import CategoryDetails from "./CategoryDetails";

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

const CategoryDetailsWrapper = (props) => {

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

        // const actualTypes = props.types;
        const actualCategories = props.categories;
        actualCategories.sort(
          (a, b) =>
            props.sortedCategories.indexOf(a) >
            props.sortedCategories.indexOf(b)
        );
        // const filteredProjects = filterProjects(
        //   data.cip_projects,
        //   actualCategories,
        //   actualTypes,
        //   props.location.query.mode
        // );

        // const fundingDetails = getFundsAllocatedAndExpended(
        //   filteredProjects,
        //   actualCategories,
        //   props.location.query.mode
        // );

        //filtering categoies to remove dcref
        let filteredCategories = props.categories.filter(category => category !== "DCREF");

        // changing any misc categories to "Other"
        let projectData = [];
        for (let project of data.cip_projects) {
          if (filteredCategories.includes(project.category)) {
            projectData.push(project)
          } else {
            project.category = "Other";
            projectData.push(project)
          }
        }


        return (
          <div>
            <CategoryDetails
              location={props.location}
              categories={filteredCategories}
              types={props.types}
              sortedCategories={filteredCategories}
              data={projectData}
            />
          </div>
        );
      }}
    </Query>
  );
};

export default CategoryDetailsWrapper;
