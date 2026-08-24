import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import Alert from "../alert";

const Error = (props) => (
	<Alert type="danger">
		<div>
			<p>
				There was an error retrieving this data. You may report issues using{" "}
				<a
					href="https://docs.google.com/a/ashevillenc.gov/forms/d/e/1FAIpQLSdjNwOmoDY3PjQOVreeSL07zgI8otIIPWjY7BnejWMAjci8-w/viewform?c=0&w=1"
					target="_blank"
				>
					this form
				</a>
				.
			</p>
			<p>Time: {moment().format("M/DD/YYYY HH:mm:ss Z")} UTC</p>
			<p>
				<span>Error details: </span>
				{props.message}
			</p>
		</div>
	</Alert>
);

Error.propTypes = {
	message: PropTypes.string,
};

export default Error;
