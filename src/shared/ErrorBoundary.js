import React from "react";
import Alert from "../alert";

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error) {
		// Update state so the next render will show the fallback UI.
		return { hasError: true };
	}

	componentDidCatch(error, info) {
		// You can also log the error to an error reporting service
		console.log(error, info);
	}

	render() {
		if (this.state.hasError) {
			// You can render any custom fallback UI
			// return <p className="text-danger">Oops, something went wrong!  Try refreshing the page.  If you tried that and it did not work, please email help@ashevillenc.gov.</p>;
			return (
				<Alert type="danger" className="max-w-3xl">
					<div>
						Oops, something went wrong! Please try refreshing the page, or you may report issues using{" "}
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
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
