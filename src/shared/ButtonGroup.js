import React from "react";
import PropTypes from "prop-types";

function ButtonGroup(props) {
	let aligning = "";
	if (props.alignment === "left") {
		aligning = "mr-auto";
	} else if (props.alignment === "right") {
		aligning = "ml-auto";
	}

	return (
		<div className={aligning} style={props.style}>
			{props.children}
		</div>
	);
}

ButtonGroup.propTypes = {
	children: PropTypes.node,
	alignment: PropTypes.string,
	style: PropTypes.object, // eslint-disable-line
};

ButtonGroup.defaultProps = {
	// alignment: 'right',
};

export default ButtonGroup;
