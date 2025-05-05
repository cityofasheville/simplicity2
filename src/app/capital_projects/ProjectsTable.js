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
import {
  IM_SHIELD3,
  IM_TREE,
  IM_HOME2,
  IM_BUS,
  LI_BOLD,
  IM_DROPLET,
  IM_HAMMER,
} from "../../shared/iconConstants";
import { browserHistory } from "react-router";

const getIcon = (category, isExpanded) => {
  switch (category) {
    case "Parks Program":
      return (
        <Icon
          path={IM_TREE}
          size={25}
          color={isExpanded ? "#fff" : "#4077a5"}
        />
      );
    case "Parks & Recreation":
      return (
        <Icon
          path={IM_TREE}
          size={25}
          color={isExpanded ? "#fff" : "#4077a5"}
        />
      );
    case "Transportation Program":
      return (
        <Icon path={IM_BUS} size={25} color={isExpanded ? "#fff" : "#4077a5"} />
      );
    case "Transportation & Infrastructure":
      return (
        <Icon path={IM_BUS} size={25} color={isExpanded ? "#fff" : "#4077a5"} />
      );
    case "Housing Program":
      return (
        <Icon
          path={IM_HOME2}
          size={25}
          color={isExpanded ? "#fff" : "#4077a5"}
        />
      );
    case "Affordable Housing":
      return (
        <Icon
          path={IM_HOME2}
          size={25}
          color={isExpanded ? "#fff" : "#4077a5"}
        />
      );
    case "Public Safety":
      return (
        <Icon
          path={IM_SHIELD3}
          size={25}
          color={isExpanded ? "#fff" : "#4077a5"}
        />
      );
    case "Water":
      return (
        <Icon
          path={IM_DROPLET}
          size={25}
          color={isExpanded ? "#fff" : "#4077a5"}
        />
      );
    case "Building Construction":
      return (
        <Icon
          path={IM_HAMMER}
          size={25}
          color={isExpanded ? "#fff" : "#4077a5"}
        />
      );
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
          <g
            fill="none"
            fillRule="evenodd"
            id="Icons with numbers"
            stroke="none"
            strokeWidth="1"
          >
            <g
              fill={isExpanded ? "#fff" : "#4077a5"}
              id="Group"
              transform="translate(-528.000000, -576.000000)"
            >
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

function ProjectsTable(props) {
  const rerender = React.useReducer(() => ({}), {})[1];
  let [width, setWidth] = useState(0);
  const [columnVisibility, setColumnVisibility] = useState({});
  let [data, setData] = React.useState(() => props.data);

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
    console.log("IN TABLE ARRRG", props.data);
  }, [data]);

  const [columnFilters, setColumnFilters] = useState(
    getInitialFiltersFromURL()
  );

  useEffect(() => {
    setColumnFilters(getInitialFiltersFromURL());
    console.log("in TABLE, filters:", columnFilters);
  }, [location.search]);

  useEffect(() => {
    console.log("COLUMN FILTERS UPDATED", columnFilters);
  }, [columnFilters]);

  function updateURL(url, filters) {
    const baseUrl = location.pathname;
    const params = new URLSearchParams(url.split("?")[1]);

    const allFilterIDs = [
      "status",
      "name",
      "zip_code",
      "total_project_funding_budget_document",
      "encumbered",
      "spent",
    ];

    const filterMap = Object.fromEntries(filters.map((f) => [f.id, f.value]));

    for (let id of allFilterIDs) {
      const value = filterMap[id];

      if (value === undefined || value === "") {
        params.delete(id);
      } else {
        params.set(id, value);
      }
    }

    const updatedURL = `${baseUrl}?${params.toString()}`;
    console.log("updatedURL", updatedURL);
    browserHistory.replace(updatedURL);
  }

  useEffect(() => {
    updateURL(location.href, columnFilters);
  }, [columnFilters]);

  const columns = React.useMemo(
    () => [
      {
        accessorKey: "display_name",
        id: "name",
        header: (
          <button
            aria-label="sort by project name"
            style={{
              cursor: "pointer",
              padding: "10px",
              textAlign: "center",
              width: "100%",
            }}
          >
            Project
          </button>
        ),
        cell: (cell) => (
          <span>
            <span title={cell.row.original.category}>
              {getIcon(
                cell.row.original.category,
                cell.row.original.isExpanded
              )}
            </span>
            {cell.row.original.type === "Bond" && (
              <span title={content.bond_project} style={{ marginLeft: "3px" }}>
                <Icon
                  path={LI_BOLD}
                  size={16}
                  color={cell.row.original.isExpanded ? "#fff" : "#4077a5"}
                  viewBox="0 0 24 24"
                />
              </span>
            )}
            <span style={{ marginLeft: "5px" }}>
              <a href={`/capital_projects/${cell.row.original.gis_id}`}>
                {cell.row.original.display_name}
              </a>
            </span>
          </span>
        ),
      },
      {
        accessorKey: `zip_code`,
        id: "zip_code",
        header: (
          <button
            aria-label="sort by zip code"
            style={{
              cursor: "pointer",
              borderRadius: "0px",
              border: "1px solid rgba(0, 0, 0, .02)",
              padding: "10px",
              textAlign: "center",
              width: "100%",
            }}
          >
            Zip code
          </button>
        ),
        maxWidth: 120,
        size: "5%",
      },
      {
        accessorKey: `status`,
        id: "status",
        header: (
          <button
            aria-label="sort by phase"
            style={{
              cursor: "pointer",
              borderRadius: "0px",
              border: "1px solid rgba(0, 0, 0, .02)",
              padding: "10px",
              textAlign: "center",
              width: "100%",
            }}
          >
            Phase
          </button>
        ),
        maxWidth: 120,
        cell: (cell) => (
          <span>
            {cell.row.original.status === null
              ? "--"
              : cell.row.original.status}
          </span>
        ),
      },
      {
        accessorKey: `total_project_funding_budget_document`,
        // id: 'budget',
        header: (
          <button
            aria-label="sort by budget"
            style={{
              cursor: "pointer",
              borderRadius: "0px",
              border: "1px solid rgba(0, 0, 0, .02)",
              padding: "10px",
              textAlign: "center",
              width: "100%",
            }}
          >
            Budget
          </button>
        ),
        maxWidth: 120,
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
        header: (
          <button
            aria-label="sort by under contract amount"
            style={{
              cursor: "pointer",
              borderRadius: "0px",
              border: "1px solid rgba(0, 0, 0, .02)",
              padding: "10px",
              textAlign: "center",
              width: "100%",
            }}
          >
            Under Contract
          </button>
        ),
        maxWidth: 120,
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
        header: (
          <div
            aria-label="sort by amount spent"
            style={{
              cursor: "pointer",
              borderRadius: "0px",
              border: "1px solid rgba(0, 0, 0, .02)",
              padding: "10px",
              textAlign: "center",
              width: "100%",
            }}
          >
            Spent
          </div>
        ),
        maxWidth: 120,
        sortingFn: (a, b) => {
          const aVal = parseInt(a.original.total_spent, 10) || 0;
          const bVal = parseInt(b.original.total_spent, 10) || 0;
          return bVal - aVal;
        },
      },
    ],
    []
  );

  useEffect(() => {
    setColumnVisibility({
      zip_code: width >= 720,
      total_project_funding_budget_document: width >= 720,
      encumbered: width >= 720,
      spent: width >= 720,
      status: true,
      name: true,
    });
  }, [width]);

  const table = useReactTable({
    data,
    columns,
    defaultColumn: {
      maxSize: 120,
    },
    filterFns: {},
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: (newFilters) => {
      setColumnFilters(newFilters);
    },
    state: {
      columnVisibility,
      columnFilters,
    },
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  });

  useEffect(() => {
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
                            <th key={header.id} colSpan={header.colSpan}>
                              {header.isPlaceholder ? null : (
                                <>
                                  <div
                                    {...{
                                      onClick:
                                        header.column.getToggleSortingHandler(),
                                      style: {
                                        boxShadow:
                                          header.column.getIsSorted() === "asc"
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
                                  {header.column.getCanFilter() ? (
                                    <div>
                                      <Filter column={header.column} />
                                    </div>
                                  ) : null}
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
                </table>
                <div className="pagination-bottom" />
                <div className="-pagination">
                  <div class="-previous">
                    <button
                      type="button"
                      className="-btn"
                      onClick={() => table.previousPage()}
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
                          type="number"
                          min="1"
                          max={table.getPageCount()}
                          defaultValue={
                            table.getState().pagination.pageIndex + 1
                          }
                          onChange={(e) => {
                            const page = e.target.value
                              ? Number(e.target.value) - 1
                              : 0;
                            table.setPageIndex(page);
                          }}
                          className="border p-1 rounded w-16"
                        />
                      </div>{" "}
                      of{" "}
                      <span className="-totalPages">
                        {table.getPageCount()}
                      </span>
                    </span>
                    <span className="select-wrap -pageSizeOptions">
                      <select
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => {
                          table.setPageSize(Number(e.target.value));
                        }}
                      >
                        {[5, 10, 25, 50, 100].map((pageSize) => (
                          <option key={pageSize} value={pageSize}>
                            {pageSize} rows
                          </option>
                        ))}
                      </select>
                    </span>
                  </div>
                  <div className="-next">
                    <button
                      type="button"
                      className="-btn"
                      onClick={() => table.nextPage()}
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
    <div style={{ padding: "4px" }}>
      <DebouncedInput
        className=""
        style={{ width: "100%", boxSizing: "border-box", margin: "4px" }}
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
