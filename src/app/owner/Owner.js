import React from "react";
import AccessibleReactTable from "accessible-react-table";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import LoadingAnimation from "../../shared/LoadingAnimation";
import Error from "../../shared/Error";
import Property from "../property/Property";
import PageHeader from "../../shared/PageHeader";
import ButtonGroup from "../../shared/ButtonGroup";
import Button from "../../shared/Button";
import LinkButton from "../../shared/LinkButton";
import EmailDownload from "../../shared/EmailDownload";
import Icon from "../../shared/Icon";
import { IM_USER } from "../../shared/iconConstants";
import { getBoundsFromPropertyList, combinePolygonsFromPropertyList } from "../../utilities/mapUtilities";
import Map from "../../shared/visualization/Map";
import { refreshLocation } from "../../utilities/generalUtilities";
import expandingRows from "../../shared/react_table_hoc/ExpandingRows";
import createFilterRenderer from "../../shared/FilterRenderer";
import { Link } from "react-router";
import Table from "../../shared/Table/Table";
import { browserHistory } from "react-router";

const FilterRenderer = createFilterRenderer("Search...");

const dataColumns = [
	{
		Header: "Property",
		id: "property",
		accessor: (property) => (
			<span>
				{property.property_address}, {property.property_zipcode}
			</span>
		),
		minWidth: 335,
		Filter: FilterRenderer,
	},
	{
		Header: "Civic Address ID",
		accessor: "property_civic_address_id",
		width: 160,
		Filter: FilterRenderer,
		filterMethod: (filter, row) => {
			const id = filter.pivotId || filter.id;
			return row[id] !== undefined
				? String(row[id].props.children).toLowerCase().indexOf(filter.value.toLowerCase()) > -1
				: true;
		},
	},
	{
		Header: "Pin #",
		accessor: "pinnum",
		minWidth: 150,
		Filter: FilterRenderer,
	},
];

const Owner = (props) => {
	if (props.data.loading) {
		return <LoadingAnimation />;
	}
	if (props.data.error) {
		return <Error message={props.data.error.message} />;
	}

	const getNewUrlParams = (view) => ({
		view,
	});

	const polygons = Object.keys(props.data.properties).map((key) => props.data.properties[key].polygons);

	const ExpandableAccessibleReactTable = expandingRows(AccessibleReactTable);

	const propertyTableConfig = {
		columns: [
			{
				id: "property",
				header: "Property",
				minSize: 335,
				cell: ({ row }) => {
					const property = row.original;
					return (
						<span>
							{property.property_address}, {property.property_zipcode}
						</span>
					);
				},
				meta: {
					simpleName: "Property",
				},
			},
			{
				accessorKey: "property_civic_address_id",
				header: "Civic Address ID",
				size: 160,
				filterFn: (row, columnId, filterValue) => {
					const value = row.getValue(columnId);
					return value ? String(value).toLowerCase().includes(filterValue.toLowerCase()) : true;
				},
				meta: {
					simpleName: "Civic Address ID",
				},
			},
			{
				accessorKey: "pinnum",
				header: "Pin #",
				minSize: 150,
				meta: {
					simpleName: "Pin Number",
				},
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

	const propertyTableColumns = propertyTableConfig.columns;
	const navRender = propertyTableConfig.navigationRender;
	const filterRender = propertyTableConfig.filterRender;

	const filteredData = props.data.properties.filter(
		(item) => Array.isArray(item.civic_address_ids) && item.civic_address_ids.length > 0
	);

	return (
		<div>
			<PageHeader
				h1={props.data.properties[0].owner}
				h2="About this owner's properties"
				dataType="Owner"
				icon={<Icon ariaHidden={true} path={IM_USER} size={50} />}
			>
				<button className="btn btn-primary ml-auto" onClick={browserHistory.goBack}>
					Back
				</button>
			</PageHeader>
			<div className="flex flex-row">
				<div className="mt-3 mb-4">
					<EmailDownload downloadData={props.data.properties} fileName="properties_by_owner.csv" text="Download CSV" />
				</div>
				<div className="btn-group ml-auto">
					<button
						className="btn btn-primary"
						onClick={() => refreshLocation(getNewUrlParams("map"), props.location)}
						active={props.location.query.view === "map"}
						aria-selected={props.location.query.view === "map"}
					>
						Map view
					</button>
					<button
						className="btn btn-primary"
						onClick={() => refreshLocation(getNewUrlParams("list"), props.location)}
						active={props.location.query.view === "list"}
						aria-selected={props.location.query.view === "list"}
					>
						List view
					</button>
				</div>
			</div>

			<div id="listView" className={`${props.location.query.view === "list" ? "flex" : "hidden"}`}>
				<Table
					ariaLabel="Property Details"
					navRender={navRender}
					data={filteredData}
					// data={props.data.properties_by_street}
					filterRender={filterRender}
					columns={propertyTableColumns}
					defaultPageSize={props.data.length}
					showPagination={true}
					className="w-full items-center"
					filterOptions={[{ accessor: "property_civic_address_id" }, { accessor: "address" }, { accessor: "pinnum" }]}
				/>{" "}
			</div>

			<div id="mapView" className={`${props.location.query.view === "map" ? "flex" : "hidden"} mt-5`}>
				{props.data.properties === 0 || props.location.query.view !== "map" ? (
					<div> {content.no_results_found}</div>
				) : (
					<div className="w-full">
						<div className=" h-[600px] flex flex-col">
							<Map
								bounds={getBoundsFromPropertyList(polygons)}
								drawPolygon
								polygonData={combinePolygonsFromPropertyList(props.data.properties)}
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

const propertyQuery = gql`
	query propertyQuery($pins: [String]!) {
		properties(pins: $pins) {
			civic_address_ids
			property_civic_address_id
			pinnum
			address
			property_address
			city
			property_city
			zipcode
			property_zipcode
			tax_exempt
			is_in_city
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
	}
`;

const OwnerWithData = graphql(propertyQuery, {
	options: (ownProps) => ({
		variables: { pins: ownProps.location === undefined ? ownProps.pins : ownProps.location.query.id.trim().split(",") },
	}),
})(Owner);

export default OwnerWithData;
