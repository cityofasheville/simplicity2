import React, { useState, useMemo } from "react";
import { graphql } from "react-apollo";
import AccessibleReactTable, { CellFocusWrapper } from "accessible-react-table";
import gql from "graphql-tag";
import DetailsTable from "../../shared/DetailsTable";
import DetailsFormGroup from "../../shared/DetailsFormGroup";
import DetailsIconLinkFormGroup from "../../shared/DetailsIconLinkFormGroup";
import LoadingAnimation from "../../shared/LoadingAnimation";
import Error from "../../shared/Error";
import InCityMessage from "../../shared/InCityMessage";
import PageHeader from "../../shared/PageHeader";
import ButtonGroup from "../../shared/ButtonGroup";
import LinkButton from "../../shared/LinkButton";
import { zoningLinks } from "../address/zoning";
import Map from "../../shared/visualization/Map";
import { Link } from "react-router";
import Table from "../../shared/Table/Table";

import { getBoundsFromPropertyPolygons, combinePolygonsFromPropertyList } from "../../utilities/mapUtilities";
import Icon from "../../shared/Icon";
import {
	IM_PROFILE,
	IM_GOOGLE,
	IM_CERTIFICATE,
	IM_CHECKBOX_PARTIAL2,
	IM_HOME2,
	IM_LIBRARY,
	IM_FLAG7,
} from "../../shared/iconConstants";
// import createFilterRenderer from "../../shared/FilterRenderer";
import SteepSlope from "./SteepSlope";
import ClimateJustice from "../../shared/ClimateJustice";

const PropertyTableConfig = {
	columns: [
		{
			accessorKey: "civic_address_id",
			cell: ({ row }) => (
				<Link
					to={{
						pathname: "/Property/" + `${row.original.civic_address_id}`,
						state: { data: row },
					}}
				>
					<span className="hover:underline">{row.original.civic_address_id}</span>
				</Link>
			),

			header: () => <span>Civic address ID(s)</span>,
			footer: (props) => props.column.id,
		},
		{
			accessorKey: "address",
			enableColumnFilter: true,
			cell: (info) => info.getValue(),
			header: () => <span>Address(es)</span>,
			footer: (props) => props.column.id,
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

const SummaryTableConfig = {
	columns: [
		{
			accessorKey: "value_type",
			cell: ({ row }) => <span>{row.original.value_type}</span>,
			header: () => <span>Property / Tax Value</span>,
			footer: (props) => props.column.id,
		},
		{
			accessorKey: "amount",
			enableColumnFilter: true,
			cell: (info) => info.getValue(),
			header: () => <span>Amount</span>,
			footer: (props) => props.column.id,
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

const getSteepSlope = (pinValue, callback) => {
	let steepSlopeUrl = "https://mapwnc.org/api/slopebypin/" + pinValue;
	fetch(steepSlopeUrl)
		.then((response) => response.json())
		.then((data) => {
			callback(true);
			document.getElementById("ssData").classList.remove("hide-elem");
			document.getElementById("successData").classList.remove("hide-elem");
			document.getElementById("jurisdiction").innerText = data.jurisdiction;
			document.getElementById("acres").innerText = data.acres;
			document.getElementById("elevation").innerText = data.maxElevation;
			document.getElementById("percentSlope").innerText = data.percentSlope;
		})
		.catch((e) => {
			document.getElementById("ssData").classList.remove("hide-elem");
			document.getElementById("slopeError").classList.remove("hide-elem");
			document.getElementById("slopeError").innerText = "There has been an error in the server, please try again.";
		});
};

const getDollars = (value) => {
	const initialSymbols = value < 0 ? "-$" : "$";
	return [initialSymbols, Math.abs(value).toLocaleString()].join("");
};

// const FilterRenderer = createFilterRenderer("Search...");

const Property = (props) => {
	const navRender = PropertyTableConfig.navigationRender;
	const filterRender = PropertyTableConfig.filterRender;
	const propertyTableColumns = useMemo(() => PropertyTableConfig.columns);
	const summaryTableColumns = useMemo(() => SummaryTableConfig.columns);
	const [isSlopeDataShown, setSlopeData] = useState(false);

	if (props.data.loading) {
		return <LoadingAnimation />;
	}
	if (props.data.error) {
		return <Error message={props.data.error.message} />;
	}

	const propertyData = props.inTable ? props.data : props.data.properties[0];
	const dataForAddressesTable = [];
	for (let i = 0; i < propertyData.civic_address_ids.length; i += 1) {
		dataForAddressesTable.push({
			civic_address_id: propertyData.civic_address_ids[i],
			address: propertyData.address[i],
			zipcode: propertyData.zipcode[i],
		});
	}

	const summaryData = [
		{
			value_type: "Building value",
			amount: getDollars(propertyData.building_value),
		},
		{
			value_type: "Land value",
			amount: getDollars(propertyData.land_value),
		},
		{
			value_type: "Appraised value",
			amount: getDollars(propertyData.appraised_value),
		},
		{
			value_type: "Tax value",
			amount: getDollars(propertyData.tax_value),
		},
		{
			value_type: "Total market value",
			amount: getDollars(propertyData.market_value),
		},
	];

	// const summaryData = [
	// 	{
	// 		accessor: "value_type",
	// 		values: data.map((row) => row.value_type),
	// 	},
	// 	{
	// 		accessor: "amount",
	// 		values: data.map((row) => row.amount),
	// 	},
	// ];

	console.log("Property Data:", dataForAddressesTable);

	return (
		<div>
			{props.inTable !== true && (
				<PageHeader
					h1={propertyData.pinnum}
					h2="About this property"
					dataType="Property"
					icon={<Icon path={IM_HOME2} size={50} />}
				>
					<div className="btn-group  ml-auto">
						{props.location.query.fromAddress && (
							<Link
								className="btn btn-primary"
								to={{
									pathname: "/address",
									query: {
										entities: props.location.query.entities,
										search: props.location.query.search,
										id: props.location.query.fromAddress,
										hideNavbar: props.location.query.hideNavbar,
									},
								}}
								onClick={props.onClick}
							>
								Back to address
							</Link>
						)}
						<Link
							className="btn btn-primary"
							to={{
								pathname: "/search",
								query: {
									entities: props.location.query.entities,
									search: props.location.query.search,
									hideNavbar: props.location.query.hideNavbar,
								},
							}}
							onClick={props.onClick}
						>
							Back to search
						</Link>
					</div>
				</PageHeader>
			)}
			<section className="bg-gray-50 p-4">
				<InCityMessage inTheCity={propertyData.is_in_city} />
				<div className="h-[250px] my-4">
					<Map
						height="h-[250px]"
						width="w-full"
						bounds={getBoundsFromPropertyPolygons(propertyData.polygons)}
						drawPolygon
						polygonData={combinePolygonsFromPropertyList([propertyData])}
					/>
				</div>
				<div className="my-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					{propertyData.deed_link && (
						<DetailsIconLinkFormGroup
							label="Deed"
							title="Deed"
							href={propertyData.deed_link}
							icon={<Icon path={IM_CERTIFICATE} size={20} />}
						/>
					)}
					<DetailsIconLinkFormGroup
						label="Property card"
						title="property_card"
						href={propertyData.property_card_link}
						icon={<Icon path={IM_PROFILE} size={20} />}
					/>
					{propertyData.plat_link && (
						<DetailsIconLinkFormGroup
							label="Plat"
							title="Plat"
							href={propertyData.plat_link}
							icon={<Icon path={IM_CHECKBOX_PARTIAL2} size={20} />}
						/>
					)}
					<DetailsIconLinkFormGroup
						label="Google map directions"
						title="Google map directions"
						href={["https://www.google.com/maps?daddr=", propertyData.latitude, ",", propertyData.longitude].join("")}
						icon={<Icon path={IM_GOOGLE} size={20} />}
					/>
				</div>
				<div className="flex justify-center">
					<Table
						ariaLabel="PropertyDetails"
						navRender={false}
						data={summaryData}
						filterRender={false}
						columns={summaryTableColumns}
						defaultPageSize={props.data.length}
						showPagination={false}
						className="w-full items-center"
						width="300"
						minWidth="50"
						maxWidth="800"
					/>
				</div>

				<div className="my-4 grid grid-cols-1 md:grid-cols-2 gap-4">
					<DetailsFormGroup
						label="Owner"
						name="owner"
						value={
							<div>
								<div>{propertyData.owner}</div>
								<div>{propertyData.owner_address}</div>
							</div>
						}
						hasLabel
					/>
					<DetailsFormGroup label="Acreage" name="acreage" value={propertyData.acreage} hasLabel />
					<DetailsFormGroup label="Neighborhood" name="neighborhood" value={propertyData.neighborhood} hasLabel />
					<DetailsFormGroup label="Pin #" name="pinnum" value={propertyData.pinnum} hasLabel />
					<DetailsFormGroup
						label="Tax exempt"
						name="tax_exempt"
						value={propertyData.tax_exempt ? "Yes" : "No"}
						hasLabel
					/>
					<DetailsFormGroup label="Appraisal area" name="appraisal_area" value={propertyData.appraisal_area} hasLabel />
					<DetailsFormGroup
						label="Zoning"
						name="zoning"
						value={
							<div>
								{propertyData.zoning.split(",").map((zone, index) => (
									<span key={`zone_${index}`}>
										{propertyData.zoning_links ? (
											<a href={propertyData.zoning_links.split(",")[index]} target="_blank">
												{propertyData.zoning.split(",")[index]}
											</a>
										) : (
											propertyData.zoning.split(",")[index]
										)}

										{propertyData.zoning.split(",").length > index + 1 ? ", " : ""}
									</span>
								))}
							</div>
						}
						hasLabel
					/>
					{propertyData.local_landmark && (
						<DetailsFormGroup
							label="Local Landmark"
							name="local_landmark"
							value={
								<div>
									<div>{propertyData.local_landmark}</div>
								</div>
							}
							hasLabel
							icon={<Icon path={IM_FLAG7} size={20} />}
						/>
					)}
					{propertyData.historic_district && (
						<DetailsFormGroup
							label="Historic District"
							name="historic_district"
							value={
								<div>
									<div>{propertyData.historic_district}</div>
								</div>
							}
							hasLabel
							icon={<Icon path={IM_LIBRARY} size={20} />}
						/>
					)}
					<DetailsFormGroup
						label="Steep Slope"
						name="steepslope"
						value={<SteepSlope pinnum={propertyData.pinnum} />}
						hasLabel
					/>
				</div>

				{dataForAddressesTable.length && (
					<div className="w-full">
						<h4 className="text-lg">Associated Addresses</h4>
						<Table
							columns={propertyTableColumns}
							data={dataForAddressesTable}
							navRender={navRender}
							filterRender={false}
							className=""
							width="300"
							minWidth="50"
							maxWidth="600"
						/>
					</div>
				)}

				{/* <DetailsFormGroup 
            label="Neighborhood Climate Threats"
            name="climate"
            fullWidth="true"
            value={
              <ClimateJustice inCity={propertyData.is_in_city} civicAddress={0} pinnum={propertyData.pinnum} />
            }
            hasLabel
          /> */}
			</section>
		</div>
	);
};

const propertyQuery = gql`
	query propertyQuery($pins: [String]!) {
		properties(pins: $pins) {
			civic_address_ids
			pinnum
			address
			city
			zipcode
			tax_exempt
			is_in_city
			neighborhood
			appraisal_area
			acreage
			zoning
			zoning_links
			local_landmark
			historic_district
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

const PropertyWithData = graphql(propertyQuery, {
	skip: (ownProps) => ownProps.inTable,
	options: (ownProps) => ({ variables: { pins: [ownProps.location.query.id.trim()] } }),
})(Property);

export default PropertyWithData;
