import React from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import { Map as LeafletMap, Marker, TileLayer, Popup, Circle, Polyline, Polygon } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';

//using open street map for now because that way can use the clusters, etc.

const markerClusterOptions = {
  maxClusterRadius: 20,
};

const getBounds = (center, within) => {
  const degToAdd = parseInt(within, 10) / 500000;
  return [[center[0] - degToAdd, center[1] - degToAdd], [center[0] + degToAdd, center[1] + degToAdd]];
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

  let shouldZoomToNonCenter = false;
  let zoomTo = null;
  if (props.zoomToPoint !== null && props.zoomToPoint !== '') {
    shouldZoomToNonCenter = true;
    zoomTo = props.zoomToPoint.split(',');
    zoomTo = [parseFloat(zoomTo[0]), parseFloat(zoomTo[1])];
  }

  return (
    <div style={{ height: props.height, width: props.width }}>
      <LeafletMap className="markercluster-map" center={shouldZoomToNonCenter ? zoomTo : props.center} zoom={props.zoom} maxZoom={18} bounds={props.bounds === null ? getBounds(shouldZoomToNonCenter ? zoomTo : props.center, shouldZoomToNonCenter ? 83 : props.within) : props.bounds}>
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {props.drawCircle &&
          <Circle center={props.center} radius={props.radius} fillOpacity={0.15} />
        }
        {shouldZoomToNonCenter &&
          <Circle center={zoomTo} radius={15} fillOpacity={0.15} color="red" />
        }
        {props.showCenter &&
          <Marker
            position={props.center}
            icon={L.icon({
              iconUrl: require('../../shared/marker-icon-2.png'),
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [2, -22],
            })}
          >
            <Popup>
              <div><b>{props.centerLabel}</b></div>
            </Popup>
          </Marker>
        }
        {props.drawStreet &&
          props.streetData.map((line, index) =>
            <Polyline key={['street_line', index].join('_')} positions={line} weight={5} />
          )
        }
        {props.drawPolygon &&
          props.polygonData.map((poly, index) =>
            <Polygon key={['polygon', index].join('_')} positions={poly.polygons}>
              {poly.popup &&
                <Popup>
                  {poly.popup}
                </Popup>
              }
            </Polygon>
          )
        }
        <MarkerClusterGroup markers={markers} options={markerClusterOptions} />
      </LeafletMap>
    </div>
  );
};

Map.propTypes = {
  center: PropTypes.arrayOf(PropTypes.number),
  centerLabel: PropTypes.string,
  name: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  drawCircle: PropTypes.bool,
  drawPolygon: PropTypes.bool,
  radius: PropTypes.number,
  showCenter: PropTypes.bool,
  zoom: PropTypes.number,
  within: PropTypes.number,
  bounds: PropTypes.array, //eslint-disable-line
  streetData: PropTypes.array, //eslint-disable-line
  polygonData: PropTypes.array, //eslint-disable-line
  data: PropTypes.array, //eslint-disable-line
  drawStreet: PropTypes.bool,
  zoomToPoint: PropTypes.string,
};

Map.defaultProps = {
  center: [35.5951, -82.5515],
  centerLabel: null,
  name: '',
  width: '100%',
  height: '600px',
  drawCircle: false,
  drawStreet: false,
  drawPolygon: false,
  radius: 83,
  showCenter: false,
  zoom: 16,
  within: 1320,
  bounds: null,
  streetData: null,
  polygonData: null,
  data: [],
  zoomToPoint: null,
};

export default Map;
