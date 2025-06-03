import React, { useEffect, useState, useRef } from "react";

import Collapsible from "../../shared/Collapsible";
import ProjectsTable from "./ProjectsTable";
import {
  getFundsAllocatedAndExpended,
  filterProjects,
  getIcon,
} from "./cip_utilities";
import Icon from "../../shared/Icon";
import { IM_INFO } from "../../shared/iconConstants";
import { withLanguage } from "../../utilities/lang/LanguageContext";
import { english } from "./english";
import { spanish } from "./spanish";
import ProjectMap from "../../shared/visualization/ProjectMap";
import CIPMap from "./CIPMap";
import CPCheckboxes from "./CPCheckboxes";
import { browserHistory } from "react-router";
import { iconDictionary } from "./CIPIcons";
import { CIPcolors } from "./CIPColors";

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
  let [categories, setCategories] = useState([
    "Transportation & Infrastructure",
    "Housing Program",
    "Parks & Recreation",
    "Building Construction",
    "Water",
    "Other"
  ]);
  let [dataFromTable, setDataFromTable] = useState([]);
  console.log(props.categories)

  const prevLocationRef = useRef(props.location);

  useEffect(() => {
    if (props.location !== prevLocationRef.current) {
      console.log('Location changed to:', props.location.pathname);
      // Do something like re-fetch data
      prevLocationRef.current = props.location;
    }
  }, [props.location]);



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
            color: '#004987',
            popup: `<strong><a href="/capital_projects/${d.gis_id}">${d.display_name}</a></strong><br/>
    <span>
      <i
        class="bi ${iconDictionary[d.category]}"
        style="font-size: .8rem; margin-right: 3px; color: rgb(64, 119, 165);"
      ></i>${d.category}</span><br/>
    ${d.project_description ? d.project_description : ""}`,
          })
        );
      })
      .flat();
  }

  useEffect(() => {
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

  // const actualTypes = props.types;
  const actualTypes = allTypes;

  const actualCategories = categories;
  actualCategories.sort(
    (a, b) =>
      props.sortedCategories.indexOf(a) > props.sortedCategories.indexOf(b)
  );

  const handleMarkerClick = (id) => {
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
  }, [location.search]);

  useEffect(() => {
    setSelected(getSelectedFromURL());
    const uniqueNames = [
      ...new Set(props.data.map((item) => item.type)),
    ];
  }, [props.data]);

  useEffect(() => {
    const arraysAreDifferent = (arr1, arr2) => {
      if (arr1.length !== arr2.length) return true;
      for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return true;
      }
      return false;
    };

    setUpdatedData(
      filterProjects(
        props.data,
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
  }, [updatedData]);

  function clearURLParams() {
    const baseUrl = location.pathname;
    browserHistory.replace(baseUrl);
  }

  return (
    <div>
      <div className="row" style={{marginBottom: "10px"}}>
        <div className="col-sm-12">
          <Icon path={IM_INFO} size={16} color="#4077a7" />
          <a href="/capital_projects/about" style={{ marginLeft: "4px" }}>
            Click here to learn more about Capital Projects
          </a>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12">
          <div
            className="map-container"
            style={{ height: "500px", width: "100%" }}
          >
            <CIPMap
              data={mapData}
              center={[35.5951, -82.5515]}
              height="100%"
              width="100%"
              zoom={12}
              eventHandlers={{ click: handleMarkerClick }}
            />
          </div>
          <div className="funding-summary">
            <div className="col-sm-4 col-xs-4">
              <h2>
                <span className="label-text">
                  <span
                    title={content.total_budget_note} // eslint-disable-line
                    style={{ marginRight: "5px" }}
                  ></span>
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
          <p>Placehoder for budget info blurb</p>
          <div style={{ marginTop: "5px" }}>
            <div
              style={{
                backgroundColor: "rgb(64, 119, 165)",
                color: "white",
                outline: "#4579B3 3px solid",
                padding: "2px 15px"
              }}
            >
              <span>Filters</span>
            </div>
            <div
              style={{
                outline: "#4579B3 3px solid",
                padding: "10px 15px 5px",
              }}
            >
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
          </div>
          {updatedData === undefined ? (
            <div
              style={{ marginTop: "20px" }}
              className="alert alert-info alert-sm"
            >
              {content.select_a_category}
            </div>
          ) : (
            <ProjectsTable
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
