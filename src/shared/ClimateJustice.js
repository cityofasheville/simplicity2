import React, { useState, useEffect } from 'react'

const RISK_NAME = {
    0: {risk:'lower'},
    1: {risk:'medium'},
    2: {risk:'high'},
    3: {risk:'highest'}
};

const cjiEquityImg = "https://drive.google.com/uc?export=view&id=1jHBgXX4Ic0LlP1JCexFIAGUYSC-9VBAw";

const getRiskLevel = (level, inCity) => {
    if (!inCity) {
        return 'There is no data for your Neighborhood';
    } else {
        return RISK_NAME[level];
    }
};

const ClimateJustice = (props) => {
    let pinNum = props.pinnum;
    let civicAddress = props.civicAddress;
    let [climateJusticeData, setClimateJusticeData] = useState({});
    const getClimateJusticeData = ({civicAddress, pinNum}, setClimateJusticeData) => {
        let climateJusticeParam = 0;
        let cjParam = "";
        if (civicAddress != 0 && pinNum == 0) {
            climateJusticeParam = civicAddress;
            cjParam = "civicAddress_id='" + climateJusticeParam + "'";
        } else {
            if (civicAddress == 0 && pinNum != 0) {
                climateJusticeParam = pinNum;
                cjParam = "property_pinnum='" + climateJusticeParam + "'";
            } else {
                climateJusticeParam = 0;
            }
        }
        let climateJusticeApi = `https://arcgis.ashevillenc.gov/arcgis/rest/services/Environmental/ClimateJustice_Address/MapServer/0/query?where=${cjParam}&outFields=*&f=pjson`;
        console.log(climateJusticeApi);
        alert(climateJusticeApi);
        fetch(climateJusticeApi)
        .then(response => response.json())
        .then(data => {
            setClimateJusticeData(data.features[0].attributes);
        })
        .catch(e => {
            console.log(e);
        });
    }

    useEffect(() => {
        getClimateJusticeData({civicAddress, pinNum}, setClimateJusticeData);
    }, []);

    let cjiScore = getRiskLevel(climateJusticeData.sum_scores, props.inCity);

    return (
        <div className='climate-justice-container' aria-label="Climate Justice">
            <div className="cj-threats">
                <div aria-label="Climate Justice Index">
                    <div className="img">
                        <img src={cjiEquityImg} alt="Flood" />
                    </div>
                    {  
                        cjiScore !== undefined ? 
                        <p className={`${cjiScore.risk} info`}>{cjiScore.risk}</p> : 
                        <p className='info error'>There was a server error, please try again.</p>
                    }
                </div>
            </div>
            <div className='resiliency-guide'>
                For mitigation strategies, see the 
                <a href='https://drive.google.com/file/d/0BzZzONRPV-VAVF9vb2pOMUtkRmFJR1AyNFluYU5ESU9rODRJ/view?resourcekey=0-ZQ80xC-a8bw4JDs7z0Neaw' className='' target="_blank"> Climate Resiliency Guide</a>.
            </div>
        </div>
    )
}

export default ClimateJustice