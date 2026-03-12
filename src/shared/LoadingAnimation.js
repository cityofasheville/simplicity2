import React from "react";
import PropTypes from "prop-types";

const LoadingAnimation = (props) => {
	return (
		<div className="flex flex-col items-center">
			<div class="h-16 w-16 animate-spin rounded-full border-b-4 border-current text-coa-blue-medium mt-8" />
			<div className="mt-8">{props.message}</div>
		</div>
	);
};

LoadingAnimation.propTypes = {
	size: PropTypes.string,
	message: PropTypes.string,
	marginTop: PropTypes.string,
};

LoadingAnimation.defaultProps = {
	name: "large",
	message: "Loading...",
};

export default LoadingAnimation;
