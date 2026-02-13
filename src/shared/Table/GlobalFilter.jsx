import React from "react";
import useAsyncDebounce from "./utilities/useAsyncDebounce.jsx";

// const { useState, useEffect } = wp.element;

// Component for Global Filter
function GlobalFilter({ globalFilter, setGlobalFilter }) {
	const [value, setValue] = React.useState(globalFilter);

	const onChange = useAsyncDebounce((value) => {
		setGlobalFilter(value || undefined);
	}, 200);

	return (
		<div className="my-4">
			<label htmlFor="tablesearch">Search Table: </label>
			<input
				id="tablesearch"
				type="text"
				value={value || ""}
				onChange={(e) => {
					setValue(e.target.value);
					onChange(e.target.value);
				}}
				placeholder="Search..."
				className=" border rounded px-2 py-1 font-normal text-sm"
			/>
		</div>
	);
}

export default GlobalFilter;
