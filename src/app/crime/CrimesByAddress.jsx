import React from "react";
import PropTypes from "prop-types";
import L from "leaflet";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import moment from "moment";
import LoadingAnimation from "../../shared/LoadingAnimation";
import Error from "../../shared/Error";
import PieChart from "../../shared/visualization/PieChart";
import Map from "../../shared/visualization/Map";
import CrimeTable from "../crime/CrimeTable";
import EmailDownload from "../../shared/EmailDownload";
import ButtonGroup from "../../shared/ButtonGroup";
import Button from "../../shared/Button";
import { refreshLocation } from "../../utilities/generalUtilities";
import { english } from "./english";
import { spanish } from "./spanish";
import { withLanguage } from "../../utilities/lang/LanguageContext";

const getMarker = (type) => {
	switch (type) {
		case "MISSING PERSON REPORT":
		case "RUNAWAY JUVENILE":
			return require("../../images/User.png"); // eslint-disable-line
		case "DAMAGE TO PERSONAL PROPERTY":
		case "VANDALISM":
			return require("../../images/Hammer.png"); // eslint-disable-line
		case "ASSAULT - SIMPLE":
		case "ASSAULT ON FEMALE":
		case "ASSAULT W/DEADLY WEAPON":
			return require("../../images/Ambulance.png"); // eslint-disable-line
		case "COMMUNICATING THREAT":
			return require("../../images/Bubble.png"); // eslint-disable-line
		case "INTIMIDATING STATE WITNESS":
		case "PERJURY":
		case "OBSTRUCTION OF JUSTICE":
			return require("../../images/Library2.png"); // eslint-disable-line
		case "FRAUD":
		case "FRAUD-CREDIT CARD":
		case "FALSE PRETENSE - OBTAIN PROPERTY BY":
		case "IMPERSONATE":
			return require("../../images/Profile.png"); // eslint-disable-line
		case "CARRYING CONCEALED WEAPON":
			return require("../../images/Gun.png"); // eslint-disable-line
		case "RESIST, DELAY, OBSTRUCT OFFICER":
		case "CIT INCIDENT":
		case "DV ASSISTANCE OTHER":
		case "VICTIM ASSISTANCE OTHER":
		case "ASSAULT ON GOVERNMENT OFFICIAL":
			return require("../../images/Shield3.png"); // eslint-disable-line
		case "DWI":
		case "UNAUTHORIZED USE OF MOTOR VEHICLE":
			return require("../../images/Car.png"); // eslint-disable-line
		case "LARCENY OF MV OTHER":
		case "LARCENY OF MV AUTO":
		case "LARCENY OF MV TRUCK":
			return require("../../images/Car.png"); // eslint-disable-line
		case "TRESPASS":
			return require("../../images/Fence.png"); // eslint-disable-line
		case "INFORMATION ONLY":
			return require("../../images/Pencil7.png"); // eslint-disable-line
		case "DRUG PARAPHERNALIA POSSESS":
		case "DRUG OFFENSE - FELONY":
		case "DRUG OFFENSE - MISDEMEANOR":
		case "DRUG PARAPHERNALIA OTHER":
			return require("../../images/AidKit2.png"); // eslint-disable-line
		case "COUNTERFEITING-BUYING/RECEIVING":
			return require("../../images/BillDollar.png"); // eslint-disable-line
		case "LARCENY ALL OTHER":
		case "LARCENY FROM BUILDING":
		case "LARCENY FROM MOTOR VEHICLE":
		case "ROBBERY - COMMON LAW":
		case "ROBBERY - ARMED - KNIFE":
			return require("../../images/Dollar.png"); // eslint-disable-line
		default:
			return require("../../images/Ellipsis.png"); // eslint-disable-line
	}
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
				<div key={`legendItem-${type}`} style={{ width: "160px", marginBottom: "5px" }}>
					<img
						alt="crime icon"
						src={getMarker(type)}
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

const GET_CRIMES_BY_ADDRESS = gql`
	query crimes_by_address($civicaddress_id: Int!, $radius: Int, $before: String, $after: String) {
		crimes_by_address(civicaddress_id: $civicaddress_id, radius: $radius, before: $before, after: $after) {
			case_number
			date_occurred
			address
			offense_long_description
			offense_short_description
			geo_beat
			x
			y
		}
	}
`;

function CrimesByAddress(props) {
	return (
		<Query
			query={GET_CRIMES_BY_ADDRESS}
			variables={{
				civicaddress_id: props.location.query.id ? +props.location.query.id.trim() : "9688",
				radius: +props.radius,
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
				const pieData = convertToPieData(data.crimes_by_address);
				const mapData = data.crimes_by_address.map((item) => {
					return Object.assign({}, item, {
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
								iconUrl: getMarker(item.offense_long_description),
								iconSize: [25, 41],
								iconAnchor: [12, 41],
								popupAnchor: [2, -22],
							}),
						},
					});
				});

				const getNewUrlParams = (view) => ({
					view,
				});

				return (
					<div>
						<div className="flex my-4 items-center">
							<div className="mr-auto">
								<EmailDownload downloadData={data.crimes_by_address} fileName={content.crimes_by_address_filename} />
							</div>
							<div className="btn-group">
								<button
									onClick={() => refreshLocation(getNewUrlParams("map"), props.location)}
									active={props.location.query.view === "map"}
									className="btn btn-primary"
								>
									{content.map_view}
								</button>
								<button
									onClick={() => refreshLocation(getNewUrlParams("list"), props.location)}
									active={props.location.query.view === "list"}
									className="btn btn-primary"
								>
									{content.list_view}
								</button>
								<button
									onClick={() => refreshLocation(getNewUrlParams("summary"), props.location)}
									active={props.location.query.view === "summary"}
									className="btn btn-primary"
								>
									{content.chart_view}
								</button>
							</div>
						</div>
						<div
							id="summaryView"
							className={`w-full h-full ${props.location.query.view === "summary" ? "flex" : "hidden"}`}
						>
							{pieData.length > 0 ? (
								<PieChart data={pieData} altText={content.crime_pie_chart} className="mx-auto" />
							) : (
								<div>{content.no_results_found}</div>
							)}
						</div>

						<div id="listView" className={`${props.location.query.view === "list" ? "flex" : "hidden"}`}>
							<CrimeTable data={data.crimes_by_address} location={props.location} />
						</div>

						<div id="mapView" className={`${props.location.query.view === "map" ? "flex" : "hidden"}`}>
							{data.crimes_by_address.length === 0 || props.location.query.view !== "map" ? (
								<div> {content.no_results_found}</div>
							) : (
								<div className="w-full h-[600px] flex">
									<Map
										data={mapData}
										showCenter
										legend={createLegend(data.crimes_by_address)}
										center={
											props.location.query.x !== ""
												? [parseFloat(props.location.query.y), parseFloat(props.location.query.x)]
												: null
										}
										centerLabel={props.location.query.label}
										drawCircle
										radius={
											props.location.query.within === undefined || props.location.query.within === ""
												? 215
												: parseInt(props.location.query.within, 10) / 3
										}
										within={
											props.location.query.within === undefined || props.location.query.within === ""
												? 660
												: parseInt(props.location.query.within, 10)
										}
										zoomToPoint={
											props.location.query.zoomToPoint !== undefined && props.location.query.zoomToPoint !== ""
												? props.location.query.zoomToPoint
												: null
										}
									/>{" "}
								</div>
							)}
						</div>
					</div>
				);
			}}
		</Query>
	);
}
CrimesByAddress.propTypes = {
	location: PropTypes.object, // eslint-disable-line
	query: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

CrimesByAddress.defaultProps = {
	query: { entity: "address", label: "123 Any street" },
};

export default withLanguage(CrimesByAddress);
