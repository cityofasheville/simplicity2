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

const FilterRenderer = createFilterRenderer("Search...");

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

const PropertiesByNeighborhood = (props) => {
	if (props.data.loading) {
		// eslint-disable-line react/prop-types
		return <LoadingAnimation />;
	}
	if (props.data.error) {
		// eslint-disable-line react/prop-types
		return <Error message={props.data.error.message} />; // eslint-disable-line react/prop-types
	}

	const ExpandableAccessibleReactTable = expandingRows(AccessibleReactTable);

	return (
		<div>
			<EmailDownload downloadData={props.data.properties_by_neighborhood} fileName="properties_by_neighborhodd.csv" />
			<section className="my-4">
				<div id="listView" className={`${props.location.query.view !== "list" ? "hidden" : "flex"}`}>
					{props.data.properties_by_neighborhood.length < 1 ? (
						<div className="alert alert-info">No results found</div>
					) : (
						<div style={{ marginTop: "10px" }}>
							<ExpandableAccessibleReactTable
								ariaLabel="Neighborhood Properties"
								data={props.data.properties_by_neighborhood}
								columns={dataColumns}
								showPagination={props.data.properties_by_neighborhood.length > 20}
								defaultPageSize={
									props.data.properties_by_neighborhood.length <= 20 ? props.data.properties_by_neighborhood.length : 20
								}
								filterable
								defaultFilterMethod={(filter, row) => {
									const id = filter.pivotId || filter.id;
									return row[id] !== undefined
										? String(row[id]).toLowerCase().indexOf(filter.value.toLowerCase()) > -1
										: true;
								}}
								getTdProps={() => {
									return {
										style: {
											whiteSpace: "normal",
										},
									};
								}}
								getTrProps={(state, rowInfo) => {
									return {
										style: {
											cursor: "pointer",
											background:
												rowInfo !== undefined &&
												Object.keys(state.expanded).includes(rowInfo.viewIndex.toString()) &&
												state.expanded[rowInfo.viewIndex]
													? "#4077a5"
													: "none",
											color:
												rowInfo !== undefined &&
												Object.keys(state.expanded).includes(rowInfo.viewIndex.toString()) &&
												state.expanded[rowInfo.viewIndex]
													? "#fff"
													: "",
											fontWeight:
												rowInfo !== undefined &&
												Object.keys(state.expanded).includes(rowInfo.viewIndex.toString()) &&
												state.expanded[rowInfo.viewIndex]
													? "bold"
													: "normal",
											fontSize:
												rowInfo !== undefined &&
												Object.keys(state.expanded).includes(rowInfo.viewIndex.toString()) &&
												state.expanded[rowInfo.viewIndex]
													? "1.2em"
													: "1em",
										},
									};
								}}
								SubComponent={(row) => (
									<div
										style={{
											paddingLeft: "34px",
											paddingRight: "34px",
											paddingBottom: "15px",
											backgroundColor: "#f6fcff",
											borderRadius: "0px",
											border: "2px solid #4077a5",
										}}
									>
										<Property data={row.original} hideHeader={true} inTable />
									</div>
								)}
							/>
						</div>
					)}
				</div>

				<div id="mapView" className={`${props.location.query.view === "map" ? "flex" : "hidden"}`}>
					{props.data.properties_by_neighborhood.length === 0 || props.location.query.view === "list" ? (
						<div className="alert alert-info">No results found</div>
					) : (
						<div className="w-full h-[600px] flex">
							<Map
								bounds={getBoundsFromPolygonData([props.data.neighborhoods[0].polygon])}
								drawPolygon
								polygonData={combinePolygonsFromPropertyList(props.data.properties_by_neighborhood)}
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
