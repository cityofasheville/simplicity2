import React from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import {
  Map as LeafletMap,
  Marker,
  TileLayer,
  Popup,
  Circle,
  Polyline,
  Polygon,
  LayersControl,
} from 'react-leaflet';
import { GoogleLayer } from 'react-leaflet-google';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import MapLegendControl from './MapLegendControl';
import Icon from '../Icon';
import { IM_LIST2 } from '../iconConstants';

// using open street map for now because that way can use the clusters, etc.

const mapKey = 'AIzaSyAO8R1pXvBhpRoTFJ4d81MA8D8QBD0mPe0'; // restrict your referrers in cloud console
const { BaseLayer } = LayersControl;
const satellite = 'SATELLITE';

const markerClusterOptions = {
  maxClusterRadius: 20,
};

const getBounds = (center, within) => {
  const degToAdd = parseInt(within, 10) / 500000;
  return [
    [center[0] - degToAdd, center[1] - degToAdd],
    [center[0] + degToAdd, center[1] + degToAdd],
  ];
};

const Map = (props) => {
  const markers = [];
  for (const pt of props.data) {
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
      <LeafletMap
        className="markercluster-map"
        center={shouldZoomToNonCenter ? zoomTo : props.center}
        zoom={props.zoom}
        maxZoom={18}
        bounds={
          props.bounds === null
            ? getBounds(
              shouldZoomToNonCenter ? zoomTo : props.center,
              shouldZoomToNonCenter ? 660 : props.within
            )
            : props.bounds
        }
      >
        <LayersControl position="topright">
          <BaseLayer checked name="OpenStreetMap">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            />
          </BaseLayer>
          <BaseLayer name="Google Maps Satellite">
            <GoogleLayer googlekey={mapKey} maptype={satellite} />
          </BaseLayer>
          {props.drawCircle && (
            <Circle center={props.center} radius={props.radius} fillOpacity={0.15} />
          )}
          {shouldZoomToNonCenter && (
            <Circle center={zoomTo} radius={15} fillOpacity={0.15} color="red" />
          )}
          {props.showCenter && (
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
                <div>
                  <b>{props.centerLabel}</b>
                </div>
              </Popup>
            </Marker>
          )}
          {props.drawStreet &&
            props.streetData.map((line, index) => (
              <Polyline
                key={['street_line', index].join('_')}
                positions={line}
                weight={5}
                className="noPointer"
              />
            ))}
          {props.drawMaintenance &&
            props.maintenanceData.map((line, index) => (
              <Polyline
                key={['maintenance_line', index].join('_')}
                positions={line.line}
                weight={10}
                opacity={0.8}
                color={line.color}
              >
                <Popup>{line.popup}</Popup>
              </Polyline>
            ))}
          {props.drawPolygon &&
            props.polygonData.map((poly, index) => (
              <Polygon key={['polygon', index].join('_')} positions={poly.polygons}>
                {poly.popup && <Popup>{poly.popup}</Popup>}
              </Polygon>
            ))}
          <MarkerClusterGroup markers={markers} {...markerClusterOptions} />
        </LayersControl>
        {props.legend && (
          <MapLegendControl>
            <div className="legendIcon">
              <Icon path={IM_LIST2} size={24} color="#828282" />
            </div>
            <div
              className="legend"
              style={{ maxHeight: parseInt(props.height.split('px')[0], 10) / 2 }}
            >
              <div
                className="closeLegend"
                style={{ fontWeight: 'bold', fontSize: '14px', color: '#979797' }}
                onClick={(e) => {
                  if (e.target.parentNode.style.display === 'block') {
                    e.target.parentNode.style.display = 'none';
                  }
                }}
              >
                X
              </div>
              {props.legend}
            </div>
          </MapLegendControl>
        )}
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
  maintenanceData: PropTypes.array, //eslint-disable-line
  drawMaintenance: PropTypes.bool,
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
  drawMaintenance: false,
  radius: 83,
  showCenter: false,
  zoom: 16,
  within: 1320,
  bounds: null,
  streetData: null,
  polygonData: null,
  maintenanceData: null,
  data: [],
  zoomToPoint: null,
};

export default Map;
