import React, { useEffect, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Measure from "react-measure";
import { browserHistory, Link } from "react-router";
import { columns } from "./projectsTableConfig";

function ProjectsTable(props) {
  const [width, setWidth] = useState(0);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [data, setData] = React.useState(() => props.data);
  const [inputValue, setInputValue] = useState(1);
  const uniqueStatuses = [
    "All",
    "Proposed",
    "Planning",
    "Design",
    "Construction",
    "Completed",
  ];
  const [pageNum, setPageNum] = useState(1);
  const [sorting, setSorting] = useState([]);
  const rowOptions = [10, 25, 50, 100];
  const [columnFilters, setColumnFilters] = useState(
    getInitialFiltersFromURL()
  );

  function getInitialFiltersFromURL() {
    const params = new URLSearchParams(location.search);
    const filters = [];
    for (const [key, value] of params.entries()) {
      filters.push({ id: key, value });
    }
    return [...filters];
  }

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  useEffect(() => {
    let initialFilters = getInitialFiltersFromURL();
    const otherFilters = ["types", "categories", "size", "page"];

    //verifying url params
    const zipFilterIndex = initialFilters.findIndex((f) => f.id === "zip_code");
    if (zipFilterIndex !== -1) {
      const zip = initialFilters[zipFilterIndex].value.trim();
      if (!props.uniqueZipCodes.includes(zip)) {
        updateURL(
          location.href,
          [
            {
              id: "zip_code",
              value: "All",
            },
          ],
          ["zip_code"]
        );
      }
    }

    const sizeIndex = initialFilters.findIndex((f) => f.id === "size");
    if (sizeIndex !== -1) {
      const size = parseInt(initialFilters[sizeIndex].value.trim(), 10);

      if (isNaN(size) || !rowOptions.includes(size)) {
        updateURL(
          location.href,
          [
            {
              id: "size",
              value: "25",
            },
          ],
          ["size"]
        );
      }
    }

    const statusFilterIndex = initialFilters.findIndex(
      (f) => f.id === "status"
    );
    if (statusFilterIndex !== -1) {
      const status = initialFilters[statusFilterIndex].value.trim();
      if (!props.uniqueZipCodes.includes(status)) {
        updateURL(
          location.href,
          [
            {
              id: "status",
              value: "All",
            },
          ],
          ["status"]
        );
      }
    }

    const columnIds = table.getAllColumns().map((column) => column.id);
    const sortIndex = initialFilters.findIndex((f) => f.id === "sort_column");
    if (sortIndex !== -1) {
      const sort = initialFilters[sortIndex].value.trim();
      if (!columnIds.includes(sort)) {
        const baseUrl = location.pathname;
        const params = new URLSearchParams(location.href.split("?")[1]);
        params.delete("sort_column");
        params.delete("sort_order");
        const updatedURL = `${baseUrl}?${params.toString()}`;
        browserHistory.replace(updatedURL);
      }
    }

    const filtered = initialFilters.filter(
      (obj) => !otherFilters.includes(obj.id)
    );
    setColumnFilters(filtered);
  }, []); 


  

  useEffect(() => {
    let initialFilters = getInitialFiltersFromURL();
    const otherFilters = [
      "types",
      "categories",
      "size",
      "page",
      "sort_order",
      "sort_column",
    ];
    const filtered = initialFilters.filter(
      (obj) => !otherFilters.includes(obj.id)
    );
    setColumnFilters(filtered);

    const page = initialFilters.find((obj) => obj.id === "page");
    const size = initialFilters.find((obj) => obj.id === "size");
    if (size?.value && size?.value > 0) {
      table.setPageSize(Number(size?.value));
    } else {
      table.setPageSize(Number(25));
    }

    //essentially "If page number has changed..."
    if (page?.value && page?.value > 0 && page.value != pageNum) {
      table.setPageIndex(Number(page?.value - 1));
      setInputValue(Number(page?.value));
      setPageNum(page.value);
    } else {
      // if anything besides the page number changes, set page number to 1
      updateURL(
        location.href,
        [
          {
            id: "page",
            value: "1",
          },
        ],
        ["page"]
      );
      table.setPageIndex(0);

      setPageNum(1);
      setInputValue(1);
    }

    const sortColumn = initialFilters.find(
      (obj) => obj.id === "sort_column"
    )?.value;
    const sortOrder = initialFilters.find(
      (obj) => obj.id === "sort_order"
    )?.value;

    if (sortColumn && sortOrder) {
      const newSorting = [
        {
          id: sortColumn,
          desc: sortOrder === "desc",
        },
      ];
      setSorting(newSorting);
      table.setSorting(newSorting);
    } else {
      // If nothing is in URL, clear sorting
      setSorting([]);
      table.setSorting([]);
    }
  }, [location.search]);

  


  useEffect(() => {
    // when filters in table change, update url
    const allFilterIDs = [
      "status",
      "name",
      "zip_code",
      "total_project_funding_budget_document",
      "encumbered",
      "spent",
    ];
    updateURL(location.href, columnFilters, allFilterIDs);
  }, [columnFilters]);

  const table = useReactTable({
    data,
    columns,
    filterFns: {},
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: false,
    onColumnFiltersChange: (newFilters) => {
      setColumnFilters(newFilters);
    },
    onSortingChange: (updater) => {
      const resolvedSorting =
        typeof updater === "function"
          ? updater(table.getState().sorting)
          : updater;
      if (resolvedSorting.length > 0) {
        const { id, desc } = resolvedSorting[0];

        const sortDirection = desc ? "desc" : "asc";

        updateURL(
          location.href,
          [{ id: "sort_column", value: id }],
          ["sort_column"]
        );
        updateURL(
          location.href,
          [{ id: "sort_order", value: sortDirection }],
          ["sort_order"]
        );
      } else {
        // Sorting is cleared (default)
        updateURL(
          location.href,
          [{ id: "sort_column", value: "" }],
          ["sort_column"]
        );
        updateURL(
          location.href,
          [{ id: "sort_order", value: "default" }],
          ["sort_order"]
        );
      }
    },

    state: {
      columnVisibility,
      columnFilters,
      sorting,
    },
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
    initialState: {
      pagination: {
        pageSize: 25,
      },
    },
  });

  useEffect(() => {
    // set data in parent, so map can use it
    const filteredRows = table.getFilteredRowModel().rows;
    const goodrows = filteredRows.map((item) => item.original);
    props.setDataFromTable(goodrows);
  }, [table.getFilteredRowModel().rows]);


  return (
    <div className="row" style={{ marginTop: "10px" }}>
      <div className="col-sm-12">
        <div className="p-2 ReactTable -striped">
          <Measure
            client
            onResize={(contentRect) => {
              setWidth(contentRect.client.width);
            }}
          >
            {({ measureRef }) => (
              <div ref={measureRef}>
                <div
                  style={{
                    ...(width <= 768
                      ? { maxHeight: "30rem", overflow: "auto" }
                      : { overflow: "visible" }),
                  }}
                >
                  <table style={{ width: "100%", tableLayout: "fixed" }}>
                    <thead
                      style={{
                        boxShadow: "0px 2px 15px 0px rgba(0, 0, 0, 0.15),",
                      }}
                    >
                      {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                          {headerGroup.headers.map((header) => {
                            return (
                              <th
                                key={header.id}
                                colSpan={header.colSpan}
                                style={{ width: header.getSize() }}
                              >
                                {header.isPlaceholder ? null : (
                                  <>
                                    <div
                                      {...{
                                        onClick:
                                          header.column.getToggleSortingHandler(),
                                        style: {
                                          boxShadow:
                                            header.column.getIsSorted() ===
                                            "asc"
                                              ? "inset 0 4px 0 0 #4077a5"
                                              : header.column.getIsSorted() ===
                                                "desc"
                                              ? "inset 0 -4px 0 0 #4077a5"
                                              : "none",
                                        },
                                      }}
                                    >
                                      {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                      )}
                                    </div>
                                    <div style={{ padding: "5px" }}>
                                      {header.column.getCanFilter() ? (
                                        header.column.id === "zip_code" ||
                                        header.column.id === "status" ? (
                                          <select
                                            aria-label={`Select a ${
                                              header.column.id === "status"
                                                ? "status"
                                                : "zip code"
                                            }`}
                                            value={
                                              header.column.getFilterValue() ??
                                              "All"
                                            }
                                            onChange={(e) =>
                                              header.column.setFilterValue(
                                                e.target.value
                                              )
                                            }
                                            style={{
                                              width: "100%",
                                              boxSizing: "border-box",
                                            }}
                                          >
                                            {" "}
                                            {header.column.id === "zip_code"
                                              ? props.uniqueZipCodes.map(
                                                  (option) => (
                                                    <option
                                                      key={option}
                                                      value={option}
                                                    >
                                                      {option}
                                                    </option>
                                                  )
                                                )
                                              : uniqueStatuses.map((option) => (
                                                  <option
                                                    key={option}
                                                    value={option}
                                                  >
                                                    {option}
                                                  </option>
                                                ))}
                                          </select>
                                        ) : (
                                          <div>
                                            <Filter column={header.column} />
                                          </div>
                                        )
                                      ) : (
                                        <div
                                          style={{
                                            width: "100%",
                                            height: "27px",
                                            boxSizing: "border-box",
                                            margin: "4px",
                                          }}
                                        ></div>
                                      )}
                                    </div>
                                  </>
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
                              return (
                                <td
                                  key={cell.id}
                                  style={{
                                    padding: "5px 7px",
                                    borderRadius: "0px",
                                    border: "1px solid rgba(0, 0, 0, .02)",
                                  }}
                                >
                                  {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>{" "}
                </div>
                <div className="pagination-bottom" />
                <div className="-pagination">
                  <div className="-previous">
                    <button
                      type="button"
                      style={{ color: "black" }}
                      className="-btn"
                      onClick={() => {
                        setInputValue(parseInt(inputValue) - 1);
                        updateURL(
                          location.href,
                          [
                            {
                              id: "page",
                              value: parseInt(inputValue) - 1,
                            },
                          ],
                          ["page"]
                        );
                      }}
                      disabled={!table.getCanPreviousPage()}
                    >
                      Previous
                    </button>
                  </div>
                  <div className="-center">
                    <span className="-pageInfo">
                      Page{" "}
                      <div className="-pageJump">
                        <input
                          aria-label="Page input"
                          type="number"
                          min="1"
                          max={table.getPageCount()}
                          value={inputValue}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val <= table.getPageCount()) {
                              setInputValue(val);
                            }

                            if (/^\d+$/.test(val)) {
                              const pageNum = Number(val);
                              if (
                                pageNum >= 1 &&
                                pageNum <= table.getPageCount()
                              ) {
                                updateURL(
                                  location.href,
                                  [
                                    {
                                      id: "page",
                                      value: String(pageNum),
                                    },
                                  ],
                                  ["page"]
                                );
                              }
                            }
                          }}
                          className="border p-1 rounded w-16"
                        />
                      </div>{" "}
                      of{" "}
                      <span className="-totalPages">
                        {table.getPageCount()}
                      </span>
                    </span>
                    <span className="select-wrap">
                      <select
                        aria-label="Select the number of rows per page"
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => {
                          updateURL(
                            location.href,
                            [
                              {
                                id: "size",
                                value: Number(e.target.value),
                              },
                            ],
                            ["size"]
                          );
                          updateURL(
                            location.href,
                            [
                              {
                                id: "page",
                                value: "1",
                              },
                            ],
                            ["page"]
                          );
                        }}
                      >
                        {rowOptions.map((pageSize) => (
                          <option key={pageSize} value={pageSize}>
                            {pageSize} rows
                          </option>
                        ))}
                      </select>
                    </span>
                  </div>
                  <div className="-next">
                    <button
                      style={{ color: "black" }}
                      type="button"
                      className="-btn"
                      onClick={() => {
                        setInputValue(parseInt(inputValue) + 1);
                        updateURL(
                          location.href,
                          [
                            {
                              id: "page",
                              value: parseInt(inputValue) + 1,
                            },
                          ],
                          ["page"]
                        );
                      }}
                      disabled={!table.getCanNextPage()}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Measure>
        </div>
      </div>
    </div>
  );
}

function Filter({ column }) {
  const columnFilterValue = column.getFilterValue();
  const { filterVariant } = column.columnDef.meta ?? {};

  return (
    <div style={{}}>
      <DebouncedInput
        className=""
        style={{ width: "100%", boxSizing: "border-box" }}
        onChange={(value) => column.setFilterValue(value)}
        placeholder={`Search...`}
        type="text"
        value={columnFilterValue || ""}
      />
    </div>
  );
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

function updateURL(url, filters, filterIds) {
  const baseUrl = location.pathname;
  const params = new URLSearchParams(url.split("?")[1]);
  const filterMap = Object.fromEntries(filters.map((f) => [f.id, f.value]));
  for (let id of filterIds) {
    const value = filterMap[id];

    if (value === undefined || value === "") {
      params.delete(id);
    } else {
      params.set(id, value);
    }
  }
  const updatedURL = `${baseUrl}?${params.toString()}`;
  browserHistory.replace(updatedURL);
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

export default ProjectsTable;
