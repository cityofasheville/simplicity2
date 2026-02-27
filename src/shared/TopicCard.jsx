import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import Icon from "./Icon";
import { TopicCardAccessible } from "./TopicCardAccessible";
import {
	IM_SHIELD3,
	IM_COIN_DOLLAR,
	IM_OFFICE,
	IM_CITY,
	IM_BED,
	IM_LIBRARY2,
	IM_ENVELOP3,
	IM_TREE,
} from "./iconConstants";
import { withLanguage } from "../utilities/lang/LanguageContext";

const getTopicIcon = (topic, ariaHidden) => {
	switch (topic) {
		case "CRIME":
			return <Icon ariaHidden={ariaHidden} path={IM_SHIELD3} size={40} />;
		case "DEVELOPMENT_WEBSITE":
			return <Icon ariaHidden={ariaHidden} path={IM_CITY} size={40} />;
		case "DEVELOPMENT_DASHBOARD":
			return <Icon ariaHidden={ariaHidden} path={IM_OFFICE} size={40} />;
		case "DEVELOPMENT_NOTIFICATION":
			return <Icon ariaHidden={ariaHidden} path={IM_ENVELOP3} size={40} />;
		case "BUDGET":
			return <Icon ariaHidden={ariaHidden} path={IM_COIN_DOLLAR} size={40} />;
		case "HOMELESSNESS":
			return <Icon ariaHidden={ariaHidden} path={IM_BED} size={40} />;
		case "CAPITAL_PROJECTS":
			return <Icon ariaHidden={ariaHidden} path={IM_CITY} size={40} />;
		case "CLIMATE":
			return <Icon ariaHidden={ariaHidden} path={IM_TREE} size={40} />;
		default:
			return <Icon ariaHidden={ariaHidden} path={IM_LIBRARY2} size={40} />;
	}
};

const spanish = {
	CRIME: ["", "CRIMEN"],
	DEVELOPMENT_WEBSITE: ["DEVELOPMENT_DEPARTMENT_WEBSITE", "Learn more or apply for a permit"],
	DEVELOPMENT_DASHBOARD: ["DEVELOPMENT_SERVICES", "View Building Permits and get Email Notifications"],
	DEVELOPMENT_NOTIFICATION: ["DEVELOPMENT_NOTIFICATION", "Recieve Emails about Development Permits"],
	DEVELOPMENT: ["", "URBANIZACI\xD3N"],
	BUDGET: ["", "PRESUPUESTO"],
	HOMELESSNESS: ["", "FALTA DE VIVIENDA"],
	CAPITAL_PROJECTS: ["", "PROYECTOS_CAPITALES"],
	CLIMATE: ["", "Climate Threats and Vulnerability"],
};

const english = {
	CRIME: ["", "CRIME"],
	DEVELOPMENT_WEBSITE: ["DEVELOPMENT_DEPARTMENT_WEBSITE", "Learn more or apply for a permit"],
	DEVELOPMENT_DASHBOARD: ["MAJOR_DEVELOPMENT", "Learn about the large-scale development process in Asheville"],
	DEVELOPMENT_NOTIFICATION: ["GET NOTIFICATIONS", "Recieve Emails about Development Permits"],
	DEVELOPMENT: ["", "DEVELOPMENT"],
	BUDGET: ["", "BUDGET"],
	HOMELESSNESS: ["", "HOMELESSNESS"],
	CAPITAL_PROJECTS: [
		"CAPITAL_PROJECTS",
		"Explore projects related to Bond initiatives, Helene recovery, and the Capital Improvement Program",
	],
	CLIMATE: ["CLIMATE", "Climate Threats and Vulnerability"],
};

const translateTopic = (topic, language) => {
	switch (language) {
		case "Spanish":
			return spanish[topic];
		case "English":
			return english[topic];
		default:
			return english[topic];
	}
};

const TopicCard = (props) => {
	React.useEffect(TopicCardAccessible, []);
	const query = {};
	const queryPossiblies = ["view", "entity", "id", "label", "entities", "x", "y", "search"];
	queryPossiblies.forEach((possibility) => {
		if (props[possibility]) {
			query[possibility] = props[possibility];
		}
	});

	let target = "_self";
	if (props.path && props.path.substring(0, 4) === "http") {
		target = "_blank";
	}
	const topics = translateTopic(props.topic, props.language.language);
	const ariaHidden = true;

	return (
		<div className="card-clickable shadow rounded cursor-pointer bg-gray-50 px-4 py-8 flex flex-col items-stretch min-h-full border border-coa-blue-light hocus:outline hocus:outline-1 hocus:outline-coa-blue-medium">
			<div className="text-coa-blue-medium font-normal text-2xl text-center capitalize">
				{topics[0].replace(/_/g, " ").toLowerCase()}
			</div>
			<div className="text-coa-blue-medium text-center my-4">
				<span>{getTopicIcon(props.topic, ariaHidden)}</span>
			</div>
			<Link
				className="topic-card card-link-action no-underline hocus:underline focus:outline-none text-lg text-coa-blue-medium m-0 p-0"
				to={{
					pathname: props.path || props.topic,
					query,
				}}
				target={target}
			>
				<div className="text-coa-blue-medium text-center">{topics[1].replace(/_/g, " ")}</div>
			</Link>
		</div>
	);
};

TopicCard.propTypes = {
	topic: PropTypes.string,
	entity: PropTypes.string,
	search: PropTypes.string,
	id: PropTypes.string,
	label: PropTypes.string,
	entities: PropTypes.string,
	x: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	y: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

TopicCard.defaultProps = {
	view: "list",
	// topic: 'CRIME',
	// entity: 'city',
	// search: null,
	// id: null,
	// label: null,
	// entities: 'address,property,neighborhood,street,owner',
	// x: null,
	// y: null,
};

export default withLanguage(TopicCard);
