import React from "react";
import AccessibleReactTable from "accessible-react-table";
import PropTypes from "prop-types";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import Map from "../../shared/visualization/Map";
import EmailDownload from "../../shared/EmailDownload";
import Property from "./Property";
import {
	getBoundsFromStreetData,
	convertStreetLinesToLatLngArrays,
	combinePolygonsFromPropertyList,
} from "../../utilities/mapUtilities";
import LoadingAnimation from "../../shared/LoadingAnimation";
import Error from "../../shared/Error";
import expandingRows from "../../shared/react_table_hoc/ExpandingRows";
import createFilterRenderer from "../../shared/FilterRenderer";
import Table from "../../shared/Table/Table";
import { Link } from "react-router";

const FilterRenderer = createFilterRenderer("Search...");

const propertyTableConfig = {
	columns: [
		{
			accessorKey: "pinnum",
			enableColumnFilter: true,

			cell: ({ row }) => <Link to={"/property/?id=" + row.original.pinnum}>{row.original.pinnum}</Link>,
			header: () => <span>Pin #</span>,
			footer: (props) => props.column.id,
			width: 175,
		},
		{
			accessorKey: "property_civic_address_id",
			enableColumnFilter: true,

			cell: (info) => info.getValue(),
			header: () => <span>Civic Address ID</span>,
			footer: (props) => props.column.id,
		},
		{
			accessorKey: "address",
			enableColumnFilter: true,

			cell: ({ row }) => (
				<Link to={"/address?id=" + row.original.property_civic_address_id}>
					{row.original.property_address}, {row.original.property_zipcode}
				</Link>
			),
			header: () => <span>Address</span>,
			footer: (props) => props.column.id,
			width: 175,
		},
	],
	navigationRender: {
		paginationButtonsRender: true,
		goToPageRender: true,
		itemsPerPageRender: true,
		itemsPerPage: 20,
	},
	filterRender: {
		globalFilterRender: false,
	},
};

const dataColumns = [
	{
		Header: "Pin #",
		accessor: "pinnum",
		width: 175,
		Cell: (row) => <span>{row.original.pinnum}</span>,
		Filter: FilterRenderer,
		filterMethod: (filter, row) => {
			const joinedInfo = row._original.pinnum;
			return row._original !== undefined ? joinedInfo.toLowerCase().indexOf(filter.value.toLowerCase()) > -1 : true;
		},
	},
	{
		Header: "Civic Address ID",
		accessor: "property_civic_address_id",
		width: 150,
		Filter: FilterRenderer,
	},
	{
		Header: "Address",
		accessor: "Address",
		Cell: (row) => (
			<span>
				{row.original.property_address}, {row.original.property_zipcode}
			</span>
		),
		Filter: FilterRenderer,
		filterMethod: (filter, row) => {
			const joinedInfo = [row._original.address, row._original.zipcode].join(", ");
			return row._original !== undefined ? joinedInfo.toLowerCase().indexOf(filter.value.toLowerCase()) > -1 : true;
		},
	},
];

const PropertiesByStreet = (props) => {
	if (props.data.loading) {
		// eslint-disable-line react/prop-types
		return <LoadingAnimation />;
	}
	if (props.data.error) {
		// eslint-disable-line react/prop-types
		return <Error message={props.data.error.message} />; // eslint-disable-line react/prop-types
	}

	const propertyTableColumns = propertyTableConfig.columns;
	const navRender = propertyTableConfig.navigationRender;
	const filterRender = propertyTableConfig.filterRender;

	return (
		<div>
			<EmailDownload downloadData={props.data.properties_by_street} fileName="properties_by_street.csv" />
			<div className="my-4">
				<div id="listView" className={props.location.query.view !== "list" ? "hidden" : "flex"}>
					{props.data.properties_by_street.length < 1 ? (
						<div className="alert alert-info">No results found</div>
					) : (
						<div alt={["Table of addresses"].join(" ")} className="mt-2">
							<Table
								ariaLabel="PropertyDetails"
								navRender={navRender}
								data={props.data.properties_by_street}
								filterRender={filterRender}
								columns={propertyTableColumns}
								defaultPageSize={props.data.length}
								showPagination={true}
								className="w-full items-center"
								filterOptions={[
									{ accessor: "property_civic_address_id" },
									{ accessor: "address" },
									{ accessor: "pinnum" },
								]}
							/>
						</div>
					)}
				</div>

				<div id="mapView" className={`${props.location.query.view === "map" ? "flex" : "hidden"}`}>
					{props.data.properties_by_street.length === 0 || props.location.query.view === "list" ? (
						<div className="alert alert-info">No results found</div>
					) : (
						<div className="w-full h-[600px] flex">
							<Map
								bounds={getBoundsFromStreetData(props.data.streets)}
								drawStreet
								streetData={convertStreetLinesToLatLngArrays(props.data.streets)}
								drawPolygon
								polygonData={combinePolygonsFromPropertyList(props.data.properties_by_street)}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

PropertiesByStreet.propTypes = {
	spatialEventTopic: PropTypes.string.isRequired,
	location: PropTypes.object, // eslint-disable-line
	query: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

PropertiesByStreet.defaultProps = {
	spatialEventTopic: "crime",
	query: { entity: "address", label: "123 Main street" },
};

const getPropertiesAndStreetInfoQuery = gql`
	query getPropertiesAndStreetInfoQuery($centerline_ids: [Float]) {
		properties_by_street(centerline_ids: $centerline_ids) {
			civic_address_ids
			pinnum
			address
			city
			zipcode
			property_civic_address_id
			property_address
			property_city
			is_in_city
			property_zipcode
			tax_exempt
			neighborhood
			appraisal_area
			acreage
			zoning
			deed_link
			property_card_link
			plat_link
			latitude
			longitude
			building_value
			land_value
			appraised_value
			tax_value
			market_value
			owner
			owner_address
			polygons {
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

const PropertiesByStreetGQL = graphql(getPropertiesAndStreetInfoQuery, {
	options: (ownProps) => ({
		variables: {
			centerline_ids: ownProps.location.query.id
				.trim()
				.split(",")
				.map((x) => +x),
		},
	}),
})(PropertiesByStreet);

export default PropertiesByStreetGQL;
