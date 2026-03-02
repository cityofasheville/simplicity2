import React from "react";
import PropTypes from "prop-types";
import L from "leaflet";
import { Query } from "react-apollo";
import moment from "moment";
import gql from "graphql-tag";
import LoadingAnimation from "../../shared/LoadingAnimation";
import Error from "../../shared/Error";
// import PieChart from "../../shared/visualization/PieChart";
import Map from "../../shared/visualization/Map";
import { getBoundsFromStreetData, convertStreetLinesToLatLngArrays } from "../../utilities/mapUtilities";
import CrimeTable from "../crime/CrimeTable";
import EmailDownload from "../../shared/EmailDownload";
import { refreshLocation } from "../../utilities/generalUtilities";
import { english } from "./english";
import { spanish } from "./spanish";
import { withLanguage } from "../../utilities/lang/LanguageContext";
import MapLegend from "../../shared/MapLegend";
import GetCrimeMarker from "./GetCrimeMarker";

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
		<div className="w-[160pc]">
			{crimeTypes.map((type) => (
				<div key={`legendItem-${type}`} className="w-[160pc] mb-1">
					<img
						alt="legendItem"
						src={GetCrimeMarker(type.trim().toUpperCase())}
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

const GET_CRIMES_BY_STREET = gql`
	query getCrimesAndStreetInfoQuery($centerline_ids: [Float], $radius: Int, $before: String, $after: String) {
		crimes_by_street(centerline_ids: $centerline_ids, radius: $radius, before: $before, after: $after) {
			case_number
			date_occurred
			address
			offense_long_description
			offense_short_description
			geo_beat
			x
			y
		}
		streets(centerline_ids: $centerline_ids) {
			centerline_id
			left_zipcode
			right_zipcode
			line {
				x
				y
			}
		}
	}
`;

function CrimesByStreet(props) {
	return (
		<Query
			query={GET_CRIMES_BY_STREET}
			variables={{
				centerline_ids: props.location.query.id
					.trim()
					.split(",")
					.map((x) => +x),
				radius: props.radius,
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

				const pieData = convertToPieData(data.crimes_by_street);
				const mapData = data.crimes_by_street.map((item) =>
					Object.assign({}, item, {
						popup: `<div style="padding: 8px 0;">
              <p style="margin: 6px 0; text-transform: capitalize;"><b>Location</b>: ${item.address.toLowerCase()}</p><p style="margin: 6px 0;"><b>Date</b>: ${
							item.date_occurred.indexOf("-") === -1
								? moment.unix(item.date_occurred / 1000).format("M/DD/YYYY")
								: moment.utc(item.date_occurred).format("M/DD/YYYY")
						}</p><p style="margin: 6px 0; text-transform: capitalize;"><b>Type</b>: ${item.offense_long_description.toLowerCase()}</p>
            <p style="margin: 6px 0;"><b>Case number</b>: ${item.case_number}</p>
            </div>`, // eslint-disable-line
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
						<div className="flex my-4 items-center">
							<div className="mr-auto">
								<EmailDownload downloadData={data.crimes_by_street} fileName={content.crimes_by_street_filename} />
							</div>
							<div className="btn-group ml-auto">
								<button
									className="btn btn-primary"
									onClick={() => refreshLocation(getNewUrlParams("map"), props.location)}
									active={props.location.query.view === "map"}
									aria-selected={props.location.query.view === "map"}
									positionInGroup="left"
								>
									{content.map_view}
								</button>{" "}
								<button
									className="btn btn-primary"
									onClick={() => refreshLocation(getNewUrlParams("list"), props.location)}
									active={props.location.query.view === "list"}
									aria-selected={props.location.query.view === "list"}
									positionInGroup="middle"
								>
									{content.list_view}
								</button>
								{/* <button
									className="btn btn-primary"
									onClick={() => refreshLocation(getNewUrlParams("summary"), props.location)}
									positionInGroup="right"
									active={props.location.query.view === "summary"}
								>
									{content.chart_view}
								</button> */}
							</div>
						</div>
						{/* <div
							id="summaryView"
							className={`w-full h-full ${props.location.query.view === "summary" ? "flex" : "hidden"}`}
						>
							{pieData.length > 0 ? (
								<PieChart data={pieData} altText={content.crime_pie_chart} className="mx-auto" />
							) : (
								<div>{content.no_results_found}</div>
							)}
						</div> */}

						<div id="listView" className={`${props.location.query.view === "list" ? "flex" : "hidden"}`}>
							<CrimeTable data={data.crimes_by_street} location={props.location} />
						</div>

						<div id="mapView" className={`${props.location.query.view === "map" ? "flex" : "hidden"}`}>
							{data.crimes_by_street.length === 0 || props.location.query.view !== "map" ? (
								<div>{content.no_results_found}</div>
							) : (
								<div className="w-full">
									<div className="w-full h-[600px] flex">
										<Map
											data={mapData}
											legend={createLegend(data.crimes_by_street)}
											bounds={getBoundsFromStreetData(data.streets)}
											drawStreet
											streetData={convertStreetLinesToLatLngArrays(data.streets)}
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
				);
			}}
		</Query>
	);
}

CrimesByStreet.propTypes = {
	location: PropTypes.object, // eslint-disable-line
	query: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

CrimesByStreet.defaultProps = {
	query: { entity: "address", label: "123 Main street" },
};

export default withLanguage(CrimesByStreet);
