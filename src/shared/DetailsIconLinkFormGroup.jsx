import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";

const DetailsIconLinkFormGroup = (props) => (
	<div>
		{props.inWindow ? (
			<Link className="btn btn-primary btn-small block text-center" to={props.href} title={props.title}>
				<span>
					{props.icon}&nbsp;{props.label}
				</span>
			</Link>
		) : (
			<a className="btn btn-primary btn-small block text-center" href={props.href} title={props.title} target="_blank">
				<span>
					{props.icon}&nbsp;{props.label}
				</span>
			</a>
		)}
	</div>
);

DetailsIconLinkFormGroup.propTypes = {
	label: PropTypes.string,
	icon: PropTypes.node,
	href: PropTypes.string,
	title: PropTypes.string,
	inWindow: PropTypes.bool,
	colWidth: PropTypes.string,
};

DetailsIconLinkFormGroup.defaultProps = {
	label: "",
	icon: <span></span>,
	href: "www.ashevillenc.gov",
	title: "City of Asheville Website",
	inWindow: false,
	colWidth: "12",
};

export default DetailsIconLinkFormGroup;
