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
import { getBoundsFromPolygonData, combinePolygonsFromNeighborhoodList } from "../../utilities/mapUtilities";
import { refreshLocation } from "../../utilities/generalUtilities";
import { english } from "./english";
import { spanish } from "./spanish";
import { withLanguage } from "../../utilities/lang/LanguageContext";
import MapLegend from "../../shared/MapLegend";
import GetCrimeMarker from "./GetCrimeMarker";

const GET_CRIMES_BY_NEIGHBORHOOD = gql`
	query getCrimesQuery($nbrhd_ids: [String], $before: String, $after: String) {
		crimes_by_neighborhood(nbrhd_ids: $nbrhd_ids, before: $before, after: $after) {
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
			pieData.push(Object.assign({}, {}, { name: crimeData[i].offense_long_description, value: 1 }));
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
		<div className="w-[160px] h-[600px] bg-white p-2 pb-10">
			{crimeTypes.map((type) => (
				<div key={`legendItem-${type}`} className="w-[160px]">
					<img
						src={GetCrimeMarker(type.trim().toUpperCase())}
						alt="legendItem"
						className="inline-block w-[25px] align-top"
					/>
					<span className="ml-1 inline-block w-[130px]">{type}</span>
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
						popup: `<div>
  <p class="capitalize"><span class="font-bold">Location</span>: ${item.address.toLowerCase()}</p>
  <p class=""><span class="font-bold">Date</span>: ${
		item.date_occurred.indexOf("-") === -1
			? moment.unix(item.date_occurred / 1000).format("M/DD/YYYY")
			: moment.utc(item.date_occurred).format("M/DD/YYYY")
	}</p>
  <p class="capitalize"><span class="font-bold">Type</span>: ${item.offense_long_description.toLowerCase()}</p>
  <p><span class="font-bold">Case number</span>: ${item.case_number}</p>
</div>`,
						options: {
							icon: L.icon({
								iconUrl: GetCrimeMarker(item.offense_long_description.trim().toUpperCase()),
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
					<div>
						<div className="flex my-4 items-end">
							<EmailDownload
								downloadData={data.crimes_by_neighborhood}
								fileName={content.crimes_by_neighborhood_filename}
							/>
							<div className="btn-group ml-auto">
								<button
									onClick={() => refreshLocation(getNewUrlParams("map"), props.location)}
									active={props.location.query.view === "map"}
									aria-selected={props.location.query.view === "map"}
									className="btn btn-primary"
								>
									{content.map_view}
								</button>
								<button
									onClick={() => refreshLocation(getNewUrlParams("list"), props.location)}
									active={props.location.query.view === "list"}
									aria-selected={props.location.query.view === "list"}
									className="btn btn-primary"
								>
									{content.list_view}
								</button>
								{/* <button
									onClick={() => refreshLocation(getNewUrlParams("summary"), props.location)}
									className="btn btn-primary"
									active={props.location.query.view === "summary"}
								>
									{content.chart_view}
								</button> */}
							</div>
						</div>
						<div>
							{/* <div
								id="summaryView"
								className={`w-full h-full ${props.location.query.view === "summary" ? "flex" : "hidden"}`}
								hidden={props.location.query.view !== "summary"}
							>
								{pieData.length > 0 ? (
									<PieChart data={pieData} altText={content.crime_pie_chart} />
								) : (
									<div>{content.no_results_found}</div>
								)}
							</div> */}
							<div id="listView" className={`${props.location.query.view === "list" ? "flex" : "hidden"}`}>
								<CrimeTable data={data.crimes_by_neighborhood} location={props.location} />
							</div>
							<div id="mapView" className={`${props.location.query.view === "map" ? "flex" : "hidden"}`}>
								{data.crimes_by_neighborhood.length === 0 || props.location.query.view !== "map" ? (
									<div className="alert alert-info">{content.no_results_found}</div>
								) : (
									<div className="w-full">
										<div className="w-full h-[600px] flex">
											<Map
												data={mapData}
												legend={createLegend(data.crimes_by_neighborhood)}
												drawPolygon
												polygonData={combinePolygonsFromNeighborhoodList([data.neighborhoods[0]])}
												bounds={
													props.location.query.zoomToPoint !== undefined && props.location.query.zoomToPoint !== ""
														? null
														: getBoundsFromPolygonData([data.neighborhoods[0].polygon])
												}
												within={parseInt(props.location.query.within, 10)}
												zoomToPoint={
													props.location.query.zoomToPoint !== undefined && props.location.query.zoomToPoint !== ""
														? props.location.query.zoomToPoint
														: null
												}
											/>
										</div>
										<MapLegend type="crime" />
									</div>
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
