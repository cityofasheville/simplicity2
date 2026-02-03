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
		<div className="form-control form-control-lg">
			<label htmlFor="search">Search Table: </label>
			<input
				type="text"
				value={value || ""}
				onChange={(e) => {
					setValue(e.target.value);
					onChange(e.target.value);
				}}
				placeholder=" Enter value "
				className="w-25"
				style={{
					fontSize: "1.1rem",
					margin: "15px",
					display: "inline",
				}}
			/>
		</div>
	);
}

export default GlobalFilter;
