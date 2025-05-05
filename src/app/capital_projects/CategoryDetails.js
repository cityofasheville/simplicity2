import React, { useEffect, useState } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Collapsible from "../../shared/Collapsible";
import ProjectsTable from "./ProjectsTable";
import { getFundsAllocatedAndExpended, filterProjects, getIcon } from "./cip_utilities";
import Icon from "../../shared/Icon";
import {
  IM_SHIELD3,
  IM_TREE,
  IM_HOME2,
  IM_BUS,
  LI_BOLD,
  IM_INFO,
  IM_DROPLET,
  IM_HAMMER,
  IM_LOCATION,
  IM_CITY,
  IM_USERS,
  IM_LIBRARY2
} from "../../shared/iconConstants";
import LoadingAnimation from "../../shared/LoadingAnimation";
import Error from "../../shared/Error";
import { withLanguage } from "../../utilities/lang/LanguageContext";
import { english } from "./english";
import { spanish } from "./spanish";
import ProjectsMap from "./ProjectsMap";
import { filter } from "d3-array";
import ProjectsTableRefactor from "./ProjectsTableRefactor";
import CIPFilter from "./CIPFilter";
import CPCheckboxes from "./CPCheckboxes";
import { browserHistory } from "react-router";

// This component receives data from parents, then filters it based on url params (from cip filter only).
// The data is given to the react table component, which filters based on url params for the table column
// That component updates a different data variable in the parent (dataFromTable) which is given to the map component
// voila
// this was set up this way so that the filters and table aren't trying to update the same data variable, as this causes issues

// const getIcon = (type, bond) => {
//   switch (type) {
//     case "Transportation & Infrastructure":
//       if (bond) {
//         return (
//           <span>
//             <Icon path={IM_BUS} size={25} color="#4077a5" />
//             <Icon
//               path={LI_BOLD}
//               size={16}
//               color="#4077a5"
//               viewBox="0 0 24 24"
//             />
//           </span>
//         );
//       }
//       return <Icon path={IM_BUS} size={25} color="#4077a5" />;
//     case "Parks & Recreation":
//       if (bond) {
//         return (
//           <span>
//             <Icon path={IM_TREE} size={25} color="#4077a5" />
//             <Icon
//               path={LI_BOLD}
//               size={16}
//               color="#4077a5"
//               viewBox="0 0 24 24"
//             />
//           </span>
//         );
//       }
//       return <Icon path={IM_TREE} size={25} color="#4077a5" />;
//     case "Housing Program":
//       if (bond) {
//         return (
//           <span>
//             <Icon path={IM_HOME2} size={25} color="#4077a5" />
//             <Icon
//               path={LI_BOLD}
//               size={16}
//               color="#4077a5"
//               viewBox="0 0 24 24"
//             />
//           </span>
//         );
//       }
//       return <Icon path={IM_HOME2} size={25} color="#4077a5" />;
//     case "Public Safety":
//       return <Icon path={IM_SHIELD3} size={25} color="#4077a5" />;
//     case "Water":
//       return <Icon path={IM_DROPLET} size={25} color="#4077a6" />;
//     case "Building Construction":
//       return <Icon path={IM_HAMMER} size={25} color="#4077a6" />;
//     case "Entertainment Facilities":
//       return <Icon path={IM_CITY} size={25} color="#4077a5" />;
//     case "Other":
//       return (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           height="25px"
//           transform="translate(0,4)"
//           version="1.1"
//           viewBox="0 0 16 16"
//           width="25px"
//         >
//           <g
//             fill="none"
//             fillRule="evenodd"
//             id="Icons with numbers"
//             stroke="none"
//             strokeWidth="1"
//           >
//             <g
//               fill="#4077a5"
//               id="Group"
//               transform="translate(-528.000000, -576.000000)"
//             >
//               <path
//                 d="M536,592 C531.581722,592 528,588.418278 528,584 C528,579.581722 531.581722,576 536,576 C540.418278,576 544,579.581722 544,584 C544,588.418278 540.418278,592 536,592 Z M541,586 C542.10457,586 543,585.10457 543,584 C543,582.89543 542.10457,582 541,582 C539.89543,582 539,582.89543 539,584 C539,585.10457 539.89543,586 541,586 Z M531,586 C532.10457,586 533,585.10457 533,584 C533,582.89543 532.10457,582 531,582 C529.89543,582 529,582.89543 529,584 C529,585.10457 529.89543,586 531,586 Z M536,586 C537.10457,586 538,585.10457 538,584 C538,582.89543 537.10457,582 536,582 C534.89543,582 534,582.89543 534,584 C534,585.10457 534.89543,586 536,586 Z M536,586"
//                 id="Oval 12 copy"
//               />
//             </g>
//           </g>
//         </svg>
//       );
//     default:
//       return null;
//   }
// };

const getDollars = (value) => {
  let formatted;
  if (Math.abs(value) > 1000000) {
    formatted = (Math.abs(value) / 1000000).toFixed(1).toLocaleString();
    if (formatted[formatted.length - 1] === "0") {
      formatted = formatted.slice(0, -2);
    }
    return [value < 0 ? "-$" : "$", formatted, " M"].join("");
  } else if (Math.abs(value) > 1000) {
    return [
      value < 0 ? "-$" : "$",
      (Math.abs(value) / 1000).toFixed(0).toLocaleString(),
      " k",
    ].join("");
  }
  return [
    value < 0 ? "-$" : "$",
    Math.abs(value).toFixed(0).toLocaleString(),
  ].join("");
};

function CategoryDetails(props) {
  let [targetProject, setTargetProject] = useState("");
  let [updatedData, setUpdatedData] = useState([]);
  let [mapData, setMapData] = useState([]);
  let [totalSpent, setTotalSpent] = useState("");
  let [totalUnderCon, setTotalUnderCon] = useState("");
  let [totalBudget, setTotalBudget] = useState("");
  const allTypes = ["Bond 2016", "Bond 2024", "Operating Budget", "Helene"];
  let [types, setTypes] = useState([]);
  let [categories, setCategories] = useState([]);
  let [dataFromTable, setDataFromTable] = useState([]);

  function processUpdatedData(data) {
    let formattedData = [];
    for (let i = 0; i < data.length; i++) {
      formattedData.push(data[i]);
    }
    return formattedData
      .filter(
        (d) =>
          (Array.isArray(d.longitude) ? d.longitude.length > 0 : d.longitude) &&
          (Array.isArray(d.latitude) ? d.latitude.length > 0 : d.latitude)
      ) // Ensure latitude and longitude are valid
      .map((d) => {
        const coordinates =
          Array.isArray(d.longitude) && Array.isArray(d.latitude)
            ? d.longitude.map((lat, index) => ({
                x: lat,
                y: d.latitude[index],
              }))
            : [{ x: d.longitude, y: d.latitude }];

        return coordinates.map((coord) =>
          Object.assign({}, d, {
            x: coord.x,
            y: coord.y,
            popup: `<strong><a href="/capital_projects/${d.gis_id}">${d.display_name}</a></strong><br/>
        ${d.project_description ? d.project_description : ""}`

          })
        );
      })
      .flat();
  }

  useEffect(() => {
    console.log("Updating map data now", dataFromTable);
    setMapData(processUpdatedData(dataFromTable));

    let formattedData = [];
    for (let i = 0; i < dataFromTable.length; i++) {
      formattedData.push(dataFromTable[i]);
    }

    let fundingDetails = getFundsAllocatedAndExpended(
      formattedData,
      actualCategories,
      props.location.query.mode
    );
    setTotalBudget(fundingDetails[0].allocated);
    setTotalSpent(fundingDetails[0]["Expended funds"]);
    setTotalUnderCon(fundingDetails[0]["Under contract"]);
  }, [dataFromTable]);

  // set language
  let content;
  switch (props.language.language) {
    case "Spanish":
      content = spanish;
      break;
    default:
      content = english;
  }

  const getBondText = (type) => {
    switch (type) {
      case "Transportation & Infrastructure":
        return content.transportation_bond_info;
      case "Parks & Recreation":
        return content.parks_bond_info;
      case "Housing Program":
        return content.housing_bond_info;
      default:
        return "";
    }
  };

  function getKeyText(categories) {
    <div>
      <p>
        <span>
          {[
            "Transportation & Infrastructure",
            "Housing Program",
            "Parks & Recreation",
            "Water",
            "Building Construction",
            "Other",
          ].map((cat, index) => {
            if (categories.includes(cat)) {
              return (
                <span
                  key={index}
                  style={
                    categories.indexOf(cat) !== 0
                      ? { marginLeft: "10px", color: "#4077a5" }
                      : { marginLeft: "0px", color: "#4077a5" }
                  }
                >
                  {getIcon(cat)}&nbsp;<b>{cat}</b>
                </span>
              );
            }
            return null;
          })}
        </span>
        <span style={{ marginLeft: "5px" }}>
          {categories.slice(0, categories.length - 1).join(", ")}{" "}
          {categories.length > 1 ? "and" : ""}{" "}
          {categories[categories.length - 1]} {content.funding_info}
        </span>
        {categories.includes("Other") && (
          <span>&nbsp;{content.other_category_note}</span>
        )}
      </p>
      {[
        "Transportation & Infrastructure",
        "Housing Program",
        "Parks & Recreation",
      ].map((cat, index) => {
        if (categories.includes(cat)) {
          return (
            <p key={index}>
              <span style={{ color: "#4077a5" }}>
                {getIcon(cat, true)}&nbsp;<b>{cat} Bond</b>
              </span>
              <span style={{ marginLeft: "5px" }}>{getBondText(cat)}</span>
            </p>
          );
        }
        return null;
      })}
    </div>;
  }

  const actualTypes = props.types;
  const actualCategories = props.categories;
  actualCategories.sort(
    (a, b) =>
      props.sortedCategories.indexOf(a) > props.sortedCategories.indexOf(b)
  );

  const handleMarkerClick = (id) => {
    // console.log("Anything")
    setMarkers((prevMarkers) =>
      prevMarkers.map((marker) =>
        marker.id === id
          ? { ...marker, visible: true }
          : marker.id === id
          ? { ...marker, visible: false }
          : marker
      )
    );
  };

  const getSelectedFromURL = () => {
    let url = window.location.href;
    const params = new URLSearchParams(url.split("?")[1]);

    let selected = {
      categories: [],
      types: [],
    };

    if (params.has("categories")) {
      selected.categories =
        params.get("categories") === ""
          ? []
          : params.get("categories").split(",");
    } else {
      selected.categories = props.sortedCategories;
    }

    if (params.has("types")) {
      selected.types =
        params.get("types") === "" ? [] : params.get("types").split(",");
    } else {
      selected.types = allTypes;
    }

    return selected;
  };

  let [selected, setSelected] = useState(getSelectedFromURL());

  useEffect(() => {
    setSelected(getSelectedFromURL());
    console.log("selected", selected);
  }, [location.search]);

  useEffect(() => {
    setSelected(getSelectedFromURL());
    const uniqueNames = [
      ...new Set(props.filteredProjects.map((item) => item.type)),
    ];
    console.log("TYPE VALUES", uniqueNames);
  }, [props.filteredProjects]);

  useEffect(() => {
    const arraysAreDifferent = (arr1, arr2) => {
      if (arr1.length !== arr2.length) return true;
      for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return true;
      }
      return false;
    };

    console.log(types, selected.types, categories, selected.categories);
    console.log(
      "IS THIS WORKING",
      filterProjects(
        props.filteredProjects,
        selected.categories,
        selected.types,
        props.location.query.mode
      )
    );
    setUpdatedData(
      filterProjects(
        props.filteredProjects,
        selected.categories,
        selected.types,
        props.location.query.mode
      )
    );

    setTypes(selected.types);
    setCategories(selected.categories);
    //}
  }, [selected]);

  useEffect(() => {
    console.log("UPDDAAAATED", updatedData);
  }, [updatedData]);

  function clearURLParams() {
    const baseUrl = location.pathname;
    browserHistory.replace(baseUrl);
  }

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
                    style={{ marginRight: "5px" }}
                  >
                    <Icon path={IM_INFO} size={16} color="#4077a7" />
                  </span>
                  {content.total_budget}:
                </span>
                <span className="amount">{getDollars(totalBudget)}</span>
              </h2>
            </div>
            <div className="col-sm-4 col-xs-4">
              <h2>
                <span className="label-text">{content.under_contract}:</span>
                <span className="amount">{getDollars(totalUnderCon)}</span>
              </h2>
            </div>
            <div className="col-sm-4 col-xs-4">
              <h2>
                <span className="label-text">{content.spent}:</span>
                <span className="amount">{getDollars(totalSpent)}</span>
              </h2>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <a href="/capital_projects/about">Click here to learn more about Capital Projects</a>
            </div>
          </div>
          <div
            className="map-container"
            style={{ height: "350px", width: "100%" }}
          >
            <ProjectsMap
              permitData={mapData}
              zoom={12}
              centerCoords={[35.5951, -82.5515]}
              eventHandlers={{ click: handleMarkerClick }}
              style={{ marginBottom: "10px" }}
            />
          </div>
          <div style={{ marginTop: "10px" }}>
            <Collapsible trigger="Filters">
              {getKeyText(actualCategories, props.location.query.mode)}
              <div>
                <div className="row" style={{ marginBottom: "16px" }}>
                  <button
                    style={{
                      backgroundColor: "rgb(64, 119, 165)",
                      color: "white",
                      padding: "2px 5px",
                      margin: "2px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "14px",
                      display: "block",
                      marginLeft: "15px",
                    }}
                    onClick={clearURLParams}
                  >
                    Reset Filters
                  </button>

                  <div className="col-md-6 col-xs-12">
                    <h4>Categories</h4>
                    <CPCheckboxes
                      selected={selected.categories}
                      location={props.location}
                      filter_variable={props.sortedCategories}
                      variableString={"categories"}
                    />
                  </div>

                  <div className="col-md-6 col-xs-12">
                    <h4>Funding Types</h4>
                    <CPCheckboxes
                      selected={selected.types}
                      location={props.location}
                      filter_variable={allTypes}
                      variableString={"types"}
                    />
                  </div>
                </div>
              </div>
            </Collapsible>
          </div>
          {updatedData === undefined ? (
            <div
              style={{ marginTop: "20px" }}
              className="alert alert-info alert-sm"
            >
              {content.select_a_category}
            </div>
          ) : (
            <ProjectsTableRefactor
              data={updatedData}
              language={{ language: "English" }}
              updateData={setUpdatedData}
              setDataFromTable={setDataFromTable}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default withLanguage(CategoryDetails);
