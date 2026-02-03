import React, { useEffect, useState } from "react";
import GlobalFilter from "./GlobalFilter";
import TableControls from "./TableControls/TableControls";
import PaginatioNavButtons from "./PaginationNavButtons";

import {
	useReactTable,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	flexRender,
	getFacetedRowModel,
	getExpandedRowModel,
} from "@tanstack/react-table";

export default function Table({ columns, data, navRender, filterRender, filterOptions = [] }) {
	const [sorting, setSorting] = React.useState([]);
	const [globalFilter, setGlobalFilter] = React.useState("");
	const [columnFilter, setColumnFilter] = React.useState(filterOptions);

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			globalFilter,
		},
		defaultColumn: {
			size: 200,
			minSize: 50,
			maxSize: 500,
		},
		initialState: {
			pagination: {
				pageSize: navRender.itemsPerPage ? navRender.itemsPerPage : 10,
			},
		},
		onGlobalFilterChange: setGlobalFilter,
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getExpandedRowModel: getExpandedRowModel(),
		debugTable: true,
	});

	const { pageSize, pageIndex } = table.getState().pagination;

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pageIndex]);

	function handleFilterChange(event) {
		// console.log('Filter Changed', event.target);
		let workingFilters = [...columnFilter];
		workingFilters = workingFilters.map((filter) => {
			if (filter.accessor === event.target.dataset.accessor) {
				// console.log('Matched filter: ', filter);
				filter.value = event.target.value;
			}
			return filter;
		});
		setColumnFilter(workingFilters);
	}

	return (
		<div>
			{filterRender.globalFilterRender && (
				<GlobalFilter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
			)}
			<TableControls
				navRender={navRender}
				pageCount={table.getPageCount()}
				gotoPage={(page) => {
					table.setPageIndex(page);
				}}
				pageIndex={pageIndex}
				pageSize={pageSize}
				setPageSize={(page) => {
					table.setPageSize(page);
				}}
			/>

			<table className="table table-striped table-bordered table-hover w-100">
				<thead>
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								let headerMatch = null;
								if (filterOptions?.length > 0) {
									headerMatch = filterOptions.find((option) => option.accessor === header.id);
								}
								return (
									<th key={header.id} colSpan={header.colSpan} style={{ width: `${header.getSize()}px` }}>
										{header.isPlaceholder ? null : (
											<div
												{...{
													onClick: header.column.getToggleSortingHandler(),
												}}
											>
												{flexRender(header.column.columnDef.header, header.getContext())}
												{header.column.getIsSorted() !== null && header.column.getIsSorted() != false ? (
													<span>{header.column.getIsSorted() === "asc" ? " 🔼" : " 🔽"}</span>
												) : null}
											</div>
										)}
										{headerMatch && (
											<div>
												<select
													className="form-control form-control-sm"
													id={headerMatch.accessor}
													onChange={(event) => {
														handleFilterChange(event);
														// console.log('Setting Column Filter: ', headerMatch, event.target.value);
														header.column.setFilterValue(event.target.value);
													}}
													data-accessor={headerMatch.accessor}
													data-wtf="wtf"
												>
													<option value="">No Filter</option>
													{headerMatch.data.map((option) => {
														return (
															<option value={option} selected={option === headerMatch.data}>
																{option}
															</option>
														);
													})}
												</select>
											</div>
										)}
									</th>
								);
							})}
						</tr>
					))}
				</thead>
				<tbody>
					{table.getRowModel().rows.map((row) => {
						return (
							<tr key={row.id}>
								{row.getVisibleCells().map((cell) => {
									return <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>;
								})}
							</tr>
						);
					})}
				</tbody>
			</table>
			{navRender.paginationButtonsRender && (
				<PaginatioNavButtons
					pageCount={table.getPageCount()}
					gotoPage={(page) => {
						table.setPageIndex(page);
					}}
					pageIndex={pageIndex}
				/>
			)}
		</div>
	);
}
