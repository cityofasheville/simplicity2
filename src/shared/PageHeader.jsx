import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";

// change heading levels
function PageHeader(props) {
	return (
		<section>
			{props.image && (
				<img alt={props.imageAlt} src={props.image} style={{ width: "100px", float: "left", marginRight: "10px" }} />
			)}

			<div className="text-coa-blue-medium flex items-start gap-2  mt-5 mb-4">
				{props.icon && <span aria-hidden="true">{props.icon}</span>}
				<h1 className="flex flex-col text-left">
					<span className="text-3xl">{props.h2}</span>
					{props.dataType && <span className="text-base text-gray-500">{props.dataType}</span>}
				</h1>
			</div>

			<div className="flex px-4 pb-4 pt-2">
				<div>{props.children}</div>

				{/* {(props.externalLink || props.dataLinkPath) && (
					<div className="template-header__subnav">
						{props.externalLink && (
							<div>
								<a href={props.externalLink} target="_blank">
									{props.externalLinkText}
								</a>
							</div>
						)}
						{props.dataLinkPath && (
							<div>
								<Link to={{ pathname: props.dataLinkPath }}>{props.dataLinkText}</Link>
							</div>
						)}
					</div>
				)} */}
				{props.h2 !== null && <h3 className="text-3xl text-coa-blue-medium ml-auto">{props.h3}</h3>}
				{props.h3 !== null && <h4>{props.h4}</h4>}
				{props.subheading !== null && props.subheading}
			</div>
		</section>
	);
}

PageHeader.propTypes = {
	children: PropTypes.node,
	h1: PropTypes.string,
	h2: PropTypes.string,
	h3: PropTypes.string,
	dataType: PropTypes.string,
	externalLink: PropTypes.string,
	externalLinkText: PropTypes.string,
	dataLinkPath: PropTypes.string,
	dataLinkText: PropTypes.string,
	image: PropTypes.string,
	imageAlt: PropTypes.string,
	icon: PropTypes.node,
};

PageHeader.defaultProps = {
	h2: null,
	h3: null,
	dataLinkText: "Understand this data",
};

export default PageHeader;
