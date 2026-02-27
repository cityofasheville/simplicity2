import React from "react";

function Banner({ children, message = "Default banner message", path = "*" }) {
	let defaultLeftMargin = 0;
	let showBanner = false;

	if (path === "*") {
		showBanner = true;
	} else {
		if (window.location.pathname === path) {
			showBanner = true;
		}
	}

	if (!showBanner) {
		return null;
	}

	if (window.location.href.indexOf("development/major") > -1) {
		defaultLeftMargin = 200;
	}

	return (
		<div role={"alert"} className="bg-warning mt-8 p-4 text-black border border-slate rounded">
			<>{children}</>
		</div>
	);
}

export default Banner;
