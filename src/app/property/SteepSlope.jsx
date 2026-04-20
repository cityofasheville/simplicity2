import React from "react";
import { useState } from "react";
import LoadingAnimation from "../../shared/LoadingAnimation";

const SteepSlope = (props) => {
	const [isSlopeDataShown, setSlopeData] = useState(false);
	const [isSlopeDataError, setSlopeDataError] = useState(false);
	const [dataLoaded, setDataLoaded] = useState(false);
	const [showSSData, setShowSSData] = useState({
		jurisdiction: "",
		acres: 0,
		maxElevation: 0,
		percentSlope: 0,
	});

	const getSteepSlope = (pinValue, setSlopeData, setShowSSData, setSlopeDataError) => {
		setSlopeData(true);
		setSlopeDataError(false);
		let steepSlopeUrl = "https://mapwnc.org/api/slopebypin/" + pinValue;
		fetch(steepSlopeUrl)
			.then((response) => response.json())
			.then((data) => {
				setShowSSData(data);
				setDataLoaded(true);
			})
			.catch((e) => {
				setSlopeData(false);
				setSlopeDataError(true);
			});
	};

	return (
		<div>
			{isSlopeDataShown && !dataLoaded && !isSlopeDataError && <LoadingAnimation />}
			{!isSlopeDataShown && !dataLoaded && (
				<button
					className="btn btn-primary bt-sm"
					onClick={() => getSteepSlope(props.pinnum, setSlopeData, setShowSSData, setSlopeDataError)}
					title="Get Steep Slope"
					aria-label="get Steep Slope Data"
				>
					<span>Get Steep Slope Data</span>
				</button>
			)}
			<div id="ssData" className={(isSlopeDataShown && dataLoaded) || isSlopeDataError ? "flex" : "hidden"}>
				<div id="successData" aria-label="Slope Steep Data">
					<div className="flex flex-row">
						<p className="mr-1 font-light">Jurisdiction:</p>
						<p>{showSSData.jurisdiction ? showSSData.jurisdiction : "--"}</p>
					</div>
					{/* <div><p className="tag">Acres: </p> <p>{showSSData.acres  ? showSSData.acres : '--'}</p></div> */}
					<div className="flex flex-row">
						<p className="mr-1 font-light">Maximum Elevation:</p>
						<p>{showSSData.maxElevation ? showSSData.maxElevation : "--"}</p>
					</div>
					<div className="flex flex-row">
						<p className="mr-1 font-light">Percent Slope:</p>
						<p>{showSSData.percentSlope ? showSSData.percentSlope : "--"}</p>
					</div>
				</div>
				<div id="slopeError" aria-label="Server Error" className={!isSlopeDataError ? "hidden" : "flex"}>
					<p>There has been an error in the server, please try again.</p>
				</div>
			</div>
		</div>
	);
};

export default SteepSlope;
