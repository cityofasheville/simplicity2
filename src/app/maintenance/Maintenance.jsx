import React from "react";
import { Link } from "react-router";
import MaintenanceByStreet from "./MaintenanceByStreet";
import ButtonGroup from "../../shared/ButtonGroup";
import Button from "../../shared/Button";
import LinkButton from "../../shared/LinkButton";
import PageHeader from "../../shared/PageHeader";
import Icon from "../../shared/Icon";
import { IM_TRAFFIC_CONE } from "../../shared/iconConstants";
import { refreshLocation } from "../../utilities/generalUtilities";

const getSubtitle = (entity) => {
	switch (entity) {
		case "street":
			return "Maintenance along this street";
		default:
			return "Maintenance";
	}
};

function Maintenance(props) {
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
				icon={<Icon ariaHidden={true} path={IM_TRAFFIC_CONE} size={50} />}
			>
				<Link
					className="btn btn-primary ml-auto"
					to={{
						pathname: "/street",
						query: {
							entities: props.location.query.entities,
							search: props.location.query.search,
							hideNavbar: props.location.query.hideNavbar,
							entity: props.location.query.entity,
							id: props.location.query.id,
							label: props.location.query.label,
						},
					}}
				>
					Back to {props.location.query.entity}
				</Link>
			</PageHeader>
			<div className="flex">
				<div className="btn-group ml-auto">
					<button
						className="btn btn-primary"
						onClick={() => refreshLocation(getNewUrlParams("map"), props.location)}
						active={props.location.query.view === "map"}
						aria-selected={props.location.query.view === "map"}
					>
						Map view
					</button>
					<button
						className="btn btn-primary"
						onClick={() => refreshLocation(getNewUrlParams("list"), props.location)}
						active={props.location.query.view === "list"}
						aria-selected={props.location.query.view === "list"}
					>
						List view
					</button>
					{/* <Button 
              onClick={() => refreshLocation(getNewUrlParams('map'), props.location)} active={props.location.query.view !== 'list'} positionInGroup="left">Map view</Button>
            <Button onClick={() => refreshLocation(getNewUrlParams('list'), props.location)} active={props.location.query.view === 'list'} positionInGroup="right">List view</Button> */}
				</div>
			</div>
			{props.location.query.entity === "street" ? (
				<MaintenanceByStreet {...props} />
			) : (
				<span>No information available</span>
			)}
		</div>
	);
}

export default Maintenance;
