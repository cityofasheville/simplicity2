import React from "react";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import LoadingAnimation from "../../shared/LoadingAnimation";
import Error from "../../shared/Error";
import { Link } from "react-router";
import Icon from "../../shared/Icon";
import Map from "../../shared/visualization/Map";
import { IM_USERS } from "../../shared/iconConstants";
import ButtonGroup from "../../shared/ButtonGroup";
import LinkButton from "../../shared/LinkButton";
import PageHeader from "../../shared/PageHeader";
import RiskOverview from "./RiskOverview";
import {
  getBoundsFromPolygonData,
  combinePolygonsFromNeighborhoodList,
} from "../../utilities/mapUtilities";
import ICON_HEAT from "./svg/heat.svg";
import ICON_FLOOD from "./svg/flood.svg";
import ICON_WILDFIRE from "./svg/wildfire.svg";
import ICON_LANDSLIDE from "./svg/landslide.svg";

import {
  floodRiskOverview,
  landslideRiskOverview,
  heatRiskOverview,
  wildfireRiskOverview,
  highRiskIntro,
  mediumRiskIntro,
  lowRiskIntro,
  climateScoreMethodologyNote,
} from "./climateRiskText.js";

const BlockGroup = (props) => {
  if (props.data.loading) {
    // eslint-disable-line react/prop-types
    return <LoadingAnimation />;
  }
  if (props.data.error) {
    // eslint-disable-line react/prop-types
    return <Error message={props.data.error.message} />; // eslint-disable-line react/prop-types
  }

  console.log(props.data);

  const climateTotalScore = props.data.blockgroups[0].sum_scores;
  const heatIndex = props.data.blockgroups[0].hvi_value.toFixed(2);
  let heatScore = 0;
  const floodScore = props.data.blockgroups[0].resflood;
  const landslideScore = props.data.blockgroups[0].resland;
  const wildfireScore = props.data.blockgroups[0].wfirescore;

  const climateThreats = {
    high: {
      notice: highRiskIntro,
      data: [],
    },
    medium: {
      notice: mediumRiskIntro,
      data: [],
    },
    low: {
      notice: lowRiskIntro,
      data: [],
    },
  };

  let thisThreatLevel;

  // Check Heat Threat

  if (heatIndex <= 0.25) {
    heatScore = 1;
    thisThreatLevel = "low";
  } else if (heatIndex > 0.25 && heatIndex <= 0.678) {
    heatScore = 2;
    thisThreatLevel = "low";
  } else if (heatIndex > 0.678 && heatIndex <= 0.94) {
    heatScore = 3;
    thisThreatLevel = "medium";
  } else if (heatIndex > 0.94 && heatIndex <= 1.16) {
    heatScore = 4;
    thisThreatLevel = "medium";
  } else if (heatIndex > 1.16) {
    heatScore = 5;
    thisThreatLevel = "high";
  }

  // console.log(climateThreats);
  climateThreats[thisThreatLevel].data.push({
    name: "Heat",
    overview: heatRiskOverview,
    score: heatScore,
    icon: ICON_HEAT,
    actions:
      "https://drive.google.com/file/d/0BzZzONRPV-VAVF9vb2pOMUtkRmFJR1AyNFluYU5ESU9rODRJ/view?resourcekey=0-ZQ80xC-a8bw4JDs7z0Neaw",
  });

  // Check Flood Threat

  if (floodScore < 2) {
    thisThreatLevel = "low";
  } else if (floodScore === 2) {
    thisThreatLevel = "medium";
  } else {
    thisThreatLevel = "high";
  }

  climateThreats[thisThreatLevel].data.push({
    name: "Flood",
    overview: floodRiskOverview,
    score: floodScore,
    icon: ICON_FLOOD,
    actions:
      "https://drive.google.com/file/d/0BzZzONRPV-VAVF9vb2pOMUtkRmFJR1AyNFluYU5ESU9rODRJ/view?resourcekey=0-ZQ80xC-a8bw4JDs7z0Neaw",
  });

  // Check Landslide Threat

  if (landslideScore < 2) {
    thisThreatLevel = "low";
  } else if (landslideScore === 2) {
    thisThreatLevel = "medium";
  } else {
    thisThreatLevel = "high";
  }

  climateThreats[thisThreatLevel].data.push({
    name: "Landslide",
    overview: landslideRiskOverview,
    score: landslideScore,
    icon: ICON_LANDSLIDE,
    actions:
      "https://drive.google.com/file/d/0BzZzONRPV-VAVF9vb2pOMUtkRmFJR1AyNFluYU5ESU9rODRJ/view?resourcekey=0-ZQ80xC-a8bw4JDs7z0Neaw",
  });

  // Check Wildfire Threat

  if (wildfireScore < 2) {
    thisThreatLevel = "low";
  } else if (wildfireScore === 2) {
    thisThreatLevel = "medium";
  } else {
    thisThreatLevel = "high";
  }

  climateThreats[thisThreatLevel].data.push({
    name: "Wildfire",
    overview: wildfireRiskOverview,
    score: wildfireScore,
    icon: ICON_WILDFIRE,
    actions:
      "https://drive.google.com/file/d/0BzZzONRPV-VAVF9vb2pOMUtkRmFJR1AyNFluYU5ESU9rODRJ/view?resourcekey=0-ZQ80xC-a8bw4JDs7z0Neaw",
  });

  // blockgroups[0].resland
  // blockgroups[0].wfirescore
  // blockgroups[0].resflood

  // {
  //   name: "Flood Risk",
  //   overview: floodRiskOverview,
  //   score: props.data.blockgroups[0].resflood,
  // }

  let fillColor, scoreColor;
  if (isNaN(props.data.blockgroups[0].sum_scores)) {
    fillColor = null;
    scoreColor = null;
  } else if (
    props.data.blockgroups[0].sum_scores > 0 &&
    props.data.blockgroups[0].sum_scores <= 6
  ) {
    fillColor = "#413da1";
    scoreColor = "white";
  } else if (
    props.data.blockgroups[0].sum_scores > 6 &&
    props.data.blockgroups[0].sum_scores <= 10
  ) {
    fillColor = "#9a3abb";
    scoreColor = "white";
  } else if (
    props.data.blockgroups[0].sum_scores > 10 &&
    props.data.blockgroups[0].sum_scores <= 14
  ) {
    fillColor = "#d66f96";
    scoreColor = "black";
  } else if (
    props.data.blockgroups[0].sum_scores > 14 &&
    props.data.blockgroups[0].sum_scores <= 18
  ) {
    fillColor = "#faab6b";
    scoreColor = "black";
  } else if (
    props.data.blockgroups[0].sum_scores > 18 &&
    props.data.blockgroups[0].sum_scores <= 24
  ) {
    fillColor = "#f3fa52";
    scoreColor = "black";
  }

  console.log(`fill color: ${fillColor}, ${scoreColor}`);

  console.log(climateThreats);

  return (
    <div className="container" style={{ padding: "0" }}>
      <PageHeader
        h1={`Climate Risk: ${props.data.blockgroups[0].name.slice(0, -33)}`}
        dataType="Census Block Group in Buncombe County, North Carolina"
        // h2={"About this Block Group"}
        icon={<Icon path={IM_USERS} size={50} />}
        externalLink="https://www.census.gov/programs-surveys/geography/about/glossary.html#par_textimage_4"
        externalLinkText="What is a Block Group? (census.gov)"
      >
        <ButtonGroup alignment="">
          <LinkButton
            pathname="/address"
            query={{
              id: props.location.query.fromAddress,
              entities: props.location.query.entities,
              search: props.location.query.search,
              hideNavbar: props.location.query.hideNavbar,
              entity: "address",
              label: props.location.query.label,
            }}
          >
            Back to address
          </LinkButton>
        </ButtonGroup>
      </PageHeader>
      {/* <div>
        <h2></h2>
        <a
          href="https://www.census.gov/programs-surveys/geography/about/glossary.html#par_textimage_4"
          target="_blank"
        >
          What is a Block Group? (census.gov)
        </a>
      </div> */}

      <fieldset className="detailsFieldset">
        <div className="map-container">
          <Map
            drawPolygon
            polygonData={combinePolygonsFromNeighborhoodList([
              props.data.blockgroups[0],
            ])}
            bounds={getBoundsFromPolygonData([
              props.data.blockgroups[0].polygon,
            ])}
            color={fillColor}
            opacity={1}
            weight={3}
            fillColor={fillColor}
            fillOpacity={0.5}
          />
        </div>
      </fieldset>

      <h2>Climate Risk Information for this Block Group</h2>
      <p>
        Through the{" "}
        <a
          href="https://drive.google.com/file/d/1X_Gr4eUCmkXPOzAcvyxCe-uZPkX84Byz/view"
          target="_blank"
        >
          2018 Climate Resilience Assessment
        </a>
        , the City of Asheville worked with the National Environmental Modeling
        and Analysis Center (NEMAC) at UNC Asheville to better understand which
        areas are most at risk for various climate threats. This assessment
        assigned levels of risk for different geographic areas of the city (i.e.
        census block groups). Levels of risk are determined by considering the
        percentage of land with risk inside each geographic area.
      </p>
      <p>
        Properties within this particular block group (
        {props.data.blockgroups[0].name.slice(0, -33)}) may be vulnerable to
        climate-related threats. Based on the available information about this
        block group, the following threats and strategies to build resilience
        should be considered.
      </p>

      <h3>
        Climate Justice Index Score:{" "}
        <span
          style={{
            backgroundColor: fillColor,
            paddingLeft: "12px",
            paddingRight: "12px",
            border: "1px solid gray",
            fontWeight: "bold",
            color: scoreColor,
          }}
        >
          {climateTotalScore}
        </span>{" "}
        {/* <span style={{ fontWeight: "bold" }}>
                {props.data.blockgroups[0].sum_scores}
              </span>{" "} */}
        out of 25
      </h3>
      <p>{climateScoreMethodologyNote}</p>
      <div class="row">
        <div class=" col-xs-12 col-md-8">
          <h3>Risks and Mitigation</h3>
          {climateThreats.high.data.length > 0 && (
            <>
              <p>{climateThreats.high.notice}</p>
              {climateThreats.high.data.map((threat) => {
                return (
                  <RiskOverview
                    icon={threat.icon}
                    title={threat.name}
                    overview={threat.overview}
                    actions={threat.actions}
                    riskLevel={"high"}
                  />
                );
              })}
            </>
          )}

          {climateThreats.medium.data.length > 0 && (
            <>
              <p>{climateThreats.medium.notice}</p>
              {climateThreats.medium.data.map((threat) => {
                return (
                  <RiskOverview
                    icon={threat.icon}
                    title={threat.name}
                    overview={threat.overview}
                    actions={threat.actions}
                    riskLevel={"medium"}
                  />
                );
              })}
            </>
          )}

          {climateThreats.low.data.length > 0 && (
            <>
              <p>{climateThreats.low.notice}</p>
              {climateThreats.low.data.map((threat) => {
                return (
                  <RiskOverview
                    icon={threat.icon}
                    title={threat.name}
                    overview={threat.overview}
                    actions={threat.actions}
                    riskLevel={"low"}
                  />
                );
              })}
            </>
          )}
        </div>
        <div
          class=" col-xs-12 col-md-4"
          style={{
            backgroundColor: "#FAFAFA",
            border: "1px solid rgba(0,0,0,.15)",
            borderRadius: "4px",
            paddingBottom: "64px",
          }}
        >
          <h3>Learn More</h3>
          <div style={{ padding: "16px 0" }}>
            {/* For mitigation strategies, see the */}
            <a
              href="https://drive.google.com/file/d/0BzZzONRPV-VAVF9vb2pOMUtkRmFJR1AyNFluYU5ESU9rODRJ/view?resourcekey=0-ZQ80xC-a8bw4JDs7z0Neaw"
              className="btn btn-info"
              target="_blank"
              style={{ maxWidth: "100%" }}
            >
              Climate Resilience Guide
            </a>
          </div>
          <div style={{ padding: "16px 0" }}>
            {/* Overview of Asheville's Climate Justice Initiative: */}
            <a
              href="https://storymaps.arcgis.com/stories/1d90d45f3e71482397a944e8d6786df4"
              className="btn btn-info"
              target="_blank"
              style={{ maxWidth: "100%" }}
            >
              Climate Justice Initiative
            </a>
          </div>
          <div style={{ padding: "16px 0" }}>
            {/* Comprehensive look at climate justice data in Asheville: */}
            <a
              href="https://avl.maps.arcgis.com/apps/instant/lookup/index.html?appid=10e2c4ae45614b92ad4efaa61342b249%2F"
              className="btn btn-info"
              target="_blank"
              style={{ maxWidth: "100%" }}
            >
              Citywide Climate Justice Index Map
            </a>
          </div>
        </div>
      </div>

      <div
        className="row"
        style={{
          margin: "24px 0",
          border: "1px solid #CDCDCD",
        }}
      ></div>
      <p>
        Risk factors are scaled from 1 to 5, and summed up to caclulate the
        Index Score.
      </p>
      <ul className="cjdata">
        <li>
          <h4>BIPOC Score: {props.data.blockgroups[0].bipoc_score}</h4>
          <ul>
            <li>BIPOC is Black, Indigenous and People of Color.</li>
            <li>
              This area has a <b>{props.data.blockgroups[0].bipoc}%</b> BIPOC
              Population
            </li>
          </ul>
        </li>
        <li>
          <h4>
            Heat Vulnerability Score: {props.data.blockgroups[0].heat_score}
          </h4>
          <ul>
            <li>
              This heat vulnerability index shows which parts of Asheville are
              vulnerable to extreme heat, taking into account land surface
              temperature, tree cover, age, and poverty level.
            </li>
            <li>
              Overall Heat Vulnerability Index Value:{" "}
              <b>{props.data.blockgroups[0].hvi_value.toFixed(2)}</b>
            </li>
            <li>
              The closer this value is to 3, the more vulnerable it is, and the
              closer it is to 0, the less vulnerable it is.
            </li>
          </ul>
        </li>
        <li>
          <h4>Energy Burden Score: {props.data.blockgroups[0].energy_sco}</h4>
          <ul>
            <li>
              <p>
                Energy Burden represents the percentage of annual income that a
                household pays towards their energy bills (electricity/gas
                utility.)
              </p>
            </li>
          </ul>
        </li>
        <li>
          <h4>
            CDC Social Vulnerability Score:{" "}
            {props.data.blockgroups[0].cdc_score}
          </h4>
          <ul>
            <li>CDC Social Vulnerability Index</li>
            <li>
              2018 Overall Score: <b>{props.data.blockgroups[0].rpl_themes}</b>
            </li>
            <li>
              Possible scores range from 0 (lowest vulnerability) to 1 (highest
              vulnerability).
            </li>
          </ul>
        </li>
        <li>
          <h4>
            Climate Resiliency Neighborhood Threats Score:{" "}
            {props.data.blockgroups[0].resiliency}
          </h4>
          <ul>
            <li>
              The Climate Resiliency Neighborhood Threats Score was determined
              by taking the percentage of land with risk by neighborhood (census
              block group) and classifying by risk level.
            </li>

            <li>
              Score from Flood Risk: <b>{props.data.blockgroups[0].resflood}</b>
              <i>
                {props.data.blockgroups[0].resflood < 3
                  ? " (Lower Risk) "
                  : props.data.blockgroups[0].resflood === 3
                  ? " (Medium Risk) "
                  : " (Higher Risk) "}
              </i>
              <a
                href="https://drive.google.com/file/d/0BzZzONRPV-VAVF9vb2pOMUtkRmFJR1AyNFluYU5ESU9rODRJ/view?resourcekey=0-ZQ80xC-a8bw4JDs7z0Neaw"
                className=""
                target="_blank"
              >
                {" "}
                Actions you can take now
              </a>
            </li>
            <li>
              Score from Wildfire Risk:{" "}
              <b>{props.data.blockgroups[0].wfirescore}</b>
              <i>
                {props.data.blockgroups[0].wfirescore < 3
                  ? " (Lower Risk) "
                  : props.data.blockgroups[0].wfirescore === 3
                  ? " (Medium Risk) "
                  : " (Higher Risk) "}
              </i>
              <a
                href="https://drive.google.com/file/d/0BzZzONRPV-VAVF9vb2pOMUtkRmFJR1AyNFluYU5ESU9rODRJ/view?resourcekey=0-ZQ80xC-a8bw4JDs7z0Neaw"
                className=""
                target="_blank"
              >
                {" "}
                Actions you can take now
              </a>
            </li>
            <li>
              Score from Landslide Risk:{" "}
              <b>{props.data.blockgroups[0].resland}</b>
              <i>
                {props.data.blockgroups[0].resland < 3
                  ? " (Lower Risk) "
                  : props.data.blockgroups[0].resland === 3
                  ? " (Medium Risk) "
                  : " (Higher Risk) "}
              </i>
              <a
                href="https://drive.google.com/file/d/0BzZzONRPV-VAVF9vb2pOMUtkRmFJR1AyNFluYU5ESU9rODRJ/view?resourcekey=0-ZQ80xC-a8bw4JDs7z0Neaw"
                className=""
                target="_blank"
              >
                {" "}
                Actions you can take now
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

const getBlockGroupQuery = gql`
  query getBlockGroup($geoid: [String]) {
    blockgroups(geoid: $geoid) {
      geoid
      name
      below_pov
      bipoc
      totalhh
      school_chi
      bipoc_score
      poverty_sc
      acres
      hvi_value
      heat_score
      rpl_themes
      cdc_score
      avg_energy
      hh_energy_
      pct_hh_ene
      energy_sco
      resland
      resflood
      critland
      critflood
      comflood
      shape__len
      shape__are
      nemacscore
      resiliency
      cj_score
      sum_scores
      holc
      red_score
      wfirescore
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

const BlockGroupQGL = graphql(getBlockGroupQuery, {
  options: (ownProps) => ({
    variables: {
      geoid: [ownProps.location.query.id.trim()],
    },
  }),
})(BlockGroup);

export default BlockGroupQGL;
