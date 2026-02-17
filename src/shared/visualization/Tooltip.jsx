import React from "react";
import PropTypes from "prop-types";

const Tooltip = (props) => {
	return (
		<span>
			<div className="align-text-center">{props.title}</div>
			{props.textLines.map((lineObj, i) => (
				<div key={`textLine-${i}`} className="bg-white border border-gray-300 rounded px-4 py-2">
					{lineObj.text}
				</div>
			))}
		</span>
	);
};

Tooltip.propTypes = {
	textLines: PropTypes.arrayOf(PropTypes.object),
	title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Tooltip.defaultProps = {
	textLines: [],
	title: "",
};

export default Tooltip;
