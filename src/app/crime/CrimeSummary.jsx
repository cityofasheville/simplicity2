import React from "react";
import { browserHistory } from "react-router";
import moment from "moment";
import CrimesByAddress from "./CrimesByAddress";
import CrimesByStreet from "./CrimesByStreet";
import CrimesByNeighborhood from "./CrimesByNeighborhood";
import Icon from "../../shared/Icon";
// import styles from '../spatial_event_topic_summary/spatialEventTopicFilters.css';
import SpatialEventTopicLocationInfo from "../spatial_event_topic_summary/SpatialEventTopicLocationInfo";
import { IM_SHIELD3, IM_LIBRARY2 } from "../../shared/iconConstants";
import { refreshLocation } from "../../utilities/generalUtilities";
import { english } from "./english";
import { spanish } from "./spanish";
import { withLanguage } from "../../utilities/lang/LanguageContext";

const CrimeSummary = (props) => {
	// set language
	let content;
	switch (props.language.language) {
		case "Spanish":
			content = spanish;
			break;
		default:
			content = english;
	}

	const timeOptions = [
		{ display: content.last_30_days, value: "30" },
		{ display: content.last_6_months, value: "183" },
		{ display: content.last_year, value: "365" },
		{ display: content.last_5_years, value: "1825" },
		{ display: content.all_time, value: "all" },
	];

	const extentOptions = [
		{ display: content.city_block, value: "330" },
		{ display: content.couple_blocks, value: "660" },
		{ display: content.quarter_mile, value: "1320" },
		{ display: content.half_mile, value: "2640" },
		{ display: content.mile, value: "5280" },
	];

	const getNewUrlParams = () => ({
		within: document.getElementById("extent").value,
		during: document.getElementById("time").value,
	});

	const duringURL =
		props.location.query.during === "" || props.location.query.during === undefined
			? "183"
			: props.location.query.during;
	const withinURL =
		props.location.query.within === "" || props.location.query.within === undefined
			? "660"
			: props.location.query.within;

	const before = moment.utc().format("YYYY-MM-DD");
	let after = "1970-01-01"; // appears crime only goes back to 2013
	if (duringURL !== "all") {
		after = moment
			.utc()
			.subtract(parseInt(duringURL, 10) + 1, "d")
			.format("YYYY-MM-DD");
	}

	return (
		<div>
			<div className="mb-8 mt-5 px-2 flex items-center">
				<span className="text-coa-blue-medium pr-2">{<Icon ariaHidden={true} path={IM_SHIELD3} size={35} />}</span>
				<h1 className="text-coa-blue-medium">
					<span className="text-4xl">{content.crime}</span>
				</h1>
				<a
					className="mx-2 px-2 rounded py-[1px] bg-info text-white flex items-center"
					href="https://ashevillepd.policetocitizen.com/Home"
					target="_blank"
				>
					{<Icon ariaHidden={true} path={IM_LIBRARY2} size={16} />}
					<span className="pl-2">{content.view_apd_reports}</span>
				</a>
				<button className="btn btn-primary ml-auto" onClick={browserHistory.goBack}>
					{content.back}
				</button>
			</div>
			<form className="border p-4 rounded">
				<fieldset className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					<div className=" flex flex-col">
						<label htmlFor="topicType" className="font-normal">
							{content.view}:
						</label>
						<div className="block">{content.crimes.toLowerCase()}</div>
					</div>

					<div className="w-full flex flex-col">
						<label htmlFor="time" className="font-normal">
							{content.during}:
						</label>
						<select
							value={duringURL}
							onChange={() => refreshLocation(getNewUrlParams(), props.location)}
							name="time"
							id="time"
							className="border-2 rounded px-4 py-3"
						>
							{timeOptions.map((option, i) => (
								<option value={option.value} key={["time", "option", i].join("_")} name="time">
									{option.display}
								</option>
							))}
						</select>
					</div>

					<div
						className={`w-full flex flex-col ${
							props.location.query.entity === "street" || props.location.query.entity === "neighborhood" ? "hidden" : ""
						}`}
					>
						<label htmlFor="extent" className="font-normal">
							{content.within}:
						</label>
						<select
							value={withinURL}
							onChange={() => refreshLocation(getNewUrlParams(), props.location)}
							name="extent"
							id="extent"
							className="border-2 rounded px-4 py-3"
						>
							{extentOptions.map((option, i) => (
								<option value={option.value} key={["extent", "option", i].join("_")} name="extent">
									{option.display}
								</option>
							))}
						</select>
					</div>

					<SpatialEventTopicLocationInfo
						spatialType={props.location.query.entity}
						spatialDescription={props.location.query.label}
					/>
				</fieldset>
			</form>
			{props.location.query.entity === "address" ? ( // eslint-disable-line
				<CrimesByAddress before={before} after={after} radius={withinURL} location={props.location} />
			) : props.location.query.entity === "street" ? (
				<CrimesByStreet before={before} after={after} radius={110} location={props.location} />
			) : (
				<CrimesByNeighborhood before={before} after={after} location={props.location} />
			)}
		</div>
	);
};

export default withLanguage(CrimeSummary);
