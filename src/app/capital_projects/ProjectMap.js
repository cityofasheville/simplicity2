import React from 'react';
require('leaflet');
import PropTypes from 'prop-types';
import esri from 'esri-leaflet';

class ProjectMap extends React.Component{
  constructor(props) {
    super(props);
  }

  componentDidMount(){
    const map = L.map(this.refs.mapRef).setView(this.props.center, 15);
    esri.basemapLayer("Streets").addTo(map);
    // const projects = esri.featureLayer({
    //     url: "http://services.arcgis.com/aJ16ENn1AaqdFlqx/arcgis/rest/services/CIP_Storymap/FeatureServer/0",
    //     style: function() {
    //       return {
    //           color: "#70ca49",
    //           weight: 2
    //       };
    //     }
    // }).addTo(map);
    const query = esri.query({
      url: "http://services.arcgis.com/aJ16ENn1AaqdFlqx/arcgis/rest/services/CIP_Storymap/FeatureServer/0",
    }).where(['NAME=\'', this.props.display_name, '\''].join(''));
    query.run(function(error, featureCollection, response) {
      if (featureCollection !== null && featureCollection.features.length > 0) {
        L.geoJSON(featureCollection.features).addTo(map);
        map.setView([featureCollection.features[0].properties.LAT, featureCollection.features[0].properties.LONG]);
      }
    });
  }

  render(){
      return(
        <div id='map' ref="mapRef" style={{ width: this.props.width, height: this.props.height }}></div>
      )
  }
}

ProjectMap.propTypes = {
  center: PropTypes.arrayOf(PropTypes.number),
  display_name: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
}

ProjectMap.defaultProps = {
  center: [35.5951, -82.5515],
  display_name: '',
  width: '100%',
  height: '230px',
}

export default ProjectMap;

