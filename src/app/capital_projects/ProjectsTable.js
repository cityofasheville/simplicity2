import React, { useEffect, useState } from "react";
import {
  Column,
  SortingFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Measure from "react-measure";
import Icon from "../../shared/Icon";
import { LI_BOLD } from "../../shared/iconConstants";
import { browserHistory, Link } from "react-router";
import { iconDictionary } from "./CIPIcons";

function ProjectsTable(props) {
  // const rerender = React.useReducer(() => ({}), {})[1];
  let [width, setWidth] = useState(0);
  const [columnVisibility, setColumnVisibility] = useState({});
  let [data, setData] = React.useState(() => props.data);
  let [nameColumnWidth, setNameColumnWidth] = useState(0);
  const [inputValue, setInputValue] = useState(1);
  // const uniqueZipCodes = [
  //   "All",
  //   ...new Set(props.data.map((item) => item.zip_code)),
  // ];
  // const uniqueStatuses = [
  //   "All",
  //   ...new Set(props.data.map((item) => item.status)),
  // ];
  const uniqueStatuses = [
    "All",
    "Proposed",
    "Planning",
    "Design",
    "Construction",
    "Completed",
  ];
  let [pageNum, setPageNum] = useState(1);
  const [sorting, setSorting] = useState([]);
  // const projectColumnWidth = width < 576 ? 100 : width < 768 ? 300 : 500;
  // const [pagination, setPagination] = useState({
  //   pageIndex: 0,
  //   pageSize: 25,
  // });

  useEffect(() => {
    if (width < 576) {
      setNameColumnWidth(100);
    } else if (width < 768) {
      setNameColumnWidth(300);
    } else {
      setNameColumnWidth(500);
    }
  }, [width]);

  function getInitialFiltersFromURL() {
    const params = new URLSearchParams(location.search);
    const filters = [];
    for (const [key, value] of params.entries()) {
      filters.push({ id: key, value });
    }
    return [...filters];
  }

  const [columnFilters, setColumnFilters] = useState(
    getInitialFiltersFromURL()
  );

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  useEffect(() => {
    let initialFilters = getInitialFiltersFromURL();
    const otherFilters = ["types", "categories", "size", "page"];
    const filtered = initialFilters.filter(
      (obj) => !otherFilters.includes(obj.id)
    );
    setColumnFilters(filtered);
  }, []); //set

  //------------------------------------------

  const columns = React.useMemo(
    () => [
      {
        accessorKey: "display_name",
        id: "name",
        header: (header) => (
          <div
            aria-label="sort by amount spent"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              borderRadius: "0px",
              border: "1px solid rgba(0, 0, 0, .02)",
              padding: "10px",
              width: "100%",
            }}
          >
            <span>Project</span>
            <i
              className={
                header.column.getIsSorted() === "asc"
                  ? "bi bi-arrow-up"
                  : header.column.getIsSorted() === "desc"
                  ? "bi bi-arrow-down"
                  : "bi bi-arrow-down-up"
              }
            ></i>
          </div>
        ),
        size: 300,
        minSize: 100,
        cell: (cell) => (
          <span>
            <span
              style={{ marginTop: "6px" }}
              title={cell.row.original.category}
            >
              <i
                className={`bi ${iconDictionary[cell.row.original.category]}`}
                style={{
                  fontSize: "1.5rem",
                  verticalAlign: "middle",
                  color: "rgb(64, 119, 165)",
                  display: "inline-block",
                  marginRight: "1px",
                }}
              ></i>
            </span>
            <span style={{ marginLeft: "5px" }}>
              <Link
                to={{
                  pathname: `/capital_projects/${cell.row.original.gis_id}`,
                  state: { previousPath: location.href },
                }}
              >
                {/* {console.log("previous path", location.href)} */}
                {cell.row.original.display_name}
              </Link>
            </span>
          </span>
        ),
      },
      {
        accessorKey: `status`,
        id: "status",
        header: (header) => (
          <div
            aria-label="sort by amount spent"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              borderRadius: "0px",
              border: "1px solid rgba(0, 0, 0, .02)",
              padding: "10px",
              width: "100%",
            }}
          >
            <span>Status</span>
            <i
              className={
                header.column.getIsSorted() === "asc"
                  ? "bi bi-arrow-up"
                  : header.column.getIsSorted() === "desc"
                  ? "bi bi-arrow-down"
                  : "bi bi-arrow-down-up"
              }
            ></i>
          </div>
        ),
        size: 100,
        // maxWidth: 50,
        cell: (cell) => (
          <span>
            {cell.row.original.status === null
              ? "--"
              : cell.row.original.status}
          </span>
        ),
        filterFn: (row, columnId, filterValue) => {
          if (filterValue === "All") return true;
          return row.getValue(columnId) === filterValue;
        },
      },
      {
        accessorKey: `zip_code`,
        id: "zip_code",
        header: (header) => (
          <div
            aria-label="sort by amount spent"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              borderRadius: "0px",
              border: "1px solid rgba(0, 0, 0, .02)",
              padding: "10px",
              width: "100%",
              whiteSpace: "nowrap",
            }}
          >
            <span>Zip Code</span>
            <i
              className={
                header.column.getIsSorted() === "asc"
                  ? "bi bi-arrow-up"
                  : header.column.getIsSorted() === "desc"
                  ? "bi bi-arrow-down"
                  : "bi bi-arrow-down-up"
              }
            ></i>
          </div>
        ),
        size: 120,
        maxWidth: 120,
        filterFn: (row, columnId, filterValue) => {
          if (filterValue === "All") return true;
          return row.getValue(columnId) === filterValue;
        },
      },
      {
        accessorKey: `total_project_funding_budget_document`,
        // id: 'budget',
        header: (header) => (
          <div
            aria-label="sort by amount spent"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              borderRadius: "0px",
              border: "1px solid rgba(0, 0, 0, .02)",
              padding: "10px",
              width: "100%",
            }}
          >
            <span>Budget</span>
            <i
              className={
                header.column.getIsSorted() === "asc"
                  ? "bi bi-arrow-up"
                  : header.column.getIsSorted() === "desc"
                  ? "bi bi-arrow-down"
                  : "bi bi-arrow-down-up"
              }
            ></i>
          </div>
        ),
        cell: (info) => (
          <div style={{ textAlign: "right", width: "100%" }}>
            {info.getValue()}
          </div>
        ),
        size: 100,
        enableColumnFilter: false,
        sortingFn: (a, b) => {
          const parseCurrency = (val) => {
            if (typeof val === "number") return val;
            return parseFloat((val || "").replace(/[$,]/g, "")) || 0;
          };

          const aVal = parseCurrency(
            a.original.total_project_funding_budget_document
          );
          const bVal = parseCurrency(
            b.original.total_project_funding_budget_document
          );

          return bVal - aVal; // descending
        },
      },
      {
        accessorFn: (project) =>
          ["$", parseInt(project.encumbered, 10).toLocaleString()].join(""),
        id: "encumbered",
        header: (header) => (
          <div
            aria-label="sort by amount spent"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              borderRadius: "0px",
              border: "1px solid rgba(0, 0, 0, .02)",
              padding: "10px",
              width: "100%",
            }}
          >
            <span>Committed</span>
            <i
              className={
                header.column.getIsSorted() === "asc"
                  ? "bi bi-arrow-up"
                  : header.column.getIsSorted() === "desc"
                  ? "bi bi-arrow-down"
                  : "bi bi-arrow-down-up"
              }
            ></i>
          </div>
        ),
        cell: (info) => (
          <div style={{ textAlign: "right", width: "100%" }}>
            {info.getValue()}
          </div>
        ),
        size: 125,
        enableColumnFilter: false,
        sortingFn: (a, b) => {
          const aVal = parseInt(a.original.encumbered, 10) || 0;
          const bVal = parseInt(b.original.encumbered, 10) || 0;
          return bVal - aVal;
        },
      },
      {
        accessorFn: (project) =>
          ["$", parseInt(project.total_spent, 10).toLocaleString()].join(""),
        id: "spent",
        header: (header) => (
          <div
            aria-label="sort by amount spent"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              borderRadius: "0px",
              border: "1px solid rgba(0, 0, 0, .02)",
              padding: "10px",
              width: "100%",
            }}
          >
            <span>Spent</span>
            <i
              className={
                header.column.getIsSorted() === "asc"
                  ? "bi bi-arrow-up"
                  : header.column.getIsSorted() === "desc"
                  ? "bi bi-arrow-down"
                  : "bi bi-arrow-down-up"
              }
            ></i>
          </div>
        ),
        cell: (info) => (
          <div style={{ textAlign: "right", width: "100%" }}>
            {info.getValue()}
          </div>
        ),
        size: 100,
        enableColumnFilter: false,
        sortingFn: (a, b) => {
          const aVal = parseInt(a.original.total_spent, 10) || 0;
          const bVal = parseInt(b.original.total_spent, 10) || 0;
          return bVal - aVal;
        },
      },
    ],
    []
  );

  //------------------------------------------

  // useEffect(() => {
  //   setColumnVisibility({
  //     // zip_code: width >= 720,
  //     // total_project_funding_budget_document: width >= 720,
  //     // encumbered: width >= 720,
  //     // spent: width >= 720,
  //     // status: true,
  //     // name: true,
  //   });
  // }, [width]);

  const table = useReactTable({
    data,
    columns,
    // defaultColumn: {
    //   maxSize: 120,
    // },
    filterFns: {},
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // onPaginationChange: setPagination,
    autoResetPageIndex: false,
    onColumnFiltersChange: (newFilters) => {
      setColumnFilters(newFilters);
    },
    // onSortingChange: setSorting,
    onSortingChange: (newSorting) => {
      table.setPageIndex(Number(0));

      setSorting(newSorting);
      setPageNum(1);
      setInputValue(1);
      updateURL(location.href, [{ id: "page", value: "1" }], ["page"]);
    },
    state: {
      columnVisibility,
      columnFilters,
      sorting,
      // pagination
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
    console.log("URL HAS BEEN LISTENED TO");

    let initialFilters = getInitialFiltersFromURL();
    const otherFilters = ["types", "categories", "size", "page"];
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
      console.log("Page Value", page.value, "page", pageNum);
      table.setPageIndex(Number(page?.value - 1));
      setInputValue(Number(page?.value));
      console.log("HIT");
      setPageNum(page.value);
    } else {
      // if anything besides the page number changes, set page number to 1
      console.log("NO HIT");
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
  }, [location.search]);

  // useEffect(() => {
  //   // listens to sorting, to set page to 1 when theres a change
  //   console.log("Table sorted:", table.getState().sorting);
  //   updateURL(
  //     location.href,
  //     [
  //       {
  //         id: "page",
  //         value: "1",
  //       },
  //     ],
  //     ["page"]
  //   );
  //   setPageNum(1);
  //   setInputValue(1);
  // }, [table.getState().sorting]);

  // useEffect(() => {
  //   // listens to sorting, to set page to 1 when theres a change
  //   console.log("Table sorted:", table.getState().sorting);
  //   updateURL(
  //     location.href,
  //     [
  //       {
  //         id: "page",
  //         value: "1",
  //       },
  //     ],
  //     ["page"]
  //   );
  //   setPageNum(1);
  //   setInputValue(1);
  // }, [sorting]);

  useEffect(() => {
    // set data in parent, so map can use it
    const filteredRows = table.getFilteredRowModel().rows;
    const goodrows = filteredRows.map((item) => item.original);
    props.setDataFromTable(goodrows);
  }, [table.getFilteredRowModel().rows]);

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
    // console.log("updatedurl", updatedURL, filters, filterIds);
    browserHistory.replace(updatedURL);
  }

  useEffect(() => {
    // console.log("FILTErS", columnFilters);
  }, [columnFilters]);

  useEffect(() => {
    console.log("table state", table.getState().pagination.pageIndex);
  }, [table.getState().pagination.pageIndex]);

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
                      : { overflow: "visible" }), // optional: explicitly set overflow for larger widths
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
                  <div class="-previous">
                    <button
                      type="button"
                      style={{ color: "black" }}
                      className="-btn"
                      onClick={() =>
                        // table.previousPage()
                        {
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
                        }
                      }
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
                          // table.setPageSize(Number(e.target.value));
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
                        {[10, 25, 50, 100].map((pageSize) => (
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
                      onClick={() =>
                        // table.nextPage()
                        {
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
                        }
                      }
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

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

export default ProjectsTable;

// useEffect(() => {
//   const allFilterIDs = [
//     "status",
//     "name",
//     "zip_code",
//     "total_project_funding_budget_document",
//     "encumbered",
//     "spent",
//   ];
//   updateURL(location.href, columnFilters, allFilterIDs);
// }, [columnFilters]);

// useEffect(() => {
//   const allFilterIDs = ["size"];
//   updateURL(
//     location.href,
//     [{ id: "size", value: table.getState().pagination.pageSize }],
//     allFilterIDs
//   );
// }, [table.getState().pagination.pageSize]);
// const pageIndex = table.getState().pagination.pageIndex;

// useEffect(() => {
//   updateURL(
//     location.href,
//     [
//       {
//         id: "page",
//         value: String(table.getState().pagination.pageIndex + 1),
//       },
//     ],
//     ["page"]
//   );
//   // setColumnFilters({...columnFilters, page: val})

// }, [pageIndex]);
