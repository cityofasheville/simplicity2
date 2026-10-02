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

function Alert({ children, type = "info", className = "", ...props }) {
	const alertClassName = [
		"p-4",
		"rounded",
		"shadow",
		"w-full",
		"my-6",
		"mx-auto",
		"border-2",
		BORDER_CLASSES[type],
		"flex",
		"items-center",
		"gap-4",
		className,
	]
		.filter(Boolean)
		.join(" ");

	return (
		<div className={alertClassName} {...props}>
			<Icon ariaHidden="true" path={INFO_CIRCLE} size={24} color={ICON_COLORS[type]} /> {children}
		</div>
	);
}

export default Alert;
