import React, { useEffect, useState, useRef } from "react";
import ProjectsTable from "./ProjectsTable";
import { getFundsAllocatedAndExpended, filterProjects } from "./cip_utilities";
import { withLanguage } from "../../utilities/lang/LanguageContext";
import { english } from "./english";
import { spanish } from "./spanish";
import CIPMap from "./CIPMap";
import CPCheckboxes from "./CPCheckboxes";
import { browserHistory, Link } from "react-router";
import { iconDictionary } from "./CIPIcons";

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

function CIPMainDashboard(props) {
  const [updatedData, setUpdatedData] = useState([]);
  const [mapData, setMapData] = useState([]);
  const [totalSpent, setTotalSpent] = useState("");
  const [totalUnderCon, setTotalUnderCon] = useState("");
  const [totalBudget, setTotalBudget] = useState("");
  const [dataFromTable, setDataFromTable] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState(getSelectedFromURL());
  const content = english;
  const rawZipCodes = props.data.map((item) => item.zip_code);
  const zipSet = new Set(rawZipCodes);
  zipSet.delete("Citywide");
  const sortedZips = [...zipSet].sort();
  const uniqueZipCodes = ["All", "Citywide", ...sortedZips];
  const actualCategories = props.categories;  

  useEffect(() => {
    const baseUrl = location.pathname;
    const params = new URLSearchParams(location.href.split("?")[1]);
    let selected = {
      categories: [],
      types: [],
    };

    if (params.has("categories")) {
      const rawCategories = params.get("categories");
      selected.categories =
        rawCategories === ""
          ? []
          : rawCategories
              .split(",")
              .filter((cat) => props.categories.includes(cat));
    } else {
      selected.categories = props.categories;
    }

    if (params.has("types")) {
      const rawTypes = params.get("types");
      selected.types =
        rawTypes === ""
          ? []
          : rawTypes.split(",").filter((type) => props.types.includes(type));
    } else {
      selected.types = props.types;
    }

    const newParams = new URLSearchParams(location.search);

    if (
      params.has("categories") ||
      selected.categories.length !== props.categories.length
    ) {
      newParams.set("categories", selected.categories.join(","));
    }

    if (params.has("types") || selected.types.length !== props.types.length) {
      newParams.set("types", selected.types.join(","));
    }

    const updatedURL = `${baseUrl}?${newParams.toString()}`;
    browserHistory.replace(updatedURL);
  }, [location.search]);


  useEffect(() => {
    setSelectedFilters(getSelectedFromURL());
  }, [location.search, props.data]);


  useEffect(() => {
    setUpdatedData(
      filterProjects(
        props.data,
        selectedFilters.categories,
        selectedFilters.types
      )
    );
  }, [selectedFilters]);
  

  useEffect(() => {
    //when the data from the table updates, the map and budget data are updated
    setMapData(processUpdatedData(dataFromTable));

    let fundingDetails = getFundsAllocatedAndExpended(
      dataFromTable,
      actualCategories,
      props.location.query.mode
    );
    setTotalBudget(fundingDetails[0].allocated);
    setTotalSpent(fundingDetails[0]["Expended funds"]);
    setTotalUnderCon(fundingDetails[0]["Under contract"]);
  }, [dataFromTable]);

  function clearURLParams() {
    const baseUrl = location.pathname;
    browserHistory.replace(baseUrl);
  }

  return (
    <div>
      <div className="row" style={{ marginBottom: "10px" }}>
        <div className="col-sm-12"></div>
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
              // eventHandlers={{ click: handleMarkerClick }}
            />
          </div>
          <div
            tabIndex={0}
            aria-label="funding summary"
            className="funding-summary"
          >
            <div className="col-sm-4 col-xs-4">
              <h2 tabIndex="-1">
                <span className="label-text">
                  <span
                    title={content.total_budget_note} // eslint-disable-line
                    style={{ marginRight: "5px", color: "rgb(102, 102, 102)" }}
                  >
                    {" "}
                    {content.total_budget}:
                  </span>
                </span>
                <span className="amount">{getDollars(totalBudget)}</span>
              </h2>
            </div>
            <div className="col-sm-4 col-xs-4">
              <h2 tabIndex="-1">
                <span
                  className="label-text"
                  style={{ color: "rgb(102, 102, 102)" }}
                >
                  {content.under_contract}:
                </span>
                <span className="amount">{getDollars(totalUnderCon)}</span>
              </h2>
            </div>
            <div className="col-sm-4 col-xs-4">
              <h2 tabIndex="-1">
                <span
                  className="label-text"
                  style={{ color: "rgb(102, 102, 102)" }}
                >
                  {content.spent}:
                </span>
                <span className="amount">{getDollars(totalSpent)}</span>
              </h2>
            </div>
          </div>

          <div style={{ marginTop: "10px" }}>
            <div
              style={{
                backgroundColor: "rgb(64, 119, 165)",
                color: "white",
                outline: "#4579B3 3px solid",
                padding: "2px 15px",
              }}
            >
              <span>Filters</span>
            </div>
            <div
              style={{
                outline: "#4579B3 3px solid",
                padding: "10px 15px 10px",
              }}
            >
              <div className="row" style={{ marginBottom: "10px" }}>
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
                    selected={selectedFilters.categories}
                    location={props.location}
                    filter_variable={props.categories}
                    variableString={"categories"}
                  />
                </div>

                <div className="col-md-6 col-xs-12">
                  <h4>Funding Types</h4>
                  <CPCheckboxes
                    selected={selectedFilters.types}
                    location={props.location}
                    filter_variable={props.types}
                    variableString={"types"}
                  />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Link
                  to={{
                    pathname: `/capital_projects/about`,
                    state: { previousPath: location.href },
                  }}
                >
                  <i
                    className="bi bi-info-circle"
                    style={{ color: "rgb(64, 119, 165)", marginRight: "4px" }}
                  ></i>
                  Learn more about Capital Projects and Funding
                </Link>
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
              uniqueZipCodes={uniqueZipCodes}
            />
          )}
          <p>Data updated monthly</p>
        </div>
      </div>
    </div>
  );

  function getSelectedFromURL() {
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
      selected.categories = props.categories;
    }

    if (params.has("types")) {
      selected.types =
        params.get("types") === "" ? [] : params.get("types").split(",");
    } else {
      selected.types = props.types;
    }

    return selected;
  }

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
      )
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
            color: "#004987",
            name: d.display_name,
            description: d.description,
            popup: `<div tabIndex={0}><strong><a href="/capital_projects/${
              d.gis_id
            }">${d.display_name}</a></strong><br/>
    <span><i
        className="bi ${iconDictionary[d.category]}"
        style="font-size: .8rem; margin-right: 3px; color: rgb(64, 119, 165);"
      ></i>${d.category}</span><br/>
    <span>${
      d.project_description ? d.project_description.replace(/\u00A0/g, " ") : ""
    }</span></div>`,
          })
        );
      })
      .flat();
  }
}

export default withLanguage(CIPMainDashboard);
