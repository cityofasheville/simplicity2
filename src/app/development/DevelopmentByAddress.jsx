import React from "react";
import PropTypes from "prop-types";
import L from "leaflet";
import { graphql } from "react-apollo";
import moment from "moment";
import gql from "graphql-tag";
import Map from "../../shared/visualization/Map";
import LoadingAnimation from "../../shared/LoadingAnimation";
import Error from "../../shared/Error";
import PieChart from "../../shared/visualization/PieChart";
import DevelopmentTable from "./DevelopmentTable";
import EmailDownload from "../../shared/EmailDownload";
import { refreshLocation } from "../../utilities/generalUtilities";
import MapLegend from "../../shared/MapLegend";
import Alert from "../../alert";

const getMarker = (type) => {
	switch (type) {
		case "Commercial":
			return require("../../images/Office.png");
		case "Fire":
			return require("../../images/Fire.png");
		case "Residential":
			return require("../../images/Home2.png");
		case "Sign":
			return require("../../images/Direction.png");
		case "Event-Temporary Use":
			return require("../../images/Users4.png");
		case "Historical":
			return require("../../images/Library2.png");
		case "Over The Counter":
			return require("../../images/Mug.png");
		case "Outdoor Vendor":
			return require("../../images/Cook.png");
		case "Development":
			return require("../../images/City.png");
		default:
			return require("../../images/Ellipsis.png");
	}
};

const createLegend = (permitData) => {
	const permitTypes = [];
	let permitTypeAlreadyPresent;
	for (let i = 0; i < permitData.length; i += 1) {
		permitTypeAlreadyPresent = false;
		for (let j = 0; j < permitData.length; j += 1) {
			if (permitTypes[j] === permitData[i].permit_type) {
				permitTypeAlreadyPresent = true;
				break;
			}
		}
		if (!permitTypeAlreadyPresent) {
			permitTypes.push(permitData[i].permit_type);
		}
	}
	return (
		<div className="w-[160px]">
			{permitTypes.map((type) => (
				<div key={`legendItem-${type}`} className="w-[160px] mb-1">
					<img src={getMarker(type)} className="inline-block w-6 align-top"></img>
					<span className="ml-1 inline-block w-[130px]">{type}</span>
				</div>
			))}
		</div>
	);
};

const convertToPieData = (permitData) => {
	let pieData = [];
	let permitTypeAlreadyPresent;
	for (let i = 0; i < permitData.length; i += 1) {
		permitTypeAlreadyPresent = false;
		for (let j = 0; j < pieData.length; j += 1) {
			if (pieData[j].name === permitData[i].permit_type) {
				pieData[j].value += 1;
				permitTypeAlreadyPresent = true;
				break;
			}
		}
		if (!permitTypeAlreadyPresent) {
			pieData.push(Object.assign({}, {}, { name: permitData[i].permit_type, value: 1 }));
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

const DevelopmentByAddress = (props) => {
	if (props.data.loading) {
		// eslint-disable-line react/prop-types
		return <LoadingAnimation />;
	}
	if (props.data.error) {
		// eslint-disable-line react/prop-types
		return <Error message={props.data.error.message} />; // eslint-disable-line react/prop-types
	}

	const mapData = props.data.permits_by_address.map((item) =>
		Object.assign({}, item, {
			popup: `<div><b>${item.permit_type}</b><p>${moment
				.utc(item.applied_date)
				.format("M/DD/YYYY")}</p><p><b>Project <a href="/permits/${
				item.permit_number
			}" target="_blank" rel="noopener noreferrer">View Details</a></b>:<br /><br />${
				item.application_name
			}</p><p><b>Contractor(s):</b> ${item.contractor_names
				.map((contractor, index) => `<div>${contractor}: ${item.contractor_license_numbers[index]}</div>`)
				.join("")}</p></div>`,
			options: {
				icon: L.icon({
					iconUrl: getMarker(item.permit_type),
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
					<EmailDownload downloadData={props.data.permits_by_address} fileName="permits_by_address.csv" />
				</div>
				<div className="btn-group ml-auto" role="tablist">
					<button
						role="tab"
						aria-controls="view-container"
						className="btn btn-primary"
						onClick={() => refreshLocation(getNewUrlParams("map"), props.location)}
						active={props.location.query.view === "map"}
						aria-selected={props.location.query.view === "map"}
					>
						Map view
					</button>
					<button
						role="tab"
						aria-controls="view-container"
						className="btn btn-primary"
						onClick={() => refreshLocation(getNewUrlParams("list"), props.location)}
						active={props.location.query.view === "list"}
						aria-selected={props.location.query.view === "list"}
					>
						List view
					</button>
					{/* <button
						className="btn btn-primary"
						onClick={() => refreshLocation(getNewUrlParams("summary"), props.location)}
						active={props.location.query.view === "summary"}
					>
						Chart
					</button> */}
				</div>
			</div>

			{/* <div id="summaryView" className={`w-full h-full ${props.location.query.view === "summary" ? "flex" : "hidden"}`}>
				{props.data.permits_by_address.length === 0 ? (
					<div className="alert alert-info">No results found</div>
				) : (
					<PieChart data={convertToPieData(props.data.permits_by_address)} altText="Development pie chart" />
				)}
			</div> */}

			<div id="view-container">
				<div id="listView" className={`${props.location.query.view === "list" ? "flex" : "hidden"}`}>
					<DevelopmentTable data={props.data.permits_by_address} location={props.location} />
				</div>

				<div id="mapView" className={`${props.location.query.view === "map" ? "flex" : "hidden"}`}>
					{props.data.permits_by_address.length === 0 || props.location.query.view !== "map" ? (
						<Alert type="info" message="No results found" />
					) : (
						<div className="w-full">
							<div className="w-full h-[600px] flex">
								<Map
									data={mapData}
									showCenter
									legend={createLegend(props.data.permits_by_address)}
									center={
										props.location.query.y !== ""
											? [parseFloat(props.location.query.y), parseFloat(props.location.query.x)]
											: null
									}
									centerLabel={props.location.query.label}
									drawCircle
									radius={props.radius ? parseInt(props.radius, 10) / 3 : 215}
									within={props.radius ? parseInt(props.radius, 10) : 660}
									zoom={parseInt(props.radius, 10) > 2640 ? 14 : parseInt(props.radius, 10) > 1320 ? 15 : 16}
									// within={(props.location.query.within === undefined || props.location.query.within === '') ? 660 : parseInt(props.location.query.within, 10)}
									zoomToPoint={
										props.location.query.zoomToPoint !== undefined && props.location.query.zoomToPoint !== ""
											? props.location.query.zoomToPoint
											: null
									}
								/>
							</div>
							<MapLegend type="development" />
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

DevelopmentByAddress.propTypes = {
	spatialEventTopic: PropTypes.string.isRequired,
	location: PropTypes.object, // eslint-disable-line
	query: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

DevelopmentByAddress.defaultProps = {
	spatialEventTopic: "crime",
	query: { entity: "address", label: "123 Main street" },
};

const getPermitsQuery = gql`
	query getPermitsQuery($civicaddress_id: Int!, $radius: Int, $before: String, $after: String) {
		permits_by_address(civicaddress_id: $civicaddress_id, radius: $radius, before: $before, after: $after) {
			permit_number
			permit_group
			permit_type
			permit_subtype
			permit_description
			application_name
			applied_date
			status_date
			civic_address_id
			address
			x
			y
			contractor_names
			contractor_license_numbers
			comments {
				comment_seq_number
				comment_date
				comments
			}
		}
	}
`;

const DevelopmentByAddressGQL = graphql(getPermitsQuery, {
	options: (ownProps) => {
		const queryVariables = {
			civicaddress_id: +ownProps.location.query.id.trim(),
			radius: +ownProps.radius,
		};

		// if (+ownProps.radius > 0) {
		queryVariables.before = ownProps.before;
		queryVariables.after = ownProps.after;
		// } else {
		//   queryVariables.before = moment.utc().format('YYYY-MM-DD');
		//   queryVariables.after = '1970-01-01';
		// }

		return {
			variables: queryVariables,
		};
	},
})(DevelopmentByAddress);

export default DevelopmentByAddressGQL;
