import React from "react";
import { Link } from "react-router";
import ButtonGroup from "../../shared/ButtonGroup";
// import Button from '../../shared/Button';
import LinkButton from "../../shared/LinkButton";
import PageHeader from "../../shared/PageHeader";
import PropertiesByStreet from "./PropertiesByStreet";
import PropertiesByNeighborhood from "./PropertiesByNeighborhood";
import Icon from "../../shared/Icon";
import { IM_HOME2 } from "../../shared/iconConstants";
// import { refreshLocation } from '../../utilities/generalUtilities';

const getSubtitle = (entity) => {
	switch (entity) {
		case "street":
			return "Properties along this street";
		case "neighborhood":
			return "Properties in this neighborhood";
		default:
			return "Properties";
	}
};

function Properties(props) {
	const getNewUrlParams = (view) => ({
		view,
	});

	const searchParams = new URLSearchParams(window.location.search);
	const currentView = searchParams.get("view");
	searchParams.set("view", "map");
	const searchParamsMap = searchParams.toString();
	searchParams.set("view", "list");
	const searchParamsList = searchParams.toString();

	return (
		<div>
			<PageHeader
				h1={searchParams.get("label")}
				h2={getSubtitle(searchParams.get("entity"))}
				icon={<Icon ariaHidden={true} path={IM_HOME2} size={50} />}
			>
				<div className="btn-group ml-auto">
					<Link
						className="btn btn-primary"
						to={{
							pathname: searchParams.get("entity") === "neighborhood" ? "/neighborhood" : "/street",
							query: {
								entities: props.location.query.entities,
								search: props.location.query.search,
								hideNavbar: props.location.query.hideNavbar,
								entity: props.location.query.entity,
								id: props.location.query.id,
								label: props.location.query.label,
							},
						}}
						onClick={props.onClick}
						disabled={props.disabled}
						pathname={searchParams.get("entity") === "neighborhood" ? "/neighborhood" : "/street"}
						query={{
							entities: props.location.query.entities,
							search: props.location.query.search,
							hideNavbar: props.location.query.hideNavbar,
							entity: props.location.query.entity,
							id: props.location.query.id,
							label: props.location.query.label,
						}}
					>
						Back to {searchParams.get("entity")}
					</Link>
				</div>
			</PageHeader>
			<div className="flex">
				<div className="ml-auto">
					<div className="btn-group">
						<Link
							className={`btn btn-primary ${currentView !== "map" ? "active" : ""}`}
							to={window.location.pathname + "?" + searchParamsList}
						>
							List view
						</Link>
						<Link
							className={`btn btn-primary ${currentView === "map" ? "active" : ""}`}
							to={window.location.pathname + "?" + searchParamsMap}
						>
							Map view
						</Link>
					</div>
				</div>
			</div>
			{searchParams.get("entity") === "street" ? (
				<PropertiesByStreet {...props} />
			) : (
				<PropertiesByNeighborhood {...props} />
			)}
		</div>
	);
}

export default Properties;
