import React from "react";
import PropTypes from "prop-types";
import ErrorBoundary from "./ErrorBoundary";

class AccordionPanel extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: props.initiallyExpanded || false,
		};
	}

	render() {
		const panelHeadingId = `accordion-heading-${this.props.index}`;
		const collapsibleId = `${this.props.linkId}`;

		return (
			<div className="border-2 border-gray-100">
				<div className={`panel${this.state.open ? " open" : ""}`}>
					<a
						role="button"
						className=""
						data-toggle="collapse"
						data-parent={`#${this.props.componentId}`}
						href={`#${collapsibleId}`}
						aria-expanded={this.state.open}
						aria-controls={collapsibleId}
						onClick={(e) => {
							e.preventDefault();
							this.setState({ open: !this.state.open }, () =>
								this.props.onPanelHeaderClick ? this.props.onPanelHeaderClick(this.props.data, this.state.open) : null
							);
						}}
					>
						<div className="panel-heading   bg-gray-100 py-3 px-3 text-black" role="tab" id={panelHeadingId}>
							<div className="panel-title flex items-center justify-between w-full">
								<span>{this.props.header}</span>

								<svg
									className={`w-5 h-5 transform transition-transform duration-200 ${
										this.state.open ? "rotate-180" : "rotate-0"
									}`}
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
								</svg>
							</div>
						</div>
					</a>
					<div
						id={collapsibleId}
						className={`panel-collapse p-4 ${this.state.open ? "block" : "hidden"}`}
						role="tabpanel"
						aria-labelledby={panelHeadingId}
					>
						<div className={`accordion-panel-body ${this.props.inheritedClasses}  h-full w-full`}>
							{this.state.open && this.props.body}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const Accordion = ({ classes = "", componentId, data, onPanelHeaderClick = null }) => (
	<ErrorBoundary>
		<div
			className={`panel-group ${classes} accordion-root flex flex-col gap-1`}
			id={componentId}
			role="tablist"
			aria-multiselectable="true"
		>
			{/* https://getbootstrap.com/docs/3.4/javascript/#collapse */}
			{data.map((d, i) => (
				<ErrorBoundary key={`accordion-item-${i}`}>
					<AccordionPanel
						index={i}
						header={d.header}
						body={d.body}
						initiallyExpanded={d.selected}
						componentId={componentId}
						inheritedClasses={classes}
						onPanelHeaderClick={onPanelHeaderClick}
						data={d}
						linkId={d.linkId}
					/>
				</ErrorBoundary>
			))}
		</div>
	</ErrorBoundary>
);

export default Accordion;
