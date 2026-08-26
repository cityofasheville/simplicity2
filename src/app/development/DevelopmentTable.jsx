import React, { useMemo } from "react";
import moment from "moment";
import expandingRows from "../../shared/react_table_hoc/ExpandingRows";
import DevelopmentDetail from "./DevelopmentDetail";
import Icon from "../../shared/Icon";
import {
	IM_HOME2,
	IM_MAP5,
	IM_OFFICE,
	IM_DIRECTION,
	IM_LIBRARY2,
	IM_FIRE,
	IM_USERS4,
	IM_COOK,
	IM_CITY,
	LI_WALKING,
	IM_MUG,
} from "../../shared/iconConstants";
import createFilterRenderer from "../../shared/FilterRenderer";
import Table from "../../shared/Table/Table";
import Link from "react-router/lib/Link";
import Alert from "../../alert";

const getIcon = (type, isExpanded) => {
	switch (type) {
		case "Commercial":
			return <Icon ariaHidden={true} path={IM_OFFICE} size={25} color={isExpanded ? "#fff" : "#4077a5"} />;
		case "Residential":
			return <Icon ariaHidden={true} path={IM_HOME2} size={25} color={isExpanded ? "#fff" : "#4077a5"} />;
		case "Sign":
			return <Icon ariaHidden={true} path={IM_DIRECTION} size={25} color={isExpanded ? "#fff" : "#4077a5"} />;
		case "Historical":
			return <Icon ariaHidden={true} path={IM_LIBRARY2} size={25} color={isExpanded ? "#fff" : "#4077a5"} />;
		case "Fire":
			return <Icon ariaHidden={true} path={IM_FIRE} size={25} color={isExpanded ? "#fff" : "#4077a5"} />;
		case "Event-Temporary Use":
			return (
				<Icon
					ariaHidden={true}
					path={IM_USERS4}
					size={25}
					viewBox="0 0 24 24"
					color={isExpanded ? "#fff" : "#4077a5"}
				/>
			);
		case "Outdoor Vendor":
			return <Icon ariaHidden={true} path={IM_COOK} size={25} color={isExpanded ? "#fff" : "#4077a5"} />;
		case "Development":
			return <Icon ariaHidden={true} path={IM_CITY} size={25} color={isExpanded ? "#fff" : "#4077a5"} />;
		case "Right of Way":
			return (
				<Icon
					ariaHidden={true}
					path={LI_WALKING}
					size={25}
					viewBox="0 0 24 24"
					color={isExpanded ? "#fff" : "#4077a5"}
				/>
			);
		case "Over The Counter":
			return <Icon ariaHidden={true} path={IM_MUG} size={25} color={isExpanded ? "#fff" : "#4077a5"} />;
		default:
			return (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="25px"
					transform="translate(0,4)"
					version="1.1"
					viewBox="0 0 16 16"
					width="25px"
				>
					<g fill="none" fillRule="evenodd" id="Icons with numbers" stroke="none" strokeWidth="1">
						<g fill={isExpanded ? "#fff" : "#4077a5"} id="Group" transform="translate(-528.000000, -576.000000)">
							<path
								d="M536,592 C531.581722,592 528,588.418278 528,584 C528,579.581722 531.581722,576 536,576 C540.418278,576 544,579.581722 544,584 C544,588.418278 540.418278,592 536,592 Z M541,586 C542.10457,586 543,585.10457 543,584 C543,582.89543 542.10457,582 541,582 C539.89543,582 539,582.89543 539,584 C539,585.10457 539.89543,586 541,586 Z M531,586 C532.10457,586 533,585.10457 533,584 C533,582.89543 532.10457,582 531,582 C529.89543,582 529,582.89543 529,584 C529,585.10457 529.89543,586 531,586 Z M536,586 C537.10457,586 538,585.10457 538,584 C538,582.89543 537.10457,582 536,582 C534.89543,582 534,582.89543 534,584 C534,585.10457 534.89543,586 536,586 Z M536,586"
								id="Oval 12 copy"
							/>
						</g>
					</g>
				</svg>
			);
	}
};

const DevelopmentTable = (props) => {
	// let content;
	// switch (props.language.language) {
	// 	case "Spanish":
	// 		content = spanish;
	// 		break;
	// 	default:
	// 		content = english;
	// }

	const permitTableConfig = {
		columns: [
			{
				header: () => <span>Project</span>,
				accessorKey: "application_name",
				cell: ({ getValue, row }) => {
					const value = getValue();

					return (
						<span className="flex">
							<span className="ml-1">{value}</span>
						</span>
					);
				},
				enableColumnFilter: true,
				size: 350,
				meta: {
					simpleName: "Project Name",
				},
			},
			{
				accessorKey: "permit_type",
				enableColumnFilter: true,
				cell: ({ getValue, row }) => {
					const value = getValue();

					return (
						<span className="flex">
							<span title={value}>{getIcon(value, row.getIsExpanded())}</span>
							<span className="ml-1">{value}</span>
						</span>
					);
				},
				header: () => <span>Type</span>,
				footer: (props) => props.column.id,
				enableColumnFilter: true,
				size: 300,
				meta: {
					simpleName: "Permit Type",
				},
			},
			{
				accessorKey: "contractor_names",
				enableColumnFilter: true,
				cell: (info) => {
					const names = info.getValue();

					return <span>{Array.isArray(names) && names.length > 0 ? names.join(", ") : ""}</span>;
				},
				header: () => <span>Contractor</span>,
				footer: (props) => props.column.id,
				enableColumnFilter: true,
				size: 400,
				meta: {
					simpleName: "Contractor Name",
				},
				filterFn: (row, columnId, filterValue) => {
					const names = row.getValue(columnId);

					// If it's not an array or is empty, it shouldn't match
					if (!Array.isArray(names) || names.length === 0) return false;

					// Return true if ANY name in the array includes the search term (case-insensitive)
					return names.some((name) => name.toLowerCase().includes(String(filterValue).toLowerCase()));
				},
			},
			{
				accessorKey: "applied_date",
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
				header: () => <span>Applied Date</span>,
				footer: (props) => props.column.id,
				enableColumnFilter: true,
				size: 100,
				meta: {
					simpleName: "Date applied",
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
				accessorKey: "permit_number",
				enableColumnFilter: true,

				cell: (info) => <Link to={"/permits/" + info.getValue()}>{info.getValue()}</Link>,
				header: () => <span>Permit Number</span>,
				footer: (props) => props.column.id,
				enableColumnFilter: true,
				size: 115,
				filterFn: "includesString",
				meta: {
					simpleName: "Permit number",
				},
			},
		],
		navigationRender: {
			paginationButtonsRender: true,
			goToPageRender: false,
			itemsPerPageRender: false,
			itemsPerPage: 20,
		},
		filterRender: {
			globalFilterRender: false,
		},
	};
	const crimeTableColumns = useMemo(() => permitTableConfig.columns);
	const navRender = permitTableConfig.navigationRender;
	const filterRender = permitTableConfig.filterRender;

	return (
		<div className="col-sm-12">
			{props.data.length < 1 ? (
				<Alert type="info">No results found</Alert>
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
							{ accessor: "application_name" },
							{ accessor: "permit_type" },
							{ accessor: "contractor_names" },
							{ accessor: "applied_date" },
							{ accessor: "permit_number" },
						]}
					/>
				</div>
			)}
		</div>
	);
};

export default DevelopmentTable;
