import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import AddressesByStreet from "./AddressesByStreet";
import AddressesByNeighborhood from "./AddressesByNeighborhood";
import ButtonGroup from "../../shared/ButtonGroup";
import Button from "../../shared/Button";
import LinkButton from "../../shared/LinkButton";
import PageHeader from "../../shared/PageHeader";
import Icon from "../../shared/Icon";
import { IM_ENVELOP3 } from "../../shared/iconConstants";
import { refreshLocation } from "../../utilities/generalUtilities";
import { english } from "./english";
import { spanish } from "./spanish";
import { withLanguage } from "../../utilities/lang/LanguageContext";

function AddressList(props) {
	let content;
	switch (props.language.language) {
		case "Spanish":
			content = spanish;
			break;
		default:
			content = english;
	}

	const getNewUrlParams = (view) => ({
		view,
	});

	const searchParams = new URLSearchParams(window.location.search);
	const currentView = searchParams.get("view");
	searchParams.set("view", "map");
	const searchParamsMap = searchParams.toString();
	searchParams.set("view", "list");
	const searchParamsList = searchParams.toString();

	const streetPathname = searchParams.get("entity") === "neighborhood" ? "/neighborhood" : "/street";

	const streetSearch = new URLSearchParams(props.location.query).toString();

	return (
		<div>
			<PageHeader
				h1={searchParams.get("label")}
				h2={content.address_and_owner_mailing_lists}
				icon={<Icon path={IM_ENVELOP3} size={50} />}
			>
				<Link className="btn btn-primary ml-auto" to={`${streetPathname}?${streetSearch}`}>
					{searchParams.get("entity") === "street" ? content.back_to_street : content.back_to_neighborhood}
				</Link>
			</PageHeader>
			<div className="flex">
				<div className="btn-group ml-auto">
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
			{searchParams.get("entity") === "street" ? (
				<AddressesByStreet {...props} />
			) : (
				<AddressesByNeighborhood {...props} />
			)}
		</div>
	);
}

AddressList.propTypes = {
	location: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

export default withLanguage(AddressList);
