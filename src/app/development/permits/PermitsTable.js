import React from "react";
import PropTypes from "prop-types";
import AccessibleReactTable from "accessible-react-table";
import createFilterRenderer from "../../../shared/FilterRenderer";
import { defaultTableHeaders } from "../utils";
import { filter } from "d3-array";
import Table from "../../../shared/Table/Table";

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
		console.log(this.props.data);
		const permitTableConfig = {
			columns: [
				{
					header: "Permits",
					columns: this.props.tableHeaders.map((headerObj) => {
						const isPermitNumber = headerObj.field === "permit_number";

						return {
							header: headerObj.display,
							id: headerObj.field,

							accessorFn: (row) => row[headerObj.field],

							cell: ({ getValue }) => {
								const value = getValue();

								if (isPermitNumber) {
									return value ? (
										<a href={`/permits/${value}`} className="text-blue-600 underline">
											{value}
										</a>
									) : null;
								}

								return value ?? "";
							},

							sortingFn: headerObj.sortMethod,
							enableColumnFilter: true,

							meta: {
								filterPlaceholder: `Search ${headerObj.display}`,
							},
						};
					}),
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

		const crimeTableColumns = permitTableConfig.columns;
		const navRender = permitTableConfig.navigationRender;
		const filterRender = permitTableConfig.filterRender;

		return (
			<section title="Table of all permits, filtered by date">
				<Table
					data={this.props.data}
					columns={crimeTableColumns}
					showPagination={true}
					className="w-full items-center"
					navRender={navRender}
					filterRender={filterRender}
					filterOptions={[
						{ accessor: "permit_type" },
						{ accessor: "address" },
						{ accessor: "applied_date" },
						{ accessor: "date_occurred" },
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
