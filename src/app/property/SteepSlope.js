import React from 'react'
import { useState } from 'react';
import LoadingAnimation from '../../shared/LoadingAnimation';

const SteepSlope = (props) => {
    const [isSlopeDataShown, setSlopeData] = useState(false);
    const [isSlopeDataError, setSlopeDataError] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [showSSData, setShowSSData] = useState(
        {
            jurisdiction: "",
            acres: 0,
            maxElevation: 0,
            percentSlope: 0
        }
    );

    const getSteepSlope = (pinValue, setSlopeData, setShowSSData, setSlopeDataError) => {
        setSlopeData(true);
        setSlopeDataError(false);
        let steepSlopeUrl = "https://mapwnc.org/api/slopebypin/" + pinValue;
        fetch(steepSlopeUrl)
        .then(response => response.json())
        .then(data => {
            setShowSSData(data);
            setDataLoaded(true);
        })
        .catch((e) => {
            setSlopeData(false);
            setSlopeDataError(true);
        });
    }

    return (
        <div>
            {
                (isSlopeDataShown && !dataLoaded && !isSlopeDataError) && 
                <LoadingAnimation />
            }
            <div className='steep-slope-tag'>
                {
                    (!isSlopeDataShown && !dataLoaded) &&
                    <button className="btn btn-default steep-slope-btn"
                    onClick={()=>getSteepSlope(props.pinnum, setSlopeData, setShowSSData, setSlopeDataError)}
                    title="Get Steep Slope" aria-label="get Steep Slope Data">
                    <span>Get Steep Slope Data</span>
                    </button>
                }
            </div>
            <div id="ssData" className={((isSlopeDataShown && dataLoaded) || isSlopeDataError) ? 'detailsFieldset__details-listings card-addons-container' : 'detailsFieldset__details-listings card-addons-container hide-elem'}>
                <div id="successData" className={(!isSlopeDataError && isSlopeDataShown && dataLoaded) ? 'ss-container' : 'ss-container hide-elem' } aria-label="Slope Steep Data">
                <div><p className="tag">Jurisdiction:</p><p className="info">{showSSData.jurisdiction ? showSSData.jurisdiction : '--'}</p></div>
                {/* <div><p className="tag">Acres: </p> <p className="info">{showSSData.acres  ? showSSData.acres : '--'}</p></div> */}
                <div><p className="tag">Maximum Elevation:</p><p className="info">{showSSData.maxElevation ? showSSData.maxElevation : '--'}</p></div>
                <div><p className="tag">Percent Slope:</p><p className="info">{showSSData.percentSlope ? showSSData.percentSlope : '--'}</p></div>
                </div>
                <div id="slopeError" aria-label="Server Error" className={!isSlopeDataError ? 'slope-error hide-elem' : 'slope-error'}>
                    <p>There has been an error in the server, please try again.</p>
                </div>
            </div>
        </div>
    )
}

export default SteepSlope

