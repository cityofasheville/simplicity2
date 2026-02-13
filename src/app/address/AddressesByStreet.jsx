import React from "react";
import AccessibleReactTable from "accessible-react-table";
import PropTypes from "prop-types";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import Map from "../../shared/visualization/Map";
import EmailDownload from "../../shared/EmailDownload";
import { getBoundsFromStreetData, convertStreetLinesToLatLngArrays } from "../../utilities/mapUtilities";
import LoadingAnimation from "../../shared/LoadingAnimation";
import Error from "../../shared/Error";
import { english } from "./english";
import { spanish } from "./spanish";
import { withLanguage } from "../../utilities/lang/LanguageContext";
import createFilterRenderer from "../../shared/FilterRenderer";
import Table from "../../shared/Table/Table";

const GET_ADDRESSES_BY_STREET = gql`
	query addresses_by_street($centerline_ids: [Float]) {
		addresses_by_street(centerline_ids: $centerline_ids) {
			civic_address_id
			x
			y
			street_name
			street_prefix
			street_number
			street_type
			unit
			city
			zipcode
			is_in_city
			owner_name
			owner_address
			owner_cityname
			owner_state
			owner_zipcode
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

const streetTableConfig = {
	columns: [
		{
			id: "address",

			header: <span>Address</span>,
			accessorFn: (row) =>
				`${row.street_number || ""} ${row.street_prefix || ""} ${row.street_name || ""} ${row.street_type || ""}`,
			cell: ({ row }) => (
				<div>
					<div>
						{row.original.street_number} {row.original.street_prefix} {row.original.street_name}{" "}
						{row.original.street_type} {row.original.unit ? `#${row.original.unit}` : ""}
					</div>
					<div>
						{row.original.city}, NC {row.original.zipcode}
					</div>
				</div>
			),
			enableColumnFilter: true,
			size: 500,
		},
		{
			accessorKey: "owner",
			cell: ({ row }) => (
				<div>
					<div>{row.original.owner_name}</div>
					<div>{row.original.owner_address}</div>
					<div>
						{row.original.owner_cityname}, {row.original.owner_state} {row.original.owner_zipcode}
					</div>
				</div>
			),
			header: <span>Owner</span>,
			footer: (props) => props.column.id,
			enableColumnFilter: true,
			size: 500,
		},
	],
	navigationRender: {
		paginationButtonsRender: true,
		goToPageRender: true,
		itemsPerPageRender: true,
		itemsPerPage: 20,
	},
	filterRender: {
		globalFilterRender: true,
	},
};

function AddressesByStreet(props) {
	const addressTableColumns = streetTableConfig.columns;
	const navRender = streetTableConfig.navigationRender;
	const filterRender = streetTableConfig.filterRender;
	return (
		<Query
			query={GET_ADDRESSES_BY_STREET}
			variables={{
				centerline_ids: props.location.query.id
					.trim()
					.split(",")
					.map((x) => +x),
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

				const mapData = data.addresses_by_street.map((item) => {
					return Object.assign({}, item, {
						popup: `
              <b>${content.address || ""}</b>
              <div>${item.street_number || ""} ${item.street_prefix || ""} ${item.street_name || ""} ${
							item.street_type || ""
						} ${item.unit || ""}</div>
              <div>${item.city || ""}, NC ${item.zipcode || ""}</div>
              <br /><b>${content.owner || ""}</b>
              <div>${item.owner_name || ""}</div>
              <div>${item.owner_address || ""}</div>
              <div>${item.owner_cityname || ""}, ${item.owner_state || ""} ${item.owner_zipcode || ""}</div>`,
					});
				}); // eslint-disable-line

				return (
					<section>
						<EmailDownload downloadData={data.addresses_by_street} fileName={content.addresses_by_street_filename} />
						<div id="listView" className={`mt-4 ${props.location.query.view === "map" ? "hidden" : "flex"}`}>
							{data.addresses_by_street.length < 1 ? (
								<div className="alert alert-info">No results found</div>
							) : (
								<div className="max-w-[1000px]">
									<Table
										data={data.addresses_by_street}
										columns={addressTableColumns}
										showPagination={true}
										className="w-full items-center"
										navRender={navRender}
										filterRender={filterRender}
										filterOptions={[{ accessor: "address" }, { accessor: "owner" }]}
									/>
								</div>
							)}
						</div>

						<div id="mapView" className={`mt-4 ${props.location.query.view === "map" ? "flex" : "hidden"}`}>
							{data.addresses_by_street.length === 0 || props.location.query.view !== "map" ? (
								<div className="alert alert-info">No results found</div>
							) : (
								<div className="w-full h-[600px] flex">
									<Map
										data={mapData}
										bounds={getBoundsFromStreetData(data.streets)}
										drawStreet
										streetData={convertStreetLinesToLatLngArrays(data.streets)}
									/>
								</div>
							)}
						</div>
					</section>
				);
			}}
		</Query>
	);
}

AddressesByStreet.propTypes = {
	location: PropTypes.object, // eslint-disable-line
	query: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

AddressesByStreet.defaultProps = {
	query: { entity: "address", label: "123 Main street" },
};

export default withLanguage(AddressesByStreet);
