import React from "react";
// import PropTypes from 'prop-types';
import { timeDay, timeMonth } from "d3-time";
import PermitsTableWrapper from "../permits/PermitsTableWrapper";
import TimeSlider from "../volume/TimeSlider";
import ErrorBoundary from "../../../shared/ErrorBoundary";
import { trcProjectTypes } from "./textContent";

class TRCDataTable extends React.Component {
	constructor() {
		super();
		const now = timeDay.floor(new Date());
		this.initialBrushExtent = [timeMonth.offset(now, -2).getTime(), now.getTime()];
		this.state = {
			timeSpan: this.initialBrushExtent,
		};
	}

	render() {
		return (
			<div>
				<TimeSlider
					onBrushEnd={(newExtent) =>
						this.setState({
							timeSpan: newExtent,
						})
					}
					defaultBrushExtent={this.initialBrushExtent}
					xSpan={2}
					tickMeasure="month"
				/>
				{/* resetKeys: if a query for one date range errors, picking a new
					range clears the boundary and retries, without remounting the table on
					every brush. The TimeSlider lives outside this boundary, so it is never
					affected either way. */}
				<ErrorBoundary resetKeys={[this.state.timeSpan[0], this.state.timeSpan[1]]}>
					<PermitsTableWrapper
						after={this.state.timeSpan[0]}
						before={this.state.timeSpan[1]}
						projectTypes={trcProjectTypes}
						trc={true}
					/>
				</ErrorBoundary>
			</div>
		);
	}
}

export default TRCDataTable;
