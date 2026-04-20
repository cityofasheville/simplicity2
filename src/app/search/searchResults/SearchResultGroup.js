import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import AccessibleReactTable, { CellFocusWrapper } from "accessible-react-table";
import Icon from "../../../shared/Icon";
// import styles from './searchResultGroup.css';
import { getLink, getPlural, getIcon } from "./searchResultsUtils";
import { IM_GOOGLE } from "../../../shared/iconConstants";
import * as poweredByGoogle from "./powered_by_google_on_white.png";
import createFilterRenderer from "../../../shared/FilterRenderer";
import LinkFocusWrapper from "../../../shared/LinkFocusWrapper";
import InCityMessage from "../../../shared/InCityMessage";
import SearchResultsTable from "./SearchResultsTable";

const SearchResultGroup = (props) => {
	const searchMode = props.searchMode || "main";

	// const dataColumns = [
	// 	{
	// 		headerStyle: { boxShadow: "none" },
	// 		Header: (
	// 			<h2 className=" text-4xl items-center text-red-700 w-full inline-flex py-5 px-1">
	// 				{getIcon(props.data.label)}
	// 				{getPlural(props.data.label)}
	// 				<span className="sr-only">Number of results</span>
	// 				<span className="flex items-center justify-center h-6 ml-2 min-w-6 inline-block min-w-3 px-2 py-1 text-xs font-medium text-white align-middle text-center bg-coa-blue-medium rounded-full">
	// 					{props.data.results.length}
	// 				</span>
	// 				{props.data.label === "place" && <img src={poweredByGoogle} alt="Powered by Google" className="ml-5"></img>}
	// 			</h2>
	// 		),
	// 		accessor: "label",
	// 		innerFocus: true,
	// 		Cell: (row) => (
	// 			<CellFocusWrapper>
	// 				{(focusRef, focusable) => (
	// 					<span
	// 						className="search-results-group__row-inner"
	// 						style={{ justifyContent: "space-between", alignItems: "baseline", lineHeight: "1" }}
	// 					>
	// 						{/* This LinkFocusWrapper can be replaced by the innerRef prop on the Link component
	//             in react-router ^4.2.0. Presently it serves as a work around for not having that
	//             prop. */}
	// 						<span style={{ border: "0px solid red" }}>
	// 							<LinkFocusWrapper focusRef={focusRef}>
	// 								<Link
	// 									className="search-results-group__link"
	// 									tabIndex={focusable ? 0 : -1}
	// 									to={getLink(
	// 										row.original.type,
	// 										row.original.id,
	// 										props.searchText,
	// 										props.selectedEntities,
	// 										row.original.label,
	// 										props.originalSearch
	// 									)}
	// 									target={searchMode === "mini" ? "_blank" : null}
	// 								>
	// 									<span className="text-primary">
	// 										{getIcon(row.original.type === "place" ? "search" : row.original.type)}
	// 										{row.value}
	// 									</span>
	// 								</Link>
	// 							</LinkFocusWrapper>

	// 							{props.data.label === "address" && row.original.inCity !== undefined && (
	// 								<span style={{ display: "inline-block", fontSize: "0.85em", marginLeft: "20px" }}>
	// 									<InCityMessage inTheCity={row.original.inCity} icon={false} />
	// 								</span>
	// 							)}
	// 						</span>

	// 						{props.data.label === "place" && (
	// 							<span className="text-primary">
	// 								<a
	// 									tabIndex="-1"
	// 									href={["https://www.google.com/maps/place/?q=place_id:", row.original.place_id].join("")}
	// 									target="_blank"
	// 								>
	// 									<span style={{ marginRight: "5px" }}>
	// 										<Icon path={IM_GOOGLE} size={26} />
	// 									</span>
	// 									{row.original.place_name}
	// 								</a>
	// 							</span>
	// 						)}
	// 						{props.data.label === "address" && searchMode !== "mini" && (
	// 							<span style={{ marginRight: "8px" }}>
	// 								<Link
	// 									to={
	// 										`/DEVELOPMENT?view=list&` +
	// 										`entities=undefined&` +
	// 										`entity=address&` +
	// 										`within=0&` +
	// 										`id=${row.original.id}&` +
	// 										`label=${row.original.label}&` +
	// 										`search=${props.searchText}&` +
	// 										`x=${row.original.x}&` +
	// 										`y=${row.original.y}`
	// 									}
	// 								>
	// 									Permits
	// 								</Link>
	// 							</span>
	// 						)}
	// 					</span>
	// 				)}
	// 			</CellFocusWrapper>
	// 		),
	// 		Filter: createFilterRenderer("Filter Results...", {
	// 			style: undefined,
	// 			className: "full-width",
	// 		}),
	// 	},
	// ];

	const searchResultsTableConfig = {
		columns: [
			{
				header: () => (
					<h2 className="text-coa-blue-medium font-lighter text-4xl items-center w-full inline-flex py-5 px-1">
						{getIcon(props.data.label)}
						{getPlural(props.data.label)}
						<span className="sr-only">Number of results</span>
						<span className="flex items-center justify-center h-6 ml-2 min-w-6 inline-block min-w-3 px-2 py-1 text-xs font-medium text-white align-middle text-center bg-coa-blue-medium rounded-full">
							{props.data.results.length}
						</span>
						{props.data.label === "place" && <img src={poweredByGoogle} alt="Powered by Google" className="ml-5"></img>}
					</h2>
				),
				accessorKey: "label",
				cell: (info) => {
					const row = info.row.original;
					const value = info.getValue();

					return (
						<span className=" px-2 py-1 flex justify-between items-baseline leading-none">
							<span className="flex flex-col">
								<Link
									className="search-results-group__link"
									to={getLink(
										row.type,
										row.id,
										props.searchText,
										props.selectedEntities,
										row.label,
										props.originalSearch
									)}
									target={searchMode === "mini" ? "_blank" : undefined}
								>
									<span className="text-primary">
										{getIcon(row.type === "place" ? "search" : row.type)}
										{value}
									</span>
								</Link>

								{props.data.label === "address" && row.inCity !== undefined && (
									<span className="ml-8 text-sm">
										<InCityMessage inTheCity={row.inCity} icon={false} />
									</span>
								)}
							</span>

							{props.data.label === "place" && (
								<span className="text-primary">
									<a
										tabIndex={-1}
										href={`https://www.google.com/maps/place/?q=place_id:${row.place_id}`}
										target="_blank"
										rel="noopener noreferrer"
									>
										<span style={{ marginRight: "5px" }}>
											<Icon path={IM_GOOGLE} size={26} />
										</span>
										{row.place_name}
									</a>
								</span>
							)}

							{props.data.label === "address" && searchMode !== "mini" && (
								<span style={{ marginRight: "8px" }}>
									<Link
										to={
											`/DEVELOPMENT?view=list&` +
											`entities=undefined&` +
											`entity=address&` +
											`within=0&` +
											`id=${row.id}&` +
											`label=${row.label}&` +
											`search=${props.searchText}&` +
											`x=${row.x}&` +
											`y=${row.y}`
										}
									>
										Permits
									</Link>
								</span>
							)}
						</span>
					);
				},

				enableColumnFilter: true,
				size: 350,
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
	const searchResultsTableColumns = useMemo(() => searchResultsTableConfig.columns);
	const navRender = searchResultsTableConfig.navigationRender;
	const filterRender = searchResultsTableConfig.filterRender;

	return (
		<div className="mb-6">
			<SearchResultsTable
				data={props.data.results}
				columns={searchResultsTableColumns}
				showPagination={false}
				className="w-full items-center"
				navRender={navRender}
				filterRender={filterRender}
				filterOptions={[{ accessor: "label" }]}
			/>
		</div>
	);
};

const resultsShape = {
	id: PropTypes.string,
	type: PropTypes.string,
	label: PropTypes.string,
};

const groupShape = {
	label: PropTypes.string,
	type: PropTypes.string,
	results: PropTypes.arrayOf(PropTypes.shape(resultsShape)),
};

SearchResultGroup.propTypes = {
	data: PropTypes.shape(groupShape),
	searchText: PropTypes.string,
	selectedEntities: PropTypes.string,
};

export default SearchResultGroup;
