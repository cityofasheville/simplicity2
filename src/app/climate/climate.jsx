import React from "react";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import LoadingAnimation from "../../shared/LoadingAnimation.js";
import Error from "../../shared/Error.js";
import { Link } from "react-router";
import Icon from "../../shared/Icon.js";
import Map from "../../shared/visualization/Map.js";
import { IM_USERS } from "../../shared/iconConstants.js";
import ButtonGroup from "../../shared/ButtonGroup.js";
import LinkButton from "../../shared/LinkButton.js";
import PageHeader from "../../shared/PageHeader.jsx";
import RiskOverview from "./RiskOverview.jsx";
import ClickableTile from "./ClickableTile.jsx";
import { getBoundsFromPolygonData, combinePolygonsFromNeighborhoodList } from "../../utilities/mapUtilities.js";
import ICON_HEAT from "../../images/climate/heat.svg";
import ICON_FLOOD from "../../images/climate/flood.svg";
import ICON_WILDFIRE from "../../images/climate/wildfire.svg";
import ICON_LANDSLIDE from "../../images/climate/landslide.svg";
import IMG_CJI_MAP from "../../images/climate/cji-map.jpg";
import IMG_CJI_STORYMAP from "../../images/climate/cji-storymap.jpg";
import IMG_RESILIENCY_GUIDE from "../../images/climate/resiliency-guide.jpg";
import IMG_CJI_WEB from "../../images/climate/sustainability-webpage.jpg";
import Alert from "../../alert.jsx";

const scoreScale = [
	{ max: 6, fillColor: "#413da1", scoreColor: "white" },
	{ max: 10, fillColor: "#9a3abb", scoreColor: "white" },
	{ max: 14, fillColor: "#d66f96", scoreColor: "black" },
	{ max: 18, fillColor: "#faab6b", scoreColor: "black" },
	{ max: 24, fillColor: "#f3fa52", scoreColor: "black" },
];

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
} from "./climateRiskText.jsx";

const formatPercent = (value) => {
	const numericValue = Number(value);

	return Number.isFinite(numericValue) ? numericValue.toFixed(1) : value;
	// return Number.isFinite(numericValue) ? Math.round(numericValue) : value;
};

const Climate = (props) => {
	if (props.data.loading) {
		// eslint-disable-line react/prop-types
		return <LoadingAnimation />;
	}
	if (props.data.error || props.data.climate.length === 0) {
		// eslint-disable-line react/prop-types
		// return <Error message={props.data.error.message} />; // eslint-disable-line react/prop-types
		return <Alert type="info">No results found</Alert>;
	}
	const climateTotalScore = props.data.climate[0].sum_scores;
	const climateResilienceScore = props.data.climate[0].all_assets_all_threats_sum_score;
	const floodPercent = formatPercent(props.data.climate[0].all_assets_ncem_vr_percent);
	const floodCount = props.data.climate[0].all_assets_ncem_vr_count;
	const wildfirePercent = formatPercent(props.data.climate[0].all_assets_wildfire_vr_percent);
	const wildfireCount = props.data.climate[0].all_assets_wildfire_vr_count;
	const landslidePercent = formatPercent(props.data.climate[0].all_assets_landslide_vr_percent);
	const landslideCount = props.data.climate[0].all_assets_landslide_vr_count;
	const heatScore = props.data.climate[0].heat_score;
	const HVI = props.data.climate[0].hvi_level;
	const treeLevel = props.data.climate[0].tree_level;
	const treeCanopyPercent = formatPercent(props.data.climate[0].tcc);
	const CDCScore = props.data.climate[0].cdc_score;
	const svi = props.data.climate[0].svi;
	const bipocPercent = formatPercent(props.data.climate[0].bipoc);

	const heatIndex = 1;
	const floodScore = 4;
	const landslideScore = 5;
	const wildfireScore = 3;

	const getScoreColors = (value) => {
		const numericValue = Number(value);

		if (!Number.isFinite(numericValue)) {
			return { fillColor: null, scoreColor: null };
		}

		const match = scoreScale.find(({ max }) => numericValue <= max);

		return match ?? { fillColor: "#f3fa52", scoreColor: "black" };
	};

	const { fillColor, scoreColor } = getScoreColors(props.data.climate[0].sum_scores);
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

	//------------------------------------------------------

	let thisThreatLevel;
	thisThreatLevel = "low";

	climateThreats[thisThreatLevel].data.push({
		name: "Heat",
		overview: heatRiskOverview,
		score: heatScore,
		icon: ICON_HEAT,
		actions: riskMitigationSteps.heat,
		externalLink:
			"https://drive.google.com/file/d/0BzZzONRPV-VAVF9vb2pOMUtkRmFJR1AyNFluYU5ESU9rODRJ/view?resourcekey=0-ZQ80xC-a8bw4JDs7z0Neaw",
	});

	thisThreatLevel = "low";

	climateThreats[thisThreatLevel].data.push({
		name: "Flood",
		overview: floodRiskOverview,
		score: floodScore,
		icon: ICON_FLOOD,
		actions: riskMitigationSteps.flood,
		externalLink:
			"https://drive.google.com/file/d/0BzZzONRPV-VAVF9vb2pOMUtkRmFJR1AyNFluYU5ESU9rODRJ/view?resourcekey=0-ZQ80xC-a8bw4JDs7z0Neaw",
	});

	thisThreatLevel = "low";

	climateThreats[thisThreatLevel].data.push({
		name: "Landslide",
		overview: landslideRiskOverview,
		score: landslideScore,
		icon: ICON_LANDSLIDE,
		actions: riskMitigationSteps.landslide,
		externalLink:
			"https://drive.google.com/file/d/0BzZzONRPV-VAVF9vb2pOMUtkRmFJR1AyNFluYU5ESU9rODRJ/view?resourcekey=0-ZQ80xC-a8bw4JDs7z0Neaw",
	});

	thisThreatLevel = "low";

	climateThreats[thisThreatLevel].data.push({
		name: "Wildfire",
		overview: wildfireRiskOverview,
		score: wildfireScore,
		icon: ICON_WILDFIRE,
		actions: riskMitigationSteps.wildfire,
		externalLink:
			"https://drive.google.com/file/d/0BzZzONRPV-VAVF9vb2pOMUtkRmFJR1AyNFluYU5ESU9rODRJ/view?resourcekey=0-ZQ80xC-a8bw4JDs7z0Neaw",
	});

	return (
		<div>
			<PageHeader
				className="flex"
				h1={`Climate Resilience: ${props.data.climate[0].name.slice(0, -33)}`}
				dataType="Census Block Group in Buncombe County, North Carolina"
				// h2={"About this Block Group"}
				icon={<Icon ariaHidden={true} path={IM_USERS} size={50} />}
				externalLink="https://www.census.gov/programs-surveys/geography/about/glossary.html#par_textimage_4"
				externalLinkText="What is a Block Group? (census.gov)"
			>
				<Link
					to={{
						pathname: "/address",
						search: `?id=${props.location.query.fromAddress}&entities=${props.location.query.entities}`,
						state: { hideNavbar: props.location.query.hideNavbar },
					}}
					className="btn btn-primary ml-auto"
				>
					Back to address
				</Link>
			</PageHeader>

			<div className="w-ful h-[300px] my-2">
				<Map
					drawPolygon
					polygonData={combinePolygonsFromNeighborhoodList([props.data.climate[0]])}
					bounds={getBoundsFromPolygonData([props.data.climate[0].polygon])}
					color={fillColor}
					opacity={1}
					weight={3}
					fillColor={fillColor}
					fillOpacity={0.5}
				/>
			</div>

			<h2 className="text-4xl text-coa-blue-medium my-5">
				Community Climate Vulnerability Information for this Block Group
			</h2>
			<p className="my-4">
				Our neighborhood, household and personal risk is defined not only by increasing weather and climate events, but
				also by health, demographic, infrastructure, and historical factors. To better understand how events impact
				neighborhoods differently, this map displays Asheville's climate risks alongside factors that intensify impact
				and influence a community's ability to bounce back after disruption. A "Community Climate Vulnerability" score
				can be generated for any location within City limits utilizing data factors outlined below. We invite you to
				interact with this map to learn more about neighborhood vulnerability. Access to data about our city can help
				prioritize sustainability factors as we plan and prepare. Knowing what risks and vulnerabilities we're facing
				will help us tailor resources and actions to serve our whole community and strengthen our individual, household
				and neighborhood resilience. Together We Thrive!
			</p>
			<p>
				The Community Climate Vulnerability Score represents the overall vulnerability of each Census Block Group based
				on the subcomponents listed below. Lower scores typically represent block groups with low climate hazard risk,
				low heat vulnerability, high tree canopy cover, and a low score in the Social Vulnerability Index. Scores range
				from 1-15, with 1 representing lowest vulnerability and 15 representing highest vulnerability.
			</p>

			<div>
				<h3 className="text-3xl text-coa-blue-medium my-5">
					Community Climate Vulnerability Score:{" "}
					<span
						className="font-semibold px-3 "
						style={{
							backgroundColor: fillColor,
							color: scoreColor,
						}}
					>
						{climateTotalScore}
					</span>{" "}
					out of 15
				</h3>
				<div className="flex h-full mb-8">
					<div className="flex align-middle border rounded shadow">
						<div className=" px-4 py-5 gap-4">
							<h4 className="text-2xl text-coa-blue-medium mb-2">
								Climate Resiliency Neighborhood Threats Score: {climateResilienceScore} out of 5
							</h4>
							<p>
								This score is based on data provided by Fernleaf in the Land of Sky Regional Resilience Assessment.
								Residential, commercial, government-owned, and critical facility properties were assessed for landslide,
								flooding, and wildfire vulnerability/risk. These modules are combined to represent overall risk relative
								to other census block groups across the city.
							</p>
							<ul className="mt-3">
								<li>
									<b>
										<a href="#flood">Flood Risk</a>: {floodPercent}%{" "}
									</b>
									of parcels are highly vulnerable ({floodCount} parcels), compared to 6% citywide.
								</li>
								<li>
									<b>
										<a href="#wildfire">Wildfire Risk</a>: {wildfirePercent}%{" "}
									</b>
									of parcels are highly vulnerable ({wildfireCount} parcels), compared to 13.9% citywide.
								</li>
								<li>
									<b>
										<a href="#landslide">Landslide Risk</a>: {landslidePercent}%{" "}
									</b>
									of parcels are highly vulnerable ({landslideCount} parcels), compared to 9% citywide.
								</li>
							</ul>
						</div>
					</div>
				</div>

				<div className="flex h-full mb-8">
					<div className="flex align-middle border rounded shadow">
						<div className=" px-4 py-5 gap-4">
							<h4 className="text-2xl text-coa-blue-medium mb-2">Heat Vulnerability Score: {heatScore} out of 5</h4>
							<p>
								This heat vulnerability index shows which parts of Asheville are vulnerable to extreme heat, taking into
								account land surface temperature, albedo, evapotranspiration, tree canopy cover, and social
								vulnerability. Data for this metric comes from the NASA Develop 2024 Heat Vulnerability Index and the
								U.S. Forest Service Tree Canopy Coverage dataset. <a href="#heat">Learn more about heat risk.</a>
							</p>
							<p className="mt-3">
								The NASA Develop HVI value for this block group is <b>{HVI}</b> relative to all block groups in the
								city.{" "}
							</p>
							<p className="mt-3">
								Tree canopy coverage is <b>{treeCanopyPercent}%</b> in this block group, which is <b>{treeLevel}</b>{" "}
								relative to all block groups in the city.
							</p>
						</div>
					</div>
				</div>

				<div className="flex h-full mb-8">
					<div className="flex align-middle border rounded shadow">
						<div className=" px-4 py-5 gap-4">
							<h4 className="text-2xl text-coa-blue-medium mb-2">
								CDC Social Vulnerability Index Score: {CDCScore} out of 5
							</h4>
							<h5>2022 Overall Score: {svi} </h5>
							<p className="mt-3">
								Possible SVI scores range from 0 (lowest vulnerability) to 1 (highest vulnerability). This score is then
								scaled to fit into the Community Climate Vulnerability 1-5 scoring. Social Vulnerability scores factor
								in census data related to:
							</p>
							<ul className="list-disc ml-8 mt-3">
								<li>Socioeconomic Status</li>
								<li>
									Household Composition & Disability (including age, single parent households and disability status)
								</li>
								<li>Minority Status And Declared English Language Level</li>
								<li>Housing Type & Transportation</li>
							</ul>
						</div>
					</div>
				</div>
				{climateThreats.high.data.length > 0 && (
					<>
						<p className="text-xl text-coa-blue-medium mb-6 ">{climateThreats.high.notice}</p>

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
						<p className="text-xl text-coa-blue-medium mb-6">{climateThreats.medium.notice}</p>
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
						<p className="text-xl text-coa-blue-medium mb-6">{climateThreats.low.notice}</p>
						<p className="my-3">
							[Note from CH: The heading above to be based on the threat level from these different risks (low vs med vs
							high). I grouped them under this one heading for the moment, since we're not measuring
							wildfire/flood/landslide/heat risk in quite the same ways anymore.]
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
			<aside id="Climate Data" className="p-4 border border-gray-200 rounded bg-gray-100 my-10">
				<h3 className="text-3xl text-coa-blue-medium my-5">Climate Vulnerability Resources</h3>
				<p className="my-5">
					Our neighborhood, household, and personal risk is defined not only by weather and climate events, but also by
					health, age, community and historical factors. To better understand how climate events affect different
					Asheville communities differently, the &nbsp;
					<a href="https://avl.maps.arcgis.com/apps/instant/lookup/index.html?appid=10e2c4ae45614b92ad4efaa61342b249%2F">
						Citywide Climate Vulnerability Index Map
					</a>
					&nbsp; visualizes the climate risks outlined above alongside additional factors that can intensify impact and
					influence a community's ability to bounce back after disruption. Details about how these Climate Vulnerability
					factors show up in your census block group are scored and outlined below. Here are additional resources to
					better understand Climate Vulnerability and Resilience in our community.
				</p>

				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
					<ClickableTile
						image={IMG_CJI_MAP}
						text="Community Climate Vulnerability Map"
						url="https://avl.maps.arcgis.com/apps/instant/lookup/index.html?appid=10e2c4ae45614b92ad4efaa61342b249%2F"
					/>
					<ClickableTile
						image={IMG_RESILIENCY_GUIDE}
						text="Climate Action Toolkit"
						url="https://www.ashevillenc.gov/wp-content/uploads/2025/04/Climate-Action-Toolkit-English-Accessible.pdf"
					/>
					<ClickableTile
						image={IMG_CJI_STORYMAP}
						text="Climate Resilience Initiative"
						url="https://www.ashevillenc.gov/department/recovery-resilience/climate-initiatives/climate-resilience-initiative/"
					/>
				</div>
			</aside>
		</div>
	);
};

const getClimateQuery = gql`
	query getClimate($geoid: [String]) {
		climate(geoid: $geoid) {
			geoid
			name
			totalhh
			heat_score
			cdc_score
			sum_scores
			all_assets_all_threats_sum_score
			all_assets_ncem_vr_percent
			all_assets_ncem_vr_count
			all_assets_wildfire_vr_percent
			all_assets_wildfire_vr_count
			all_assets_landslide_vr_percent
			all_assets_landslide_vr_count
			hvi_level
			tree_level
			tcc
			svi
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
