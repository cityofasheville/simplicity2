import React from "react";
import { INFO_CIRCLE } from "./shared/iconConstants";
import Icon from "./shared/Icon";

const BORDER_CLASSES = {
	success: "border-success",
	info: "border-info",
	warning: "border-warning",
	danger: "border-danger",
};

const ICON_COLORS = {
	success: "#11866f",
	info: "#004987",
	warning: "#f39c12",
	danger: "#e74c3c",
};

function Alert({ children, type = "info" }) {
	return (
		<div
			className={`p-4 rounded shadow w-full max-w-3xl my-6 mx-auto border-2 ${BORDER_CLASSES[type]} flex items-center gap-4`}
		>
			<Icon ariaHidden="true" path={INFO_CIRCLE} size={24} color={ICON_COLORS[type]} /> {children}
		</div>
	);
}

export default Alert;
