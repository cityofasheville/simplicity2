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
    esri.basemapLayer("Topographic").addTo(map);
    const query = esri.query({
      url: "http://services.arcgis.com/aJ16ENn1AaqdFlqx/arcgis/rest/services/CIP_Storymap/FeatureServer/0",
    }).where(['NAME=\'', this.props.name, '\''].join(''));
    query.run(function(error, featureCollection, response) {
      if (featureCollection !== null && featureCollection.features.length > 0) {
        const features = L.geoJSON(featureCollection.features).addTo(map);
        const bounds = features.getBounds();
        features.bindPopup((layer) => (L.Util.template('<p>{NAME}<br>LAT: {LAT}<br>LONG: {LONG}</p>', layer.feature.properties)));
        map.fitBounds(bounds);
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
  name: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
}

ProjectMap.defaultProps = {
  center: [35.5951, -82.5515],
  name: '',
  width: '100%',
  height: '230px',
}

export default ProjectMap;

