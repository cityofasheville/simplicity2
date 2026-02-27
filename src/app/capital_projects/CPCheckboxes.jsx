import React, { useState } from "react";
import PropTypes from "prop-types";
import { browserHistory } from "react-router";
import { withLanguage } from "../../utilities/lang/LanguageContext";
import { english } from "./english";
import { spanish } from "./spanish";
import { iconDictionary } from "./CIPIcons";
import { CIPcolors } from "./CIPColors";

const CPCheckboxes = (props) => {
	const [newValues, updateNewValues] = useState([]);
	// const content = props.language.language === "Spanish" ? spanish : english;

	function updateURL(url, values) {
		const baseUrl = location.pathname;
		const params = new URLSearchParams(url.split("?")[1]);
		const serializedArray = values.length > 1 ? values.join(",") : values;

		if (props.variableString === "categories") {
			params.set("categories", serializedArray);
		} else if (props.variableString === "types") {
			params.set("types", serializedArray);
		}

		const updatedURL = `${baseUrl}?${params.toString()}${location.hash}`;
		browserHistory.replace(updatedURL);
	}

	const getVisibleSelection = () => {
		const { selected, filter_variable } = props;
		if (selected.length === filter_variable.length) {
			return [...selected, "All"];
		}
		return selected;
	};

	const visibleSelection = getVisibleSelection();

	const handleCheckboxChange = (value) => {
		let updatedSelection = [...visibleSelection];

		if (value === "All") {
			if (!visibleSelection.includes("All")) {
				updatedSelection = [...props.filter_variable];
			} else {
				updatedSelection = [];
			}
		} else {
			if (updatedSelection.includes(value)) {
				updatedSelection = updatedSelection.filter((v) => v !== value);
			} else {
				updatedSelection.push(value);
			}
		}

		updateNewValues(updatedSelection);
		updateURL(
			location.search,
			updatedSelection.filter((e) => e !== "All"),
			props.variableString
		);
	};

	return (
		<div className="checkboxGroup">
			{["All", ...props.filter_variable.filter((type) => type !== "All")].map((type, index) => {
				let displayExtra;
				const isChecked = visibleSelection.includes(type);
				const label = type; // Use mapped label or default
				if (props.variableString == "categories") {
					displayExtra = <i className={`bi ${iconDictionary[type]} mr-1 text-coa-blue-medium text-base`}></i>;
				} else if (props.variableString == "types" && label != "All") {
					displayExtra = (
						<i
							className={`bi bi-circle-fill mr-1 text-base`}
							style={{
								color: CIPcolors[type],
							}}
						></i>
					);
				}

				return (
					<label
						key={`checkbox_${type}_${index}`}
						className={`inline-block py-[2px] px-[5px] m-[2px] rounded-[4px] cursor-pointer text-[14px] ${
							isChecked ? "bg-[#d0ebff]" : "bg-transparent"
						}`}
					>
						<input
							className="mr-[2px] bg-coa-blue-medium accent-coa-blue-medium w-5 h-5 align-text-bottom mt-[2px]"
							type="checkbox"
							value={type}
							checked={isChecked}
							onChange={() => handleCheckboxChange(type)}
						/>
						{displayExtra}
						{label}
					</label>
				);
			})}
		</div>
	);
};

CPCheckboxes.propTypes = {
	selected: PropTypes.arrayOf(PropTypes.string),
	filter_variable: PropTypes.arrayOf(PropTypes.string),
	variableString: PropTypes.string,
	language: PropTypes.object,
};

export default withLanguage(CPCheckboxes);
