import React from "react";
import PropTypes from "prop-types";
import L from "leaflet";
import { Query } from "react-apollo";
import moment from "moment";
import gql from "graphql-tag";
import LoadingAnimation from "../../shared/LoadingAnimation";
import Error from "../../shared/Error";
import PieChart from "../../shared/visualization/PieChart";
import Map from "../../shared/visualization/Map";
import CrimeTable from "../crime/CrimeTable";
import EmailDownload from "../../shared/EmailDownload";
import ButtonGroup from "../../shared/ButtonGroup";
import Button from "../../shared/Button";
import {
  getBoundsFromPolygonData,
  combinePolygonsFromNeighborhoodList,
} from "../../utilities/mapUtilities";
import { refreshLocation } from "../../utilities/generalUtilities";
import { english } from "./english";
import { spanish } from "./spanish";
import { withLanguage } from "../../utilities/lang/LanguageContext";

const getMarker = (type) => {
  switch (type) {
    case "MISSING PERSON REPORT":
    case "RUNAWAY JUVENILE":
      return require("../../images/User.png");
    case "DAMAGE TO PERSONAL PROPERTY":
    case "VANDALISM":
      return require("../../images/Hammer.png");
    case "ASSAULT - SIMPLE":
    case "ASSAULT ON FEMALE":
    case "ASSAULT W/DEADLY WEAPON":
      return require("../../images/Ambulance.png");
    case "COMMUNICATING THREAT":
      return require("../../images/Bubble.png");
    case "INTIMIDATING STATE WITNESS":
    case "PERJURY":
    case "OBSTRUCTION OF JUSTICE":
      return require("../../images/Library2.png");
    case "FRAUD":
    case "FRAUD-CREDIT CARD":
    case "FALSE PRETENSE - OBTAIN PROPERTY BY":
    case "IMPERSONATE":
      return require("../../images/Profile.png");
    case "CARRYING CONCEALED WEAPON":
      return require("../../images/Gun.png");
    case "RESIST, DELAY, OBSTRUCT OFFICER":
    case "CIT INCIDENT":
    case "DV ASSISTANCE OTHER":
    case "VICTIM ASSISTANCE OTHER":
    case "ASSAULT ON GOVERNMENT OFFICIAL":
      return require("../../images/Shield3.png");
    case "DWI":
    case "UNAUTHORIZED USE OF MOTOR VEHICLE":
      return require("../../images/Car.png");
    case "LARCENY OF MV OTHER":
    case "LARCENY OF MV AUTO":
    case "LARCENY OF MV TRUCK":
      return require("../../images/Car.png");
    case "TRESPASS":
      return require("../../images/Fence.png");
    case "INFORMATION ONLY":
      return require("../../images/Pencil7.png");
    case "DRUG PARAPHERNALIA POSSESS":
    case "DRUG OFFENSE - FELONY":
    case "DRUG OFFENSE - MISDEMEANOR":
    case "DRUG PARAPHERNALIA OTHER":
      return require("../../images/AidKit2.png");
    case "COUNTERFEITING-BUYING/RECEIVING":
      return require("../../images/BillDollar.png");
    case "LARCENY ALL OTHER":
    case "LARCENY FROM BUILDING":
    case "LARCENY FROM MOTOR VEHICLE":
    case "ROBBERY - COMMON LAW":
    case "ROBBERY - ARMED - KNIFE":
      return require("../../images/Dollar.png");
    default:
      return require("../../images/Ellipsis.png");
  }
};

const GET_CRIMES_BY_NEIGHBORHOOD = gql`
  query getCrimesQuery($nbrhd_ids: [String], $before: String, $after: String) {
    crimes_by_neighborhood(
      nbrhd_ids: $nbrhd_ids
      before: $before
      after: $after
    ) {
      case_number
      date_occurred
      address
      offense_long_description
      offense_short_description
      geo_beat
      x
      y
    }
    neighborhoods(nbrhd_ids: $nbrhd_ids) {
      name
      polygon {
        outer {
          points {
            x
            y
          }
        }
        holes {
          points {
            x
            y
          }
        }
      }
    }
  }
`;

const convertToPieData = (crimeData) => {
  // Group crimes to less categories?? Right now just show top 8 and Other
  let pieData = [];
  let crimeTypeAlreadyPresent;
  for (let i = 0; i < crimeData.length; i += 1) {
    crimeTypeAlreadyPresent = false;
    for (let j = 0; j < pieData.length; j += 1) {
      if (pieData[j].name === crimeData[i].offense_long_description) {
        pieData[j].value += 1;
        crimeTypeAlreadyPresent = true;
        break;
      }
    }
    if (!crimeTypeAlreadyPresent) {
      pieData.push(
        Object.assign(
          {},
          {},
          { name: crimeData[i].offense_long_description, value: 1 }
        )
      );
    }
  }
  pieData.sort(
    (a, b) => (a.value > b.value ? -1 : a.value < b.value ? 1 : 0) // eslint-disable-line
  );

  let otherCount = 0;
  for (let i = 9; i < pieData.length; i += 1) {
    otherCount += pieData[i].value;
  }
  if (pieData.length > 8) {
    pieData = pieData.slice(0, 9).concat({ name: "Other", value: otherCount });
  }

  return pieData;
};

const createLegend = (crimeData) => {
  const crimeTypes = [];
  let crimeTypeAlreadyPresent;
  for (let i = 0; i < crimeData.length; i += 1) {
    crimeTypeAlreadyPresent = false;
    for (let j = 0; j < crimeTypes.length; j += 1) {
      if (crimeTypes[j] === crimeData[i].offense_long_description) {
        crimeTypeAlreadyPresent = true;
        break;
      }
    }
    if (!crimeTypeAlreadyPresent) {
      crimeTypes.push(crimeData[i].offense_long_description);
    }
  }
  return (
    <div style={{ width: "160px" }}>
      {crimeTypes.map((type) => (
        <div
          key={`legendItem-${type}`}
          style={{ width: "160px", marginBottom: "5px" }}
        >
          <img
            src={getMarker(type)}
            alt="legendItem"
            style={{
              display: "inline-block",
              width: "25px",
              verticalAlign: "top",
            }}
          />
          <span
            style={{
              marginLeft: "5px",
              display: "inline-block",
              width: "130px",
            }}
          >
            {type}
          </span>
        </div>
      ))}
    </div>
  );
};

function CrimesByNeighborhood(props) {
  return (
    <Query
      query={GET_CRIMES_BY_NEIGHBORHOOD}
      variables={{
        nbrhd_ids: props.location.query.id.trim(),
        before: props.before,
        after: props.after,
      }}
    >
      {({ loading, error, data }) => {
        if (loading) return <LoadingAnimation />;
        if (error) return <Error message={error.message} />;
        // set language
        let content;
        switch (props.language.language) {
          case "Spanish":
            content = spanish;
            break;
          default:
            content = english;
        }
        const pieData = convertToPieData(data.crimes_by_neighborhood);
        const mapData = data.crimes_by_neighborhood.map((item) =>
          Object.assign({}, item, {
            popup: `<div style="padding: 8px 0;">
              <p style="margin: 6px 0; text-transform: capitalize;"><b>Location</b>: ${item.address.toLowerCase()}</p><p style="margin: 6px 0;"><b>Date</b>: ${
              item.date_occurred.indexOf("-") === -1
                ? moment.unix(item.date_occurred / 1000).format("M/DD/YYYY")
                : moment.utc(item.date_occurred).format("M/DD/YYYY")
            }</p><p style="margin: 6px 0; text-transform: capitalize;"><b>Type</b>: ${item.offense_long_description.toLowerCase()}</p>
            <p style="margin: 6px 0;"><b>Case number</b>: ${
              item.case_number
            }</p>
            </div>`, // eslint-disable-line
            options: {
              icon: L.icon({
                iconUrl: getMarker(item.offense_long_description),
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [2, -22],
              }),
            },
          })
        );

        const getNewUrlParams = (view) => ({
          view,
        });

        return (
          <div className="crimes-template__data">
            <div className="row template-header">
              <div className="col-xs-12 template-header__inner">
                <div className="pull-left">
                  <EmailDownload
                    downloadData={data.crimes_by_neighborhood}
                    fileName={content.crimes_by_neighborhood_filename}
                  />
                </div>
                <ButtonGroup>
                  <Button
                    onClick={() =>
                      refreshLocation(getNewUrlParams("map"), props.location)
                    }
                    active={props.location.query.view === "map"}
                    positionInGroup="left"
                  >
                    {content.map_view}
                  </Button>
                  <Button
                    onClick={() =>
                      refreshLocation(getNewUrlParams("list"), props.location)
                    }
                    active={props.location.query.view === "list"}
                    positionInGroup="middle"
                  >
                    {content.list_view}
                  </Button>
                  <Button
                    onClick={() =>
                      refreshLocation(
                        getNewUrlParams("summary"),
                        props.location
                      )
                    }
                    positionInGroup="right"
                    active={props.location.query.view === "summary"}
                  >
                    {content.chart_view}
                  </Button>
                </ButtonGroup>
              </div>
            </div>
            <div className="row data-view-container">
              <div
                id="summaryView"
                className="col-xs-12"
                hidden={props.location.query.view !== "summary"}
              >
                {pieData.length > 0 ? (
                  <PieChart data={pieData} altText={content.crime_pie_chart} />
                ) : (
                  <div className="alert alert-info">
                    {content.no_results_found}
                  </div>
                )}
              </div>
              <div id="listView" hidden={props.location.query.view !== "list"}>
                <CrimeTable
                  data={data.crimes_by_neighborhood}
                  location={props.location}
                />
              </div>
              <div
                id="mapView"
                className="col-xs-12"
                hidden={props.location.query.view !== "map"}
              >
                {data.crimes_by_neighborhood.length === 0 ||
                props.location.query.view !== "map" ? (
                  <div className="alert alert-info">
                    {content.no_results_found}
                  </div>
                ) : (
                  <Map
                    data={mapData}
                    legend={createLegend(data.crimes_by_neighborhood)}
                    drawPolygon
                    polygonData={combinePolygonsFromNeighborhoodList([
                      data.neighborhoods[0],
                    ])}
                    bounds={
                      props.location.query.zoomToPoint !== undefined &&
                      props.location.query.zoomToPoint !== ""
                        ? null
                        : getBoundsFromPolygonData([
                            data.neighborhoods[0].polygon,
                          ])
                    }
                    within={parseInt(props.location.query.within, 10)}
                    zoomToPoint={
                      props.location.query.zoomToPoint !== undefined &&
                      props.location.query.zoomToPoint !== ""
                        ? props.location.query.zoomToPoint
                        : null
                    }
                  />
                )}
              </div>
            </div>
          </div>
        );
      }}
    </Query>
  );
}

CrimesByNeighborhood.propTypes = {
  location: PropTypes.object, // eslint-disable-line
  query: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

CrimesByNeighborhood.defaultProps = {
  query: { entity: "address", label: "123 Main street" },
};

export default withLanguage(CrimesByNeighborhood);
