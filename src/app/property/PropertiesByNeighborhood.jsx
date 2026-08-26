import React from "react";
import AccessibleReactTable from "accessible-react-table";
import PropTypes from "prop-types";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import Map from "../../shared/visualization/Map";
import EmailDownload from "../../shared/EmailDownload";
import Property from "./Property";
import { getBoundsFromPolygonData, combinePolygonsFromPropertyList } from "../../utilities/mapUtilities";
import LoadingAnimation from "../../shared/LoadingAnimation";
import Error from "../../shared/Error";
import expandingRows from "../../shared/react_table_hoc/ExpandingRows";
import createFilterRenderer from "../../shared/FilterRenderer";
import Table from "../../shared/Table/Table";
import { Link } from "react-router";
import Alert from "../../alert";

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
			meta: {
				simpleName: "Pin number",
			},
		},
		{
			accessorKey: "property_civic_address_id",
			enableColumnFilter: true,

			cell: (info) => info.getValue(),
			header: () => <span>Civic Address ID</span>,
			footer: (props) => props.column.id,
			meta: {
				simpleName: "Civic Address ID",
			},
		},
		{
			accessorKey: "address",
			enableColumnFilter: true,
			accessorFn: (row) => [row.property_address, row.property_zipcode].join(" "),
			cell: ({ row }) => (
				<Link to={"/address?id=" + row.original.property_civic_address_id}>
					{row.original.property_address}, {row.original.property_zipcode}
				</Link>
			),
			header: () => <span>Address</span>,
			footer: (props) => props.column.id,
			width: 175,
			meta: {
				simpleName: "Address",
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

const PropertiesByNeighborhood = (props) => {
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

	// filtering out data that don't have any civic address ids. These break the property page and show up weird
	const filteredData = props.data.properties_by_neighborhood.filter(
		(item) => Array.isArray(item.civic_address_ids) && item.civic_address_ids.length > 0
	);

	return (
		<div>
			<EmailDownload downloadData={props.data.properties_by_neighborhood} fileName="properties_by_neighborhodd.csv" />
			<section className="my-4" id="view-container">
				<div id="listView" className={`${props.location.query.view !== "list" ? "hidden" : "flex"}`}>
					{props.data.properties_by_neighborhood.length < 1 ? (
						<Alert type="info">No results found</Alert>
					) : (
						<div className="mt-3">
							<Table
								ariaLabel="PropertyDetails"
								navRender={navRender}
								// data={props.data.properties_by_neighborhood}
								data={filteredData}
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
					{props.data.properties_by_neighborhood.length === 0 || props.location.query.view === "list" ? (
						<Alert type="info">No results found</Alert>
					) : (
						<div className="w-full h-[600px] flex">
							<Map
								bounds={getBoundsFromPolygonData([props.data.neighborhoods[0].polygon])}
								drawPolygon
								// polygonData={combinePolygonsFromPropertyList(props.data.properties_by_neighborhood)}
								polygonData={combinePolygonsFromPropertyList(filteredData)}
							/>
						</div>
					)}
				</div>
			</section>
		</div>
	);
};

PropertiesByNeighborhood.propTypes = {
	spatialEventTopic: PropTypes.string.isRequired,
	location: PropTypes.object, // eslint-disable-line
	query: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

PropertiesByNeighborhood.defaultProps = {
	spatialEventTopic: "crime",
	query: { entity: "address", label: "123 Main street" },
};

const getPropertiesByNeighborhoodQuery = gql`
	query getPropertiesByNeighborhoodQuery($nbrhd_ids: [String]) {
		properties_by_neighborhood(nbrhd_ids: $nbrhd_ids) {
			civic_address_ids
			acreage
			tax_exempt
			building_value
			property_card_link
			deed_link
			appraisal_area
			owner_address
			owner
			market_value
			tax_value
			plat_link
			appraised_value
			land_value
			zoning
			appraisal_area
			is_in_city
			property_civic_address_id
			pinnum
			address
			property_address
			zipcode
			property_zipcode
			neighborhood
			appraisal_area
			latitude
			longitude
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

const PropertiesByNeighborhoodGQL = graphql(getPropertiesByNeighborhoodQuery, {
	options: (ownProps) => ({
		variables: {
			nbrhd_ids: [ownProps.location.query.id.trim()],
		},
	}),
})(PropertiesByNeighborhood);

export default PropertiesByNeighborhoodGQL;
