import React from 'react';
import PropTypes from 'prop-types';
import esri from 'esri-leaflet';

class Map extends React.Component {
  componentDidMount() {
    const map = L.map(this.refs.mapRef).setView(this.props.center, 15);
    esri.basemapLayer("Topographic").addTo(map);
    esri.tiledMapLayer({
      url: 'https://tiles.arcgis.com/tiles/aJ16ENn1AaqdFlqx/arcgis/rest/services/AshevilleBasemap/MapServer',
    }).addTo(map);
    // query.run(function(error, featureCollection) {
    //   if (featureCollection !== null && featureCollection.features.length > 0) {
    //     const features = L.geoJSON(featureCollection.features).addTo(map);
    //     const bounds = features.getBounds();
    //     features.bindPopup(layer => (L.Util.template('<p>{NAME}<br>LAT: {LAT}<br>LONG: {LONG}</p>', layer.feature.properties)));
    //     map.fitBounds(bounds);
    //   }
    // });
  }

  render() {
    return (
      <div id="map" ref="mapRef" style={{ width: this.props.width, height: this.props.height }}></div>
    );
  }
}

Map.propTypes = {
  center: PropTypes.arrayOf(PropTypes.number),
  name: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
};

Map.defaultProps = {
  center: [35.5951, -82.5515],
  name: '',
  width: '100%',
  height: '600px',
};

export default Map;
