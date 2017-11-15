import React from 'react';
import PropTypes from 'prop-types';
import { Map as LeafletMap, Marker, TileLayer } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';

//using open street map for now because that way can use the clusters, etc.

const markerClusterOptions = {
  maxClusterRadius: 20,
};

const Map = (props) => {
  const markers = [];
  for (let pt of props.data) {
    markers.push({
      position: [pt.y, pt.x],
      popup: pt.popup || null,
      options: pt.options || {},
    });
  }
  console.log('Data', props.data);

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <LeafletMap className="markercluster-map" center={props.center} zoom={15} maxZoom={18}>
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={props.center} />
        <MarkerClusterGroup markers={markers} options={markerClusterOptions} />
      </LeafletMap>
    </div>
  );
};

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
