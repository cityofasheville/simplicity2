import React from "react";
import PropTypes from "prop-types";
import AccessibleReactTable from "accessible-react-table";
import createFilterRenderer from "../../../shared/FilterRenderer";
import { defaultTableHeaders } from "../utils";
import { filter } from "d3-array";
import Table from "../../../shared/Table/Table";
import { getTRCTypeFromPermit } from "../trc/utils";
import moment from "moment";
import TypePuck from "../trc/TypePuck";

function extractTextFromReactComponents(component) {
	if (component === null || component === undefined) {
		return "";
	}
	if (typeof component === "string") {
		return component;
	} else if (!component.props || !component.props.children) {
		return "";
	}
	return (
		"" +
		React.Children.toArray(component.props.children)
			.map((child) => extractTextFromReactComponents(child))
			.join(" ")
	);
}

class PermitsTable extends React.Component {
	constructor(props) {
		super(props);
		const initialFilterParams = [];

		let currentUrlParams = new URLSearchParams(window.location.search);

		for (let thisParam of currentUrlParams.entries()) {
			if (this.props.ignoredParams.indexOf(thisParam[0]) === -1) {
				initialFilterParams.push({
					id: thisParam[0],
					value: decodeURI(thisParam[1]),
				});
			}
		}

		this.state = {
			filterParams: initialFilterParams,
		};

		this.onFilterParamsChange = this.onFilterParamsChange.bind(this);
	}

	onFilterParamsChange(updatedFilterSet) {
		let currentUrlParams = new URLSearchParams(window.location.search);
		// using Array.from() and forEach because the keys() iterator alone was not hitting all params (weird)
		let currentParamKeys = Array.from(currentUrlParams.keys());

		currentParamKeys.forEach((paramKey) => {
			if (this.props.ignoredParams.indexOf(paramKey) === -1) {
				// delete all old filter-related parameters before adding those from the updatedFilterSet (this makes sure previous but now empty filters are removed)
				currentUrlParams.delete(paramKey);
			}
		});

		if (updatedFilterSet.length > 0) {
			updatedFilterSet.forEach((filterObj) => {
				currentUrlParams.set(filterObj.id, filterObj.value);
			});
		}

		if (history.pushState) {
			let newurl =
				window.location.protocol +
				"//" +
				window.location.host +
				window.location.pathname +
				`?${currentUrlParams}${window.location.hash}`;
			window.history.pushState({ path: newurl }, "", newurl);
		}

		this.setState({
			filterParams: updatedFilterSet,
		});
	}

	render() {
		const getPermitTypeDisplay = (permit) => {
			const trcType = getTRCTypeFromPermit(permit);

			if (!trcType) {
				let returnString = permit.permit_type;

				if (permit.permit_subtype !== "NA") {
					returnString += `: ${permit.permit_subtype}`;
				}

				if (permit.permit_category !== "NA") {
					returnString += `: ${permit.permit_category}`;
				}

				return returnString;
			}

			return trcType.id;
		};

		const majorDevTableConfig = {
			columns: [
				{
					header: "Permits",
					columns: [
						{
							id: "applied_date",
							header: "Date Applied",

							// Return a REAL Date object
							accessorFn: (row) => (row.applied_date ? new Date(row.applied_date) : null),

							// Format only for display
							cell: (info) => {
								const value = info.getValue();
								if (!value) return "";

								return moment.utc(value).format("MMM DD, YYYY");
							},

							sortingFn: "datetime",

							enableSorting: true,
							enableColumnFilter: true,
							meta: { simpleName: "Date Applied" },
						},
						{
							id: "address",
							header: "Address",
							accessorFn: (row) => row.address,
							cell: (info) => info.getValue(),
							sortingFn: "auto",
							filterFn: (row, columnId, filterValue) => {
								const values = String(filterValue).split(",");
								const cellValue = row.getValue(columnId);
								const compareText = cellValue != null ? String(cellValue) : "";
								return values.some((val) => compareText.toLowerCase().includes(val.trim().toLowerCase()));
							},
							enableSorting: true,
							enableColumnFilter: true,
							meta: { simpleName: "Address" },
						},
						{
							id: "permit_type",
							header: "Type",

							accessorFn: (row) => getPermitTypeDisplay(row),

							cell: (info) => {
								const permit = info.row.original;
								const trcType = getTRCTypeFromPermit(permit);

								if (!trcType) {
									return getPermitTypeDisplay(permit);
								}

								return (
									<div>
										<span style={{ marginRight: "1em" }}>{trcType.id}</span>
										<div
											style={{
												verticalAlign: "middle",
												display: "inline-block",
												float: "right",
											}}
										>
											<TypePuck typeObject={trcType} size={30} hover={false} />
										</div>
									</div>
								);
							},

							sortingFn: "auto",
							filterFn: (row, columnId, filterValue) => {
								const values = String(filterValue).split(",");
								const cellValue = row.getValue(columnId);
								const compareText = cellValue != null ? String(cellValue) : "";

								return values.some((val) => compareText.toLowerCase().includes(val.trim().toLowerCase()));
							},

							enableSorting: true,
							enableColumnFilter: true,
							meta: { simpleName: "Type" },
						},
						{
							id: "application_name",
							header: "Project",
							accessorFn: (row) => row.application_name,
							cell: (info) => info.getValue(),
							sortingFn: "auto",
							filterFn: (row, columnId, filterValue) => {
								const values = String(filterValue).split(",");
								const cellValue = row.getValue(columnId);
								const compareText = cellValue != null ? String(cellValue) : "";
								return values.some((val) => compareText.toLowerCase().includes(val.trim().toLowerCase()));
							},
							enableSorting: true,
							enableColumnFilter: true,
							meta: { simpleName: "Project" },
						},
						{
							id: "permit_number",
							header: "Record Link",
							accessorFn: (row) => row.permit_number,
							cell: (info) => (
								<a href={`/permits/${info.row.original.permit_number}`}>{info.row.original.permit_number}</a>
							),
							sortingFn: "auto",
							filterFn: (row, columnId, filterValue) => {
								const values = String(filterValue).split(",");
								const cellValue = row.getValue(columnId);
								const compareText = cellValue != null ? String(cellValue) : "";
								return values.some((val) => compareText.toLowerCase().includes(val.trim().toLowerCase()));
							},
							enableSorting: true,
							enableColumnFilter: true,
							meta: { simpleName: "Record Link" },
						},
					],
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

		const permitTableColumns = majorDevTableConfig.columns;
		const navRender = majorDevTableConfig.navigationRender;
		const filterRender = majorDevTableConfig.filterRender;

		return (
			<section title="Table of all permits, filtered by date">
				<Table
					data={this.props.data}
					columns={permitTableColumns}
					showPagination={true}
					className="w-full items-center"
					navRender={navRender}
					filterRender={filterRender}
					filterOptions={[
						{ accessor: "permit_type" },
						{ accessor: "address" },
						{ accessor: "application_name" },
						{ accessor: "permit_number" },
					]}
				/>
			</section>
		);
	}
}

PermitsTable.propTypes = {
	data: PropTypes.arrayOf(PropTypes.object),
	tableHeaders: PropTypes.arrayOf(PropTypes.object),
};

PermitsTable.defaultProps = {
	data: [],
	tableHeaders: defaultTableHeaders,
	ignoredParams: [],
};

export default PermitsTable;
