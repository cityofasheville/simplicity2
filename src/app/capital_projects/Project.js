import Map from "../../shared/visualization/Map";
import React from "react";
import PropTypes from "prop-types";
import gql from "graphql-tag";
import moment from "moment";
import { Query } from "react-apollo";
import LoadingAnimation from "../../shared/LoadingAnimation";
import Icon from "../../shared/Icon";
import {
  IM_QUESTION,
  IM_SPHERE3,
  IM_CIRCLE2,
} from "../../shared/iconConstants";
import { getIcon } from "./cip_utilities";

// import PermitsMap from './PermitsMap';
// // import PermitSearchBar from './PermitSearchBar';
// // import PermitSearchWrapper from "./PermitSearchWrapper";
import SuggestSearchWrapper from "../search/SuggestSearchWrapper";
// import PermitTimeline from './PermitTimeline';
// import { permitFieldFormats } from './utils';
// import { orderedDates } from '../trc/textContent';
// import { getTRCTypeFromPermit } from '../trc/utils';
// import { statusTranslation } from '../utils';

const getStageNumber = (stage) => {
  switch (stage) {
    case "Planning":
      return 1;
    case "Design":
      return 2;
    case "Construction":
      return 3;
    case "Completed":
      return 4;
    case "Ongoing":
      return 5;
    default:
      return 0;
  }
};

function getStageColors(stage, isText = false) {
  switch (stage) {
    case "Planning":
      if (isText) {
        return "#86298a";
      }
      return "#f844ff";
    case "Design":
      if (isText) {
        return "#17607a";
      }
      return "#44cdff";
    case "Construction":
      if (isText) {
        return "#a13210";
      }
      return "#FF5722";
    case "Completed":
      if (isText) {
        return "#317501";
      }
      return "#57d500";
    default:
      return "#57d500";
  }
}

// const phaseColor = (phaseNumber) => {
//     switch (phaseNumber) {
//       case 1:
//         return '#f844ff';
//       case 2:
//         return '#44cdff';
//       case 3:
//         return '#FF5722';
//       default:
//         return '#57d500';
//     }
//   };

const phaseColor = (phaseNumber, isText = false) => {
  switch (phaseNumber) {
    case 1:
      if (isText) {
        return "#86298a";
      }
      return "#f844ff";
    case 2:
      if (isText) {
        return "#17607a";
      }
      return "#44cdff";
    case 3:
      if (isText) {
        return "#a13210";
      }
      return "#FF5722";
    default:
      if (isText) {
        return "#317501";
      }
      return "#57d500";
  }
};

// const phaseColor = (phaseNumber) => {
//   switch (phaseNumber) {
//     case 1:
//       return "#86298a";
//     case 2:
//       return "#17607a";
//     case 3:
//       return "#a13210";
//     default:
//       return "#317501";
//   }
// };

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
const dateFormatter = (inputDate) =>
  moment(new Date(inputDate)).format("MMMM DD, YYYY");

const Project = (props) => (
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
            <div className={`alert alert-danger`} style={{ margin: "2rem 0" }}>
              There was an error retrieving this project. If this problem
              perists, please contact help@ashevillenc.gov.
            </div>

            <SuggestSearchWrapper searchMode="project" />
          </div>
        );
      }

      if (
        data.cip_projects === undefined ||
        data.cip_projects.find((obj) => obj.gis_id === props.routeParams.id) ===
          undefined
      ) {
        console.log("GQL returned no results");
        return (
          <div className="container">
            <h1 className="title__text">Project Details</h1>
            <div className={`alert alert-warning`} style={{ margin: "2rem 0" }}>
              No project found for ID "{props.routeParams.id}". Please verify
              the project ID and try again.
            </div>
            <SuggestSearchWrapper searchMode="permit" />
          </div>
        );
      }

      console.log(data);
      const project = data.cip_projects.find(
        (obj) => obj.gis_id === props.routeParams.id
      );
      console.log(
        "project",
        data.cip_projects === undefined ||
          data.cip_projects.find(
            (obj) => (obj.gis_id === props.routeParams.id) === undefined
          )
      );

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
          console.log("POINTs", [
            [points[yMinIndex].y, points[xMinIndex].x],
            [points[yMaxIndex].y, points[xMaxIndex].x],
          ]);
          return [
            [points[yMinIndex].y, points[xMinIndex].x],
            [points[yMaxIndex].y, points[xMaxIndex].x],
          ];
        }
        return null;
      };

      // const containerStyle = {
      //   display: "flex",
      //   justifyContent: "space-between",
      //   padding: "20px",
      //   border: 'solid'

      // };

      const containerStyle = {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        border: "solid",
        gap: "10px", // optional: adds consistent spacing
      };

      // const columnStyle = {
      //   display: "flex",
      //   flexDirection: "column",
      //   alignItems: "center",
      //   margin: "0 10px",
      //   border: 'solid'
      // };

      const columnStyle = {
        background: "rgb(242, 242, 242)",
        display: "flex",
        flexDirection: "column", // stack children vertically
        justifyContent: "center", // vertical alignment
        alignItems: "center", // horizontal alignment
        height: "120px",
        // border: "1px solid black",
        // marginBottom: "10px",
        // margin: "10px",
        // width: '24%',
        // marginRight: '1%',
        // boxSizing: 'border-box', 
        // padding: "20px"
        border: "4px solid white",
        textAlign: "center",
        // whiteSpace: "nowrap"
      };

      const titleStyle = {
        fontWeight: "bold",
        marginBottom: "5px",
        whiteSpace: "nowrap",
      };

      const valueStyle = {
        color: "#333",
        whiteSpace: "nowrap",
      };

      const columnClass = "col-xs-12 col-sm-6 col-md-3";

      return (
        <main className="container">
          <h1 className="title__text">{project.display_name}</h1>
          {project.project_webpage_more_information && (
            <div style={{ marginTop: "16px" }}>
              <a href={project.project_webpage_more_information}>
                {" "}
                <span>{getIcon("Sphere")}</span> Project Website
              </a>
            </div>
          )}
          <h2>Overview</h2>

          

          <p className="permit-description" style={{ marginTop: "16px" }}>
            {project.project_description}
          </p>

          {project.project_updates && (
            <div>
              <h2>Updates</h2>
              {project.project_updates}
            </div>
          )}

<div className="row" style={{paddingRight: "16px", paddingLeft: "1px", marginTop: "40px"}}>
            <div className={columnClass} style={columnStyle}>
              <div className="" style={titleStyle}>
                Phase
              </div>
            
              {project.status !== null && (
                <div style={{ whiteSpace: "nowrap" }}>
                {project.status !== 'Proposed' && <div className="capital-project__status" style={{ whiteSpace: "nowrap" }}>
                  <span
                    className="project-status"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    <Icon
                      path={IM_CIRCLE2}
                      size={25}
                      color={
                        getStageNumber(project.status) >= 1
                          ? phaseColor(1)
                          : "#ffffff"
                      }
                    />
                  </span>
                  <span className="project-status">
                    <Icon
                      path={IM_CIRCLE2}
                      size={25}
                      color={
                        getStageNumber(project.status) >= 2
                          ? phaseColor(2)
                          : "#ffffff"
                      }
                    />
                  </span>
                  <span className="project-status">
                    <Icon
                      path={IM_CIRCLE2}
                      size={25}
                      color={
                        project.status === "Ongoing"
                          ? "#FFC107"
                          : getStageNumber(project.status) >= 3
                          ? phaseColor(3)
                          : "#ffffff"
                      }
                    />
                  </span>
                  {project.status !== "Ongoing" && (
                    <span className="project-status">
                      <Icon
                        path={IM_CIRCLE2}
                        size={25}
                        color={
                          getStageNumber(project.status) >= 4
                            ? phaseColor(4)
                            : "#ffffff"
                        }
                      />
                    </span>
                  )}
                  <span
                    style={{
                      color:
                        project.status === "Ongoing"
                          ? "#FFC107"
                          : phaseColor(getStageNumber(project.status)),
                    }}
                  >

                  </span>

                  <span
                      style={{
                        color: phaseColor(getStageNumber(project.status), true), whiteSpace: "nowrap",
                      }}
                    >
                      {project.status}
                    </span>
                </div>}

                </div>
                
              )}
            </div>

            {project.category && (
              <div style={columnStyle} className={columnClass}>
                <div style={titleStyle}>Category</div>
                <div style={valueStyle}>
                  <span>{getIcon(project.category)}</span>
                  <span style={{whiteSpace: "normal"}}>{project.category}</span>
                </div>
              </div>
            )}

            {project.zip_code && (
              <div style={columnStyle} className={columnClass}>
                <div style={titleStyle}>Zip Code</div>
                <div style={valueStyle}>
                  <span>{project.zip_code}</span>
                </div>
              </div>
            )}

            {project.estimated_construction_duration && (
              <div style={columnStyle} className={columnClass}>
                <div style={titleStyle}>Estimated construction timeframe</div>
                <div style={valueStyle}>
                  <span>{project.estimated_construction_duration}</span>
                </div>
              </div>
            )}

            {project.owner_department && (
              <div style={columnStyle} className={columnClass}>
                <div style={titleStyle}>Owner Department</div>
                <div style={valueStyle}>
                  <span style={{whiteSpace: "normal"}}>{project.owner_department}</span>
                </div>
              </div>
            )}
          </div>

          <div className="row permit-map-row" style={{ marginTop: "10.5px" }}>
            <div
              className="col-sm-12 col-md-6 permit-map-container"
              style={{ marginTop: "62.5px" }}
            >
              <Map
                data={getMyPoints(project)}
                bounds={calculateBounds(getMyPoints(project))}
                height="300px"
              />
            </div>
            <div
              className={`col-sm-12 col-md-${
                showMap ? 6 : 12
              } permit-details-card`}
            >
              <h2>Funding</h2>

              {project.type && (
                <div className="permit-form-group">
                  <div className="display-label">Funding Type</div>
                  <div className="formatted-val">
                    <span>{project.type}</span>
                  </div>
                </div>
              )}

              {project.total_project_funding_budget_document && (
                <div className="permit-form-group">
                  <div className="display-label">Budget</div>
                  <div className="formatted-val">
                    <span>{project.total_project_funding_budget_document}</span>
                  </div>
                </div>
              )}

              {project.encumbered && (
                <div className="permit-form-group">
                  <div className="display-label">Under Contract</div>
                  <div className="formatted-val">
                    <span>
                      {[
                        "$",
                        parseInt(project.encumbered, 10).toLocaleString(),
                      ].join("")}
                    </span>
                  </div>
                </div>
              )}

              {project.total_spent && (
                <div className="permit-form-group">
                  <div className="display-label">Spent</div>
                  <div className="formatted-val">
                    <span>
                      {[
                        "$",
                        parseInt(project.total_spent, 10).toLocaleString(),
                      ].join("")}
                    </span>
                  </div>
                </div>
              )}
              {/* {
                project.map(d => d)} */}

              {/* {project.project_updates && (
                <div className="permit-form-group">
                  <div
                    className="display-label"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Project Updates
                  </div>
                  <div style={{ width: "100%" }}>
                    <span style={{ display: "block", textAlign: "right" }}>
                      {project.project_updates}
                    </span>
                  </div>
                </div>
              )} */}
            </div>
          </div>
          {/* <hr /> */}

          {/* <div className="row"> */}
          <div style={{ marginTop: "21px" }}>
            <div className="">
              <h2>Project Contact</h2>
              <ul style={{ listStyleType: "none" }}>
                <li>{project.coa_contact}</li>
                <li>{project.phone_number}</li>
                <li>{project.email_address}</li>
              </ul>
            </div>
            {/* </div> */}
          </div>
        </main>
      );
    }}
  </Query>
);

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

// {project.category && (
//   <div className="permit-form-group">
//     <div className="display-label">Category</div>
//     <div className="formatted-val">
//       <span>{project.category}</span>
//     </div>
//   </div>
// )}

// {project.zip_code && (
//   <div className="permit-form-group">
//     <div className="display-label">Zip Code</div>
//     <div className="formatted-val">
//       <span>{project.zip_code}</span>
//     </div>
//   </div>
// )}
// {/*
// {project.status && (
//   <div className="permit-form-group">
//     <div className="display-label">Phase</div>
//     <div className="formatted-val">
//       <span>
//         {project.status}
//       </span>
//     </div>
//   </div>
// )} */}

// {project.estimated_construction_duration && (
//   <div className="permit-form-group">
//     <div className="display-label">
//       Estimated construction timeframe
//     </div>
//     <div className="formatted-val">
//       <span>{project.estimated_construction_duration}</span>
//     </div>
//   </div>
// )}

// {project.owner_department && (
//   <div className="permit-form-group">
//     <div className="display-label">Owner Department</div>
//     <div className="formatted-val">
//       <span>{project.owner_department}</span>
//     </div>
//   </div>
// )}
// </div>
{
  /* <div className="col-sm-12 col-md-6 permit-details-card">
              <h3>Contact</h3>
              <div className="permit-form-group">
                <div className="display-label">Department</div>
                <div className="formatted-val">
                  <span>{project.administering_department}</span>
                </div>
              </div>
              <div className="permit-form-group">
                <div className="display-label">Contact Name</div>
                <div className="formatted-val">
                  <span>{project.coa_contact}</span>
                </div>
              </div>
              <div className="permit-form-group">
                <div className="display-label">Phone</div>
                <div className="formatted-val">
                  <span>{project.phone_number}</span>
                </div>
              </div>
              <div className="permit-form-group">
                <div className="display-label">Email</div>
                <div className="formatted-val">
                  <span>{project.email_address}</span>
                </div>
              </div>
            </div> */
}
