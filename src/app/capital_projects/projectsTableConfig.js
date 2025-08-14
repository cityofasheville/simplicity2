import React, { useMemo, useState } from "react";
import { Link } from "react-router";
import { iconDictionary } from "./CIPIcons";

export const columns = [
      {
        accessorKey: "display_name",
        id: "name",
        header: (header) => (
          <div
            aria-label="sort by name"
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
            aria-label="sort by amount status"
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
            aria-label="sort by zip code"
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
            aria-label="sort by amount budgeted"
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

          return aVal - bVal; // descending
        },
      },
      {
        accessorFn: (project) =>
          ["$", parseInt(project.encumbered, 10).toLocaleString()].join(""),
        id: "encumbered",
        header: (header) => (
          <div
            aria-label="sort by amount committed"
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
          return aVal - bVal;
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
          return aVal - bVal;
        },
      },
    ]