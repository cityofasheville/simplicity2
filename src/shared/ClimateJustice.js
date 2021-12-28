import React, { useState, useEffect } from 'react'

const ClimateJustice = (props) => {
    let pinNum = props.pinnum;
    let civicAddress = props.civicAddress;
    let [climateJusticeData, setClimateJusticeData] = useState({})
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
    return (
        <div className='card-addons-container detailsFieldset__details-listings' aria-label="Climate Justice">
            <div className="ss-container">
                <div aria-label="Flood"><p className='tag'>Flood: </p><p className='info'>{climateJusticeData.flood}</p></div>
                <div aria-label="Wildfire"><p className='tag'>Wildfire: </p><p className='info'>{climateJusticeData.wildfire}</p></div>
                <div aria-label="Landslide"><p className='tag'>Landslide: </p><p className='info'>{climateJusticeData.landslide}</p></div>
            </div>
        </div>
    )
}

export default ClimateJustice