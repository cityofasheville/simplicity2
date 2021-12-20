import React from 'react'
import { useState } from 'react';

const SteepSlope = (props) => {
    const [isSlopeDataShown, setSlopeData] = useState(false);
    const [isSlopeDataError, setSlopeDataError] = useState(false);
    const [showSSData, setShowSSData] = useState(
        {
            jurisdiction: "",
            acres: 0,
            maxElevation: 0,
            percentSlope: 0
        }
    );

    const getSteepSlope = (pinValue, setSlopeData, setShowSSData, setSlopeDataError) => {
        let steepSlopeUrl = "https://mapwnc.org/api/slopebypin/" + pinValue;
        fetch(steepSlopeUrl)
        .then(response => response.json())
        .then(data => {
            setSlopeData(true);
            setShowSSData(data);
        })
        .catch((e) => {
            setSlopeDataError(true);
        });
    }

    return (
        <div>
            <div className='steep-slope-tag'>
                {
                    !isSlopeDataShown && 
                    <button className="btn btn-default steep-slope-btn"
                    onClick={()=>getSteepSlope(props.pinnum, setSlopeData, setShowSSData, setSlopeDataError)}
                    title="Get Steep Slope" aria-label="get Steep Slope Data">
                    <span>Get Steep Slope Data</span>
                    </button>
                }
            </div>
            <div id="ssData" className={(isSlopeDataShown || isSlopeDataError) ? 'detailsFieldset__details-listings' : 'detailsFieldset__details-listings hide-elem'}>
                <div id="successData" className={(!isSlopeDataError && isSlopeDataShown) ? 'ss-container' : 'ss-container hide-elem' } aria-label="Slope Steep Data">
                <div><p className="tag">Jurisdiction:</p><p className="info">{showSSData.jurisdiction ? showSSData.jurisdiction : '--'}</p></div>
                <div><p className="tag">Acres: </p> <p className="info">{showSSData.acres  ? showSSData.acres : '--'}</p></div>
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

