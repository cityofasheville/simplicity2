import React from "react";
import Alert from "../alert";

const NotFound = () => (
	<Alert type="info" className="max-w-3xl">
		<div>
			Page not found. Please verify the URL and try again. If you believe this is an error, you may report issues using{" "}
			<a
				href="https://docs.google.com/a/ashevillenc.gov/forms/d/e/1FAIpQLSdjNwOmoDY3PjQOVreeSL07zgI8otIIPWjY7BnejWMAjci8-w/viewform?c=0&w=1"
				target="_blank"
			>
				this form
			</a>
			.
		</div>
	</Alert>
);

export default NotFound;
