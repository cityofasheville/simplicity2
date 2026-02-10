import React, { useEffect, useState } from "react";
import GlobalFilter from "./GlobalFilter";
import TableControls from "./TableControls/TableControls";
import PaginationNavButtons from "./PaginationNavButtons/PaginationNavButtons";

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

export default function Table({
	columns,
	data,
	navRender,
	filterRender,
	filterOptions = [],
	width = 300,
	minWidth = 50,
	maxWidth = 500,
}) {
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
			size: width,
			minSize: minWidth,
			maxSize: maxWidth,
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
				filterOptions={[
					{
						accessor: "geo_beat",
						data: ["1", "2", "3"],
						value: "",
					},
				]}
			/>

			<table className="w-full">
				<thead>
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								let headerMatch = null;
								if (filterOptions?.length > 0) {
									headerMatch = filterOptions.find((option) => option.accessor === header.id);
								}
								return (
									<th
										className="border p-2"
										key={header.id}
										colSpan={header.colSpan}
										style={{ width: `${header.getSize()}px` }}
									>
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
											<div className="mt-1">
												<input
													type="text"
													value={header.column.getFilterValue() ?? ""}
													onChange={(e) => header.column.setFilterValue(e.target.value)}
													placeholder={`Search...`}
													className="w-full border rounded px-2 py-1 text-sm"
													onClick={(e) => e.stopPropagation()} // prevents sort toggle
												/>
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
							<tr className="odd:bg-white even:bg-gray-50" key={row.id}>
								{row.getVisibleCells().map((cell) => {
									return (
										<td className="border  p-1" key={cell.id}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</td>
									);
								})}
							</tr>
						);
					})}
				</tbody>
			</table>
			{navRender.paginationButtonsRender && (
				<PaginationNavButtons
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
