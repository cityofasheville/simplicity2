import React, { useState, useEffect } from 'react'

const RISK_NAME = {
    0: {risk:'purple'},
    1: {risk:'violet'},
    2: {risk:'pink'},
    3: {risk:'orange'},
    4: {risk:'yellow'}
};

const cjiEquityImg = "https://drive.google.com/uc?export=view&id=1Yf9C_64R9cWf83c8oHt5QfS268d0kfF_";

const getRiskLevel = (level, inCity) => {
    console.log(level, inCity, ':::::');
    if (!inCity) {
        return 'There is no data for your Neighborhood';
    } else {
        if (level <= 6) {
            return RISK_NAME[0];
        }
        if (level > 6 && level <= 10) {
            return RISK_NAME[1];
        }
        if (level > 10 && level <= 14) {
            return RISK_NAME[2];
        }
        if (level > 14 && level <= 18) {
            return RISK_NAME[3];
        }
        if (level > 18) {
            return RISK_NAME[4];
        }
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
        fetch(climateJusticeApi)
        .then(response => response.json())
        .then(data => {
            console.log(data);
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
    console.log(cjiScore, ':::::');
    return (
        <div className='climate-justice-container' aria-label="CJI score for your general area">
            <div className="cj-threats">
                <div aria-label="CJI score for your general area">
                    <div className="img">
                        <img src={cjiEquityImg} alt="Flood" />
                    </div>
                    {  
                        cjiScore !== undefined ? 
                        <p className={`${cjiScore.risk} info`}><span>CLIMATE INDEX SCORE FOR THIS AREA: </span><span class="score">{climateJusticeData.sum_scores}</span></p> : 
                        <p className='info error'>There was a server error, please try again.</p>
                    }
                </div>
            </div>
            <div className='resiliency-guide'>
                What does this score mean? 
                <a href='https://avl.maps.arcgis.com/apps/instant/lookup/index.html?appid=10e2c4ae45614b92ad4efaa61342b249%2F' target="_blank"> See the Climate Justice Dashboard</a>.
            </div>
            <div className='resiliency-guide'>
                What can I do to increase my household resilience?
                <a href='https://drive.google.com/file/d/0BzZzONRPV-VAVF9vb2pOMUtkRmFJR1AyNFluYU5ESU9rODRJ/view?resourcekey=0-ZQ80xC-a8bw4JDs7z0Neaw' target="_blank"> See Climate Resiliency Guide</a>.
            </div>
        </div>
    )
}

export default ClimateJustice