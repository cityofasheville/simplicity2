import { group } from "d3-array";
import React, { useState } from "react";

const crimeMarkerMap = {
	User: ["RUNAWAY JUVENILE"],
	Hammer: ["DAMAGE TO PERSONAL PROPERTY", "VANDALISM"],
	Ambulance: ["ASSAULT - SIMPLE", "ASSAULT ON FEMALE", "ASSAULT W/DEADLY WEAPON"],
	Bubble: ["COMMUNICATING THREAT"],
	Library2: ["INTIMIDATING STATE WITNESS", "PERJURY", "OBSTRUCTION OF JUSTICE"],
	Profile: ["FRAUD", "FRAUD-CREDIT CARD", "FALSE PRETENSE - OBTAIN PROPERTY BY", "IMPERSONATE"],
	Gun: ["CARRYING CONCEALED WEAPON"],
	Shield3: [
		"RESIST, DELAY, OBSTRUCT OFFICER",
		"CIT INCIDENT",
		"DV ASSISTANCE OTHER",
		"VICTIM ASSISTANCE OTHER",
		"ASSAULT ON GOVERNMENT OFFICIAL",
	],
	Car: ["DWI", "UNAUTHORIZED USE OF MOTOR VEHICLE", "LARCENY OF MV OTHER", "LARCENY OF MV AUTO", "LARCENY OF MV TRUCK"],
	Fence: ["TRESPASS"],
	Pencil7: ["INFORMATION ONLY"],
	AidKit2: [
		"DRUG PARAPHERNALIA POSSESS",
		"DRUG OFFENSE - FELONY",
		"DRUG OFFENSE - MISDEMEANOR",
		"DRUG PARAPHERNALIA OTHER",
	],
	BillDollar: ["COUNTERFEITING-BUYING/RECEIVING"],
	Dollar: [
		"LARCENY ALL OTHER",
		"LARCENY FROM BUILDING",
		"LARCENY FROM MOTOR VEHICLE",
		"ROBBERY - COMMON LAW",
		"ROBBERY - ARMED - KNIFE",
	],
	Ellipsis: ["Other"],
};

const developmentMarkerMap = {
	Office: ["Commercial"],
	Fire: ["Fire"],
	Home2: ["Residential"],
	Direction: ["Sign"],
	Users4: ["Event-Temporary Use"],
	Library2: ["Historical"],
	Mug: ["Over The Counter"],
	Cook: ["Outdoor Vendor"],
	City: ["Development"],
	Ellipsis: ["Other"],
};

const formatList = (items) => {
	if (items.length === 0) return "";
	if (items.length === 1) return items[0];
	if (items.length === 2) return `${items[0]} or ${items[1]}`;

	return `${items.slice(0, -1).join(", ")}, or ${items.at(-1)}`;
};

const getLegendGroups = (type) => {
	let map;
	if (type == "crime") {
		map = crimeMarkerMap;
	} else {
		// default to crime map for now
		map = developmentMarkerMap;
	}
	const groups = {};

	Object.entries(map).forEach(([iconName, types]) => {
		groups[iconName] = formatList(types);
	});

	return groups;
};

function MapLegend({ type }) {
	const legendGroups = getLegendGroups(type);
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="bg-coa-blue-medium">
			<button className="py-2 px-3 w-full h-full" onClick={() => setIsOpen((prev) => !prev)}>
				<span className="text-white">Map Legend</span>
			</button>
			{isOpen && (
				<div className="columns-3 gap-6 border-2 border-coa-blue-medium bg-white p-2">
					{Object.entries(legendGroups).map(([iconName, types]) => (
						<div key={`legendItem-${iconName}`} className="flex flex-row items-start break-inside-avoid my-1">
							<img
								alt="crime icon"
								src={iconName === "Other" ? require("../images/Ellipsis.png") : require(`../images/${iconName}.png`)}
								className=" w-6 align-top mr-2"
							/>
							<span className="text-sm">{iconName === "Other" ? "Other" : types}</span>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export default MapLegend;
