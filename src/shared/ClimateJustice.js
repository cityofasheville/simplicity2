import React, { useState, useEffect } from 'react'

const RISK_NAME = {
    0: 'lower',
    1: 'medium',
    2: 'high',
    3: 'HIGHEST'
};

const floodImg = "https://drive.google.com/uc?export=view&id=1jS00hE1Y4Oto8PhPkldx4sHp7xtq8sIs";
const wildfireImg = "https://drive.google.com/uc?export=view&id=16DBmEGKAJQjVT31fdfxdtvG7nqjPPLAR";
const landslideImg = "https://drive.google.com/uc?export=view&id=13IVjkYx6rwpj1ELhwfnQOutC4OSEM_pe";

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
        fetch(climateJusticeApi)
        .then(response => response.json())
        .then(data => {
            setClimateJusticeData(data.features[0].attributes);
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
                    <p className={`${floodText} info`}>{floodText}</p>
                </div>
                <div aria-label="Wildfire">
                    <p className='tag'>WILDFIRE</p>
                    <div className="img">
                        <img src={wildfireImg} alt="Wildfire" />
                    </div>
                    <p className={`${fireText} info`}>{fireText}</p>
                </div>
                <div aria-label="Landslide">
                    <p className='tag'>LANDSLIDE</p>
                    <div className="img">
                        <img src={landslideImg} alt="Landslide" />
                    </div>
                    <p className={`${landslideText} info`}>{landslideText}</p>
                </div>
            </div>
            <div className='resiliency-guide'>See Resiliency guide <a href='https://drive.google.com/file/d/0BzZzONRPV-VAVF9vb2pOMUtkRmFJR1AyNFluYU5ESU9rODRJ/view?resourcekey=0-ZQ80xC-a8bw4JDs7z0Neaw' className='' target="_blank">here</a>.</div>
        </div>
    )
}

export default ClimateJustice