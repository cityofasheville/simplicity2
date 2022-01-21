import React, { useState, useEffect } from 'react'

const RISK_NAME = {
    0: {risk:'lower'},
    1: {risk:'medium'},
    2: {risk:'high'},
    3: {risk:'highest'}
};


const floodImg = "https://drive.google.com/uc?export=view&id=1RjvA8OfYaN55b1nOy4w2Bz3ja3aZC_3O";
const wildfireImg = "https://drive.google.com/uc?export=view&id=1xwStl5e7d2BMtt7p59m1ZpQHrpIAtwzj";
const landslideImg = "https://drive.google.com/uc?export=view&id=1ywKPriWubYDJk-UpPd5ea69jcdZf3Jk8";

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

    let floodText = getRiskLevel(climateJusticeData.flood, props.inCity);
    let fireText = getRiskLevel(climateJusticeData.wildfire, props.inCity);
    let landslideText = getRiskLevel(climateJusticeData.landslide, props.inCity);

    return (
        <div className='climate-justice-container' aria-label="Climate Justice">
            <div className="cj-threats">
                <div aria-label="Flood">
                    <p className='tag'>FLOOD</p>
                    <div className="img">
                        <img src={floodImg} alt="Flood" />
                    </div>
                    {  
                        floodText !== undefined ? 
                        <p className={`${floodText.risk} info`}>{floodText.risk}</p> : 
                        <p className='info error'>There was a server error, please try again.</p>
                    }
                </div>
                <div aria-label="Wildfire">
                    <p className='tag'>WILDFIRE</p>
                    <div className="img">
                        <img src={wildfireImg} alt="Wildfire" />
                    </div>
                    {  
                        fireText !== undefined ? 
                        <p className={`${fireText.risk} info`}>{fireText.risk}</p> : 
                        <p className='info error'>There was a server error, please try again.</p>
                    }
                </div>
                <div aria-label="Landslide">
                    <p className='tag'>LANDSLIDE</p>
                    <div className="img">
                        <img src={landslideImg} alt="Landslide" />
                    </div>
                    {  
                        landslideText !== undefined ? 
                        <p className={`${landslideText.risk} info`}>{landslideText.risk}</p> : 
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