import React, { useMemo } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import Icon from "../../shared/Icon";
import { english } from "./english";
import { spanish } from "./spanish";
import { withLanguage } from "../../utilities/lang/LanguageContext";
import createFilterRenderer from "../../shared/FilterRenderer";
import Table from "../../shared/Table/Table";
import { IM_MAP5 } from "../../shared/iconConstants";
import GetCrimeIcon from "./GetCrimeIcon";
import Alert from "../../alert";

const CrimeTable = (props) => {
	let content;
	const urlString = `${props.location.pathname}?entity=${props.location.query.entity}&id=${
		props.location.query.id
	}&entities=${props.location.query.entities}&label=${props.location.query.label}&within=${
		props.location.query.within || "660"
	}&during=${props.location.query.during || "183"}&search=${props.location.query.search}&view=map&x=${
		props.location.query.x
	}&y=${props.location.query.y}`; // eslint-disable-line

	switch (props.language.language) {
		case "Spanish":
			content = spanish;
			break;
		default:
			content = english;
	}

	const crimeTableConfig = {
		columns: [
			{
				header: content.type,
				id: "offense_long_description",
				accessorFn: (row) => (row.offense_long_description ?? "").trim().toUpperCase(),

				cell: ({ getValue, row }) => {
					const value = getValue();

					return (
						<span className="inline-flex items-baseline gap-1.5">
							<span title={row.original.crime}>{GetCrimeIcon(value, row.getIsExpanded())}</span>
							<span className="ml-1">{value}</span>
						</span>
					);
				},

				enableColumnFilter: true,
				size: 355,
				meta: {
					simpleName: "Offense type",
				},
			},
			{
				accessorKey: "date_occurred",
				cell: (info) => {
					const crime = info.getValue();

					return (
						<span>
							{crime.indexOf("-") === -1
								? moment.unix(crime / 1000).format("M/DD/YYYY")
								: moment.utc(crime).format("M/DD/YYYY")}
						</span>
					);
				},
				header: () => <span>Date</span>,
				footer: (props) => props.column.id,
				enableColumnFilter: true,
				size: 120,
				meta: {
					simpleName: "Date",
				},
				filterFn: (row, columnId, filterValue) => {
					const value = row.getValue(columnId);

					const formatted =
						value.indexOf("-") === -1
							? moment.unix(value / 1000).format("M/DD/YYYY")
							: moment.utc(value).format("M/DD/YYYY");

					return formatted.toLowerCase().includes(filterValue.toLowerCase());
				},
			},
			{
				accessorKey: "address",
				enableColumnFilter: true,
				cell: ({ row, getValue }) => {
					const href = [urlString, "&zoomToPoint=", [row.original.y, row.original.x].join(",")].join("");

					return (
						<a
							title={content.click_to_crime}
							aria-label="link to crime location on map"
							href={href}
							onClick={(e) => e.stopPropagation()}
							style={{ display: "inline-flex", alignItems: "center" }}
						>
							<Icon path={IM_MAP5} size={23} />
							<span style={{ marginLeft: "5px" }}>{getValue()}</span>
						</a>
					);
				},
				header: () => <span>Location</span>,
				footer: (props) => props.column.id,
				enableColumnFilter: true,
				size: 420,
				meta: {
					simpleName: "Location",
				},
			},
			{
				accessorKey: "case_number",
				enableColumnFilter: true,
				cell: (info) => info.getValue(),
				header: () => <span>Case #</span>,
				footer: (props) => props.column.id,
				enableColumnFilter: true,
				size: 220,
				meta: {
					simpleName: "Case number",
				},
			},
			// {
			// 	accessorKey: "geo_beat",
			// 	enableColumnFilter: true,
			// 	cell: (info) => info.getValue(),
			// 	header: () => <span>Law Beat</span>,
			// 	footer: (props) => props.column.id,
			// 	enableColumnFilter: true,
			// 	size: 200,
			// 	filterFn: "includesString",
			// },
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
	const crimeTableColumns = useMemo(() => crimeTableConfig.columns);
	const navRender = crimeTableConfig.navigationRender;
	const filterRender = crimeTableConfig.filterRender;

	return (
		<div>
			<div className="col-sm-12">
				{props.data.length < 1 ? (
					<Alert type="info" message={content.no_results_found} />
				) : (
					<div className="mt-3">
						<Table
							data={props.data}
							columns={crimeTableColumns}
							showPagination={true}
							className="w-full items-center"
							navRender={navRender}
							filterRender={filterRender}
							filterOptions={[
								{ accessor: "offense_long_description" },
								{ accessor: "address" },
								{ accessor: "case_number" },
								{ accessor: "date_occurred" },
								{ accessor: "geo_beat" },
							]}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

CrimeTable.propTypes = {
	data: PropTypes.array, // eslint-disable-line
};

CrimeTable.defaultProps = {
	data: [],
};

export default withLanguage(CrimeTable);
