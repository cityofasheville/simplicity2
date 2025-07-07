import React from "react";
import PropTypes from "prop-types";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import LoadingAnimation from "../../shared/LoadingAnimation";
import Icon from "../../shared/Icon";
import {
  IM_SPHERE3,
} from "../../shared/iconConstants";
import SuggestSearchWrapper from "../search/SuggestSearchWrapper";
import { Link } from "react-router";
import { useEffect } from "react";
import CIPTimeline from "./CIPTimeline";
import CIPMap from "./CIPMap";
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


function Project(props) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <Query
      query={GET_PROJECTS}
      variables={{
        categories: props.categories,
        types: props.types,
      }}
    >
      {({ loading, error, data }) => {
        if (loading) {
          return <LoadingAnimation />;
        }

        if (error) {
          console.log("GQL error");
          console.log(error);
          return (
            <div className="container">
              <h1 className="title__text">Project Details</h1>
              <div
                className={`alert alert-danger`}
                style={{ margin: "2rem 0" }}
              >
                There was an error retrieving this project. If this problem
                perists, please contact help@ashevillenc.gov.
              </div>

              <SuggestSearchWrapper searchMode="project" />
            </div>
          );
        }

        if (
          data.cip_projects === undefined ||
          data.cip_projects.find(
            (obj) => obj.gis_id === props.routeParams.id
          ) === undefined
        ) {
          console.log("GQL returned no results");
          return (
            <div className="container">
              <h1 className="title__text">Project Details</h1>
              <div
                className={`alert alert-warning`}
                style={{ margin: "2rem 0" }}
              >
                No project found for ID "{props.routeParams.id}". Please verify
                the project ID and try again.
              </div>
              <SuggestSearchWrapper searchMode="permit" />
            </div>
          );
        }

        const project = data.cip_projects.find(
          (obj) => obj.gis_id === props.routeParams.id
        );

        if (CIPTextReplacements[project.type]) {
          project.type = CIPTextReplacements[project.type];
        }

        const showMap =
          project.latitude.length > 0 && project.longitude.length > 0;

        function getMyPoints() {
          return project.latitude.map((y, index) =>
            Object.assign(
              {},
              {},
              {
                x: project.longitude[index],
                y,
                name: project.display_name,
                type: project.type,
                category: project.category
              
              }
            )
          );
        }

        const calculateBounds = (points) => {
          let xMinIndex = 0;
          let yMinIndex = 0;
          let xMaxIndex = 0;
          let yMaxIndex = 0;
          if (points.length > 0) {
            for (let i = 0; i < points.length; i += 1) {
              if (points[i].x < points[xMinIndex].x) {
                xMinIndex = i;
              }
              if (points[i].x > points[xMaxIndex].x) {
                xMaxIndex = i;
              }
              if (points[i].y < points[yMinIndex].y) {
                yMinIndex = i;
              }
              if (points[i].y > points[yMaxIndex].y) {
                yMaxIndex = i;
              }
            }
            return [
              [points[yMinIndex].y, points[xMinIndex].x],
              [points[yMaxIndex].y, points[xMaxIndex].x],
            ];
          }
          return null;
        };


        let buttonText;
        let pathname;
        let previous =
          props.location?.state?.previousPath.split("/capital_projects")[1];
        if (previous) {
          buttonText = "Return to Dashboard";
          pathname = "/capital_projects" + previous;
        } else {
          buttonText = "Go to Dashboard";
          pathname = "/capital_projects";
        }


        return (
          <main className="container">
            <h1 className="title__text">{project.display_name}</h1>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 style={{ margin: 0 }}>Overview</h2>
              <Link to={pathname} className="btn btn-primary">
                {buttonText}{" "}
              </Link>
            </div>
            <p className="permit-description" style={{ marginTop: "16px" }}>
              {project.project_description}
            </p>

            {(project.project_updates || project.project_webpage_more_information) && (
              <div>
                <h2>Updates</h2>
                {project.project_webpage_more_information && (
                  <div style={{ marginTop: "16px", marginBottom: "16px" }}>
                    <a href={project.project_webpage_more_information}>
                      {" "}
                      <span>
                        <Icon
                          path={IM_SPHERE3}
                          size={20}
                          color={"rgb(64, 119, 165)"}
                        />
                      </span>{" "}
                      Project Website
                    </a>
                  </div>
                )}
                {project.project_updates}
              </div>
            )}

            <div style={{ height: "120px" }}>
              <CIPTimeline
                currentStatusItem={undefined}
                phase={project.status}
              ></CIPTimeline>
            </div>
            <div
              className="row"
              style={{
                padding: "11px",
              }}
            >
 
            </div>

            <div className="row permit-map-row" style={{ marginTop: "10.5px" }}>
              {showMap ? (
                <div
                  className="col-sm-12 col-md-6 permit-map-container"
                  style={{ marginTop: "73px" }}
                >
                  <CIPMap
                    data={getMyPoints(project)}
                    center={[35.5951, -82.5515]}
                    height="100%"
                    width="100%"
                    zoom={12}
                    bounds={calculateBounds(getMyPoints(project))}
                    // eventHandlers={{ click: handleMarkerClick }}
                  />
                  {/* <Map
                    data={getMyPoints(project)}
                    bounds={calculateBounds(getMyPoints(project))}
                    height="300px"
                  />{" "} */}
                </div>
              ) : (
                ""
              )}

              <div className={`col-sm-12 col-md-${6} permit-details-card`}>
                <h2>Details</h2>

                <div className="permit-form-group">
                  <div className="display-label">Zip Code</div>
                  <div className="formatted-val">
                    <span>{project.zip_code ? project.zip_code : "TBD"}</span>
                  </div>
                </div>

                <div className="permit-form-group">
                  <div className="display-label">Category</div>
                  <div className="formatted-val">
                    <span>{project.category ? project.category : "TBD"}</span>
                  </div>
                </div>

                <div className="permit-form-group">
                  <div className="display-label">Funding Type</div>
                  <div className="formatted-val">
                    <span>{project.type ? project.type : "TBD"}</span>
                  </div>
                </div>

                <div className="permit-form-group">
                  <div className="display-label">Budget</div>
                  <div className="formatted-val">
                    <span>
                      {project.total_project_funding_budget_document
                        ? project.total_project_funding_budget_document
                        : "TBD"}
                    </span>
                  </div>
                </div>

                <div className="permit-form-group">
                  <div className="display-label">Under Contract</div>
                  <div className="formatted-val">
                    <span>
                      {project.encumbered
                        ? [
                            "$",
                            parseInt(project.encumbered, 10).toLocaleString(),
                          ].join("")
                        : "TBD"}
                    </span>
                  </div>
                </div>

                <div className="permit-form-group">
                  <div className="display-label">Spent</div>
                  <div className="formatted-val">
                    <span>
                      {project.total_spent
                        ? [
                            "$",
                            parseInt(project.total_spent, 10).toLocaleString(),
                          ].join("")
                        : "TBD"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ marginTop: "21px" }}>
              <div className="">
                <h2>Project Contact</h2>
                <address style={{ listStyleType: "none" }}>
                  <div>
                    <span>{project.coa_contact}</span>
                  </div>
                  <div>
                    <a href={`tel:${project.phone_number}`}>
                      {project.phone_number}
                    </a>
                  </div>
                  <div>
                    <a href={`mailto:${project.email_address}`}>
                      {project.email_address}
                    </a>
                  </div>
                </address>
              </div>
            </div>
          </main>
        );
      }}
    </Query>
  );
}

Project.propTypes = {
  routeParams: PropTypes.shape({
    id: PropTypes.string,
  }),
};

Project.defaultProps = {
  routeParams: {
    id: "",
  },
};

export default Project;
