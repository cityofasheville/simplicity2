import React, { useState } from "react";
import PropTypes from "prop-types";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { browserHistory } from "react-router";
import * as Ariakit from "@ariakit/react";
import "../search/styles.css";

// Names only; polygons are intentionally omitted to keep this light.
const GET_NEIGHBORHOOD_NAMES = gql`
	query getNeighborhoodNames {
		neighborhoods(nbrhd_ids: []) {
			name
			nbhd_id
		}
	}
`;

const modeOptions = [
	{ key: "mode_legacy", label: "Legacy Neighborhoods", show: "legacy" },
	{ key: "mode_all", label: "All Asheville Neighborhoods", show: "all" },
];

const popoverStyle = {
	backgroundColor: "white",
	border: "1px solid #ccc",
	borderRadius: "4px",
	zIndex: 10000,
	overflow: "auto",
	maxHeight: "min(var(--popover-available-height, 300px), 300px)",
};

// Keep search context so "Back to search" still works after switching.
const getPassthroughQuery = (query) => ({
	entities: query.entities,
	search: query.search,
	hideNavbar: query.hideNavbar,
});

function NeighborhoodPickerInner({ neighborhoods, query }) {
	const [searchValue, setSearchValue] = useState("");
	const combobox = Ariakit.useComboboxStore({ setValue: setSearchValue });

	const options = [
		...modeOptions,
		...[...neighborhoods]
			.sort((a, b) => a.name.localeCompare(b.name))
			.map((n) => ({ key: n.nbhd_id, label: n.name, id: n.nbhd_id })),
	].filter((option) => option.label.toLowerCase().includes(searchValue.trim().toLowerCase()));

	function handleSelect(option) {
		const nextQuery = option.show
			? { ...getPassthroughQuery(query), show: option.show }
			: {
					...getPassthroughQuery(query),
					entity: "neighborhood",
					id: option.id,
					label: option.label,
				};
		combobox.setValue("");
		browserHistory.push({ pathname: "/neighborhood", query: nextQuery });
	}

	return (
		<div className="relative">
			<label htmlFor="neighborhoodPicker" className="block text-sm font-semibold mb-1">
				Switch view
			</label>
			<Ariakit.Combobox
				store={combobox}
				id="neighborhoodPicker"
				placeholder="Search neighborhoods"
				className="w-full border-2 border-blue-100 p-1 bg-white"
				autoComplete="off"
			/>
			<Ariakit.ComboboxPopover store={combobox} gutter={4} sameWidth style={popoverStyle}>
				{options.length === 0 && <div className="p-2 text-gray-600">No matches</div>}
				{options.map((option) => (
					<Ariakit.ComboboxItem
						key={option.key}
						className="combobox-item p-2 bg-white"
						value={option.label}
						setValueOnClick={false}
						onClick={() => handleSelect(option)}
					>
						{option.label}
					</Ariakit.ComboboxItem>
				))}
			</Ariakit.ComboboxPopover>
		</div>
	);
}

function NeighborhoodPicker({ query }) {
	return (
		<Query query={GET_NEIGHBORHOOD_NAMES}>
			{({ loading, error, data }) => {
				if (loading || error || !data || !data.neighborhoods) return null;
				return <NeighborhoodPickerInner neighborhoods={data.neighborhoods} query={query} />;
			}}
		</Query>
	);
}

NeighborhoodPicker.propTypes = {
	query: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default NeighborhoodPicker;
