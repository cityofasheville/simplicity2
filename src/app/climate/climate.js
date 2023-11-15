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
import ClickableTile from "./ClickableTile";
import {
  getBoundsFromPolygonData,
  combinePolygonsFromNeighborhoodList,
} from "../../utilities/mapUtilities";
import ICON_HEAT from "../../images/climate/heat.svg";
import ICON_FLOOD from "../../images/climate/flood.svg";
import ICON_WILDFIRE from "../../images/climate/wildfire.svg";
import ICON_LANDSLIDE from "../../images/climate/landslide.svg";
import IMG_CJI_MAP from "../../images/climate/cji-map.jpg";
import IMG_CJI_STORYMAP from "../../images/climate/cji-storymap.jpg";
import IMG_RESILIENCY_GUIDE from "../../images/climate/resiliency-guide.jpg";
import IMG_CJI_WEB from "../../images/climate/sustainability-webpage.jpg";

import {
  floodRiskOverview,
  landslideRiskOverview,
  heatRiskOverview,
  wildfireRiskOverview,
  highRiskIntro,
  mediumRiskIntro,
  lowRiskIntro,
  blockgroupscoreMethodologyNote,
  riskMitigationSteps,
} from "./climateRiskText.js";

const Climate = (props) => {
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
  const floodScore = props.data.blockgroups[0].resflood;
  const landslideScore = props.data.blockgroups[0].resland;
  const wildfireScore = props.data.blockgroups[0].wfirescore;

  let heatScore = 0;

  // Scaffold object to hold threat info in three sections, grouped by risk
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

  climateThreats[thisThreatLevel].data.push({
    name: "Heat",
    overview: heatRiskOverview,
    score: heatScore,
    icon: ICON_HEAT,
    actions: riskMitigationSteps.heat,
    externalLink:
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
    actions: riskMitigationSteps.flood,
    externalLink:
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
    actions: riskMitigationSteps.landslide,
    externalLink:
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
    actions: riskMitigationSteps.wildfire,
    externalLink:
      "https://drive.google.com/file/d/0BzZzONRPV-VAVF9vb2pOMUtkRmFJR1AyNFluYU5ESU9rODRJ/view?resourcekey=0-ZQ80xC-a8bw4JDs7z0Neaw",
  });

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

  return (
    <div className="container" style={{ padding: "0" }}>
      <PageHeader
        h1={`Climate Resilience: ${props.data.blockgroups[0].name.slice(
          0,
          -33
        )}`}
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
      <p dangerouslySetInnerHTML={{ __html: blockgroupscoreMethodologyNote }}></p>

      <p>
        Properties within this particular block group (
        {props.data.blockgroups[0].name.slice(0, -33)}) may be vulnerable to
        climate-related threats. Based on the available information about this
        block group, the following risks and strategies to build resilience
        should be considered.
      </p>

      <div className="row">
        <div className=" col-xs-12">
          <h3>Climate Risks and Action Strategies</h3>
          {climateThreats.high.data.length > 0 && (
            <>
              <p className="h4" style={{ fontWeight: "300", margin: "24px 0" }}>
                {climateThreats.high.notice}
              </p>
              {climateThreats.high.data.map((threat, index) => {
                return (
                  <RiskOverview
                    key={index}
                    icon={threat.icon}
                    title={threat.name}
                    overview={threat.overview}
                    actions={threat.actions}
                    externalLink={threat.externalLink}
                    riskLevel={"high"}
                  />
                );
              })}
            </>
          )}

          {climateThreats.medium.data.length > 0 && (
            <>
              <p className="h4" style={{ fontWeight: "300", margin: "24px 0" }}>
                {climateThreats.medium.notice}
              </p>
              {climateThreats.medium.data.map((threat, index) => {
                return (
                  <RiskOverview
                    key={index}
                    icon={threat.icon}
                    title={threat.name}
                    overview={threat.overview}
                    actions={threat.actions}
                    externalLink={threat.externalLink}
                    riskLevel={"medium"}
                  />
                );
              })}
            </>
          )}

          {climateThreats.low.data.length > 0 && (
            <>
              <p className="h4" style={{ fontWeight: "300", margin: "24px 0" }}>
                {climateThreats.low.notice}
              </p>
              {climateThreats.low.data.map((threat, index) => {
                return (
                  <RiskOverview
                    key={index}
                    icon={threat.icon}
                    title={threat.name}
                    overview={threat.overview}
                    actions={threat.actions}
                    externalLink={threat.externalLink}
                    riskLevel={"low"}
                  />
                );
              })}
            </>
          )}
        </div>
      </div>
      <aside
        className="row"
        style={{
          backgroundColor: "#FAFAFA",
          border: "1px solid rgba(0,0,0,.15)",
          borderRadius: "4px",
          padding: "16px",
        }}
      >
        <a id="Climate Data">
          <h3>Climate Justice Resources</h3>
        </a>
        <p>
          Our neighborhood and personal risk is defined not only by weather and
          climate events, but also by health, age, community and historical factors.
          To better understand how climate events affect different Asheville
          communities differently,
          &nbsp;<a href="https://avl.maps.arcgis.com/apps/instant/lookup/index.html?appid=10e2c4ae45614b92ad4efaa61342b249%2F">this map</a>&nbsp;
          visualizes the climate risks outlined
          above alongside additional factors that can intensify impact and influence
          a community's ability to bounce back after disruption. Details about
          how these Climate Justice factors show up in your census block group
          are scored and  outlined below.  Here are additional resources to
          better understand Climate Justice, Equity and Resilience in our community.
        </p>

        <div
          className="col-xs-12 col-sm-6 col-lg-3"
          style={{ margin: "24px 0" }}
        >
          <ClickableTile
            image={IMG_CJI_MAP}
            text="Citywide Climate Justice Index Map"
            url="https://avl.maps.arcgis.com/apps/instant/lookup/index.html?appid=10e2c4ae45614b92ad4efaa61342b249%2F"
          />
        </div>
        <div
          className="col-xs-12 col-sm-6 col-lg-3"
          style={{ margin: "24px 0" }}
        >
          <ClickableTile
            image={IMG_RESILIENCY_GUIDE}
            text="Climate Resilience Personal Action Guide"
            url="https://drive.google.com/file/d/0BzZzONRPV-VAVF9vb2pOMUtkRmFJR1AyNFluYU5ESU9rODRJ/view?resourcekey=0-ZQ80xC-a8bw4JDs7z0Neaw"
          />
        </div>
        <div
          className="col-xs-12 col-sm-6 col-lg-3"
          style={{ margin: "24px 0" }}
        >
          <ClickableTile
            image={IMG_CJI_STORYMAP}
            text="City of Asheville Climate Justice Initiative Webpage "
            url="https://www.ashevillenc.gov/department/sustainability/climate-initiatives/climate-justice-initiative"
          />
        </div>
        <div
          className="col-xs-12 col-sm-6 col-lg-3"
          style={{ margin: "24px 0" }}
        >
          <ClickableTile
            image={IMG_CJI_WEB}
            text="Climate Justice Initiative Story Map"
            url="https://storymaps.arcgis.com/stories/1d90d45f3e71482397a944e8d6786df4"
          />
        </div>

      </aside>



      <div
        className="row"
        style={{
          margin: "24px 0",
          border: "1px solid #CDCDCD",
        }}
      ></div>
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
        out of 25
      </h3>

      <p>
        This overall score gives a snapshot of cumulative Climate and non-climate risks in
        this census block group. Higher scores indicate higher vulnerability on average
        across the block group area.  Risk factor data outlined below are scaled from 1 to 5,
        and summed up to calculate the overall Climate Justice Index Score. Climate
        vulnerability is heavily dependent on where you live, this data and the displayed
        Climate Justice Index Score show this census block group relative to others in our area.
      </p>
      <p>
        Below you'll find a score assigned to the climate threats detailed above
        (Heat, Flood, Landslide, Wildfire) as well as scores for data that shed light on
        additional vulnerability of the census block group. This additional data layers
        in demographics, historical inequities, health risk factors, income levels and other
        factors that can exacerbate impact from climate events.
      </p>
      <ul className="cjdata">
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
            <a href="https://svi.cdc.gov/Documents/Publications/CDC_ATSDR_SVI_Materials/SVI_Poster_07032014_FINAL.pdf" target="_blank">
              Center for Disease Control Social Vulnerability</a> CJ Map Score:{" "}
            {props.data.blockgroups[0].cdc_score}
          </h4>
          <ul>
            <li>The CDC Social Vulnerability Index uses U.S. Census data to determine the relative social 
              vulnerability of every census tract. By ranking 14 factors and 4 themes, an overall score 
              is determined that supports emergency response and public health planning by identifying 
              where the most vulnerable populations are located. 
            </li>
            <li>
              Possible scores range from 0 (lowest vulnerability) to 1 (highest
              vulnerability).
            </li>
            <li>
              2018 Overall Score: <b>{props.data.blockgroups[0].rpl_themes}</b> This score is then scaled to 
              fit into the Climate Justice Data Map 1-5 scoring. 
            </li>
          </ul>
        </li>
        <li>
          <h4>BIPOC Score: {props.data.blockgroups[0].bipoc_score}</h4>
          <ul>
            <li>BIPOC is Black, Indigenous and People of Color. This specific demographic information is 
              significant as it is well documented that climate change impacts communities of color most 
              significantly and that long standing disinvestment in these communities has resulted in 
              less resources available to prepare for and recover from disaster.  </li>
            <li>
              This area has a <b>{props.data.blockgroups[0].bipoc}%</b> BIPOC
              Population  -Citywide, the BIPOC population percentage is 13%
            </li>
          </ul>
        </li>
        <li>
          <h4>
            Heat Vulnerability Score: {props.data.blockgroups[0].heat_score}
          </h4>
          <ul>
            <li>
            This heat vulnerability index goes beyond temperature to better illustrate which parts of 
            Asheville are vulnerable to extreme heat. This score takes into account land surface 
            temperature, tree cover, age, and poverty level.
            </li>
            <li>
              Overall Heat Vulnerability Index Value:{" "}
              <b>{props.data.blockgroups[0].hvi_value.toFixed(2)}</b>
            </li>
            <li>
            Possible scores range from 0 (lowest vulnerability) to 3 (highest vulnerability), this score 
            is then scaled to fit into the Climate Justice Data Map 1-5 scoring.
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

const getClimateQuery = gql`
  query getBlockGroups($geoid: [String]) {
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

const ClimateQGL = graphql(getClimateQuery, {
  options: (ownProps) => ({
    variables: {
      geoid: [ownProps.location.query.id.trim()],
    },
  }),
})(Climate);

export default ClimateQGL;
