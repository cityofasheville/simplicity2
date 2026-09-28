import React, { useMemo } from "react";

const crimeMarkerMap = {
	User: ["Runaway Juvenile"],
	Hammer: ["Damage to Personal Property", "Vandalism"],
	Ambulance: ["Assault - Simple", "Assault on Female", "Assault W/Deadly Weapon"],
	Bubble: ["Communicating Threat"],
	Library2: ["Intimidating State Witness", "Perjury", "Obstruction of Justice"],
	Profile: ["Fraud", "Fraud-Credit Card", "False Pretense - Obtain Property By", "Impersonate"],
	Gun: ["Carrying Concealed Weapon"],
	Shield3: [
		"Resist, Delay, Obstruct Officer",
		"CIT Incident",
		"DV Assistance Other",
		"Victim Assistance Other",
		"Assault on Government Official",
	],
	Car: ["DWI", "Unauthorized Use of Motor Vehicle", "Larceny of MV Other", "Larceny of MV Auto", "Larceny of MV Truck"],
	Fence: ["Trespass"],
	Pencil7: ["Information Only"],
	AidKit2: [
		"Drug Paraphernalia Possess",
		"Drug Offense - Felony",
		"Drug Offense - Misdemeanor",
		"Drug Paraphernalia Other",
	],
	BillDollar: ["Counterfeiting-Buying/Receiving"],
	Dollar: [
		"Larceny All Other",
		"Larceny from Building",
		"Larceny from Motor Vehicle",
		"Robbery - Common Law",
		"Robbery - Armed - Knife",
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

const maintenanceMarkerMap = [
	{ label: "NCDOT", color: "#506aed" },
	{ label: "City of Asheville", color: "#6fe8cb" },
	{ label: "Multiple", color: "#DB6D00" },
	{ label: "No Information Available", color: "#f95eff" },
];

function formatList(items) {
	if (items.length === 0) return "";
	if (items.length === 1) return items[0];
	if (items.length === 2) return `${items[0]} or ${items[1]}`;

	return `${items.slice(0, -1).join(", ")}, or ${items.at(-1)}`;
}

function getIconItems(mapData) {
	return Object.entries(mapData).map(([iconName, types]) => ({
		key: iconName,
		label: formatList(types),
		icon: iconName,
	}));
}

function getColorItems(mapData) {
	return mapData.map((item) => ({ key: item.label, ...item }));
}

function getLegendItems(type) {
	if (type === "crime") return getIconItems(crimeMarkerMap);
	if (type === "maintenance") return getColorItems(maintenanceMarkerMap);
	return getIconItems(developmentMarkerMap);
}

function MapLegend({ type, openState = false }) {
	const legendItems = getLegendItems(type);

	return (
		<details className="bg-coa-blue-medium" open={openState}>
			{" "}
			<summary className="list-none flex align-middle justify-between py-2 px-5 cursor-pointer">
				{" "}
				<div className="mr-1">
					<span className="text-white">Map Legend</span>
				</div>
				<div className="flex items-center">
					<span className="bi bi-chevron-down justify-self-end text-l text-white" aria-hidden="true"></span>
				</div>
			</summary>
			<div className="columns-1 sm:columns-3 lg:columns-4 gap-6 border-x-2 border-b-2 border-coa-blue-medium bg-white">
				{legendItems.map(({ key, label, icon, color }) => (
					<div key={`legendItem-${key}`} className="flex flex-row items-start break-inside-avoid py-2 mx-2">
						{icon ? (
							<img
								alt={`${icon} Icon`}
								src={require(`../images/${icon}.png`)}
								className="w-6 align-top mr-2 shrink-0"
							/>
						) : (
							<span
								aria-label={`${label} color`}
								className="inline-block rounded-full mr-2 mt-1 shrink-0"
								style={{ width: "14px", height: "14px", backgroundColor: color, border: "1px solid #666" }}
							/>
						)}
						<span className="text-sm">{label}</span>
					</div>
				))}
			</div>
			<span></span>
		</details>
	);
}

export default MapLegend;
