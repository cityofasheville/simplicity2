import React from "react";
import PropTypes from "prop-types";

const DetailsFormGroup = (props) => (
	// <div className={props.icon ?
	//   'form-group form-group--has-content form-group--has-icon' :
	//   (props.fullWidth ? 'form-group form-group--has-content full-width-card' : 'form-group form-group--has-content')}>
	<div className="px-4 pb-4">
		<div className="p-4 bg-gray-200 h-full">
			<h4 className="pb-4 mb-2 border-b-2 border-gray-300 flex items-baseline">
				{props.icon !== null && (
					<span className="mr-2" aria-hidden="true">
						{props.icon}
					</span>
				)}
				{props.hasLabel && <span htmlFor={props.name}>{props.label}</span>}
			</h4>
			<div className="font-normal" name={props.name}>
				{props.value}
			</div>
		</div>
	</div>
);

DetailsFormGroup.propTypes = {
	hasLabel: PropTypes.bool,
	label: PropTypes.string,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
	icon: PropTypes.node,
	name: PropTypes.string,
	// colWidth: PropTypes.string,
};

DetailsFormGroup.defaultProps = {
	hasIcon: false,
	hasLabel: false,
	label: "",
	value: "",
	icon: null,
	name: "",
	// colWidth: '12',
};

export default DetailsFormGroup;
