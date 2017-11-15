import React from 'react';
import PropTypes from 'prop-types';
//import esri from 'esri-leaflet';

class ProjectMap extends React.Component {
  componentDidMount() {
    const map = L.map(this.refs.mapRef).setView(this.props.center, 15);
    //esri.basemapLayer("Streets").addTo(map);
    // const crsForStatePlane = new L.Proj.CRS(
    //   'EPSG:2264',
    //   '+proj=lcc +lat_1=36.16666666666666 +lat_2=34.33333333333334 +lat_0=33.75 +lon_0=-79 +x_0=609601.2192024384 +y_0=0 +ellps=GRS80 +datum=NAD83 +to_meter=0.3048006096012192 +no_defs', {
    //     origin: [-1.218419E8, 1.540248E8],
    //     resolutions: [
    //       217.01388888888889,
    //       108.50694444444444,
    //       55.55555555555555,
    //       27.777777777777775,
    //       13.888888888888888,
    //       6.944444444444444,
    //       3.472222222222222,
    //       1.736111111111111,
    //     ],
    //   }
    // );
    // const map = L.map(this.refs.mapRef, {
    //   crs: crsForStatePlane,
    //   continuousWorld: true,
    //   worldCopyJump: false,
    // }).setView(this.props.center, 10);
    // esri.tiledMapLayer({
    //   url: 'https://tiles.arcgis.com/tiles/aJ16ENn1AaqdFlqx/arcgis/rest/services/AshevilleBasemap/MapServer',
    // }).addTo(map);
    // const query = esri.query({
    //   url: 'http://services.arcgis.com/aJ16ENn1AaqdFlqx/arcgis/rest/services/CIP_Storymap/FeatureServer/0',
    // }).where(['NAME=\'', this.props.name, '\''].join(''));
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

ProjectMap.propTypes = {
  center: PropTypes.arrayOf(PropTypes.number),
  name: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
};

ProjectMap.defaultProps = {
  center: [35.5951, -82.5515],
  name: '',
  width: '100%',
  height: '230px',
};

export default ProjectMap;

