import React from "react";
import PropTypes from "prop-types";
import { refreshLocation } from "../utilities/generalUtilities";

/**
 * The toolbar row that sits above a map/list view container: an optional
 * download control on the left, the map/list toggle pushed to the right.
 *
 * Both controls have to be siblings in this flex row. `.btn` is `display: flex`,
 * so a download button rendered on its own becomes block-level and stretches to
 * full width on its own row.
 *
 * Stacks on narrow screens and sits on one line from `md` up.
 */
const ViewToolbar = (props) => (
	<div className="flex flex-col items-start gap-4 w-full my-3 md:flex-row md:items-center md:gap-0">
		{props.children && <div>{props.children}</div>}
		<div className="btn-group max-w-full md:items-center md:shrink-0 md:ml-auto" role="group" aria-label={props.label}>
			<button
				aria-controls={props.controls}
				className="btn btn-toggle"
				onClick={() => refreshLocation({ view: "map" }, props.location)}
				aria-pressed={props.location.query.view === "map"}
			>
				{props.mapLabel}
			</button>
			<button
				aria-controls={props.controls}
				className="btn btn-toggle"
				onClick={() => refreshLocation({ view: "list" }, props.location)}
				aria-pressed={props.location.query.view === "list"}
			>
				{props.listLabel}
			</button>
		</div>
	</div>
);

ViewToolbar.propTypes = {
	location: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
	children: PropTypes.node,
	controls: PropTypes.string,
	label: PropTypes.string,
	mapLabel: PropTypes.node,
	listLabel: PropTypes.node,
};

ViewToolbar.defaultProps = {
	children: null,
	controls: "view-container",
	label: "Choose a view",
	mapLabel: "Map view",
	listLabel: "List view",
};

export default ViewToolbar;
