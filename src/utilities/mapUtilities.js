import React from 'react';
import Icon from '../shared/Icon';
import { IM_CIRCLE2 } from '../shared/iconConstants'

const getMaintenanceInfo = (entity, comma) => {
  if (entity === null) {
    return <div>No information available{comma ? ',' : ''}</div>;
  }
  if (entity === 'CITY OF ASHEVILLE') {
    return (<div><span><a href="http://www.ashevillenc.gov/departments/street_services/maintenance.htm" target="_blank">{entity}</a></span><span style={{ marginLeft: '10px' }}><a href="http://www.ashevillenc.gov/departments/it/online/service_requests.htm" target="_blank"><button className="btn btn-xs btn-warning">Report with the Asheville App</button></a>
    </span></div>);
  }
  if (entity === 'NCDOT') {
    return <div><span><a href="https://apps.ncdot.gov/contactus/Home/PostComment?Unit=PIO" target="_blank">{entity}</a>{comma ? ',' : ''}</span></div>;
  }
  return <div>{entity}{comma ? ',' : ''}</div>;
};

export const getBounds = (data) => {
  let xMinIndex = 0;
  let yMinIndex = 0;
  let xMaxIndex = 0;
  let yMaxIndex = 0;
  if (data.length > 0) {
    for (let i = 0; i < data.length; i += 1) {
      if (data[i].x < data[xMinIndex].x) {
        xMinIndex = i;
      }
      if (data[i].x > data[xMaxIndex].x) {
        xMaxIndex = i;
      }
      if (data[i].y < data[yMinIndex].y) {
        yMinIndex = i;
      }
      if (data[i].y > data[yMaxIndex].y) {
        yMaxIndex = i;
      }
    }
    return [
      [data[yMinIndex].y, data[xMinIndex].x],
      [data[yMaxIndex].y, data[xMaxIndex].x],
    ];
  }
  return null;
};

const getAllStreetPoints = (streetData) => {
  const points = [];
  for (let street of streetData) {
    for (let pt of street.line) {
      points.push(pt);
    }
  }
  return points;
};

export const getBoundsFromStreetData = data => (
  getBounds(getAllStreetPoints(data))
);

export const convertStreetLinesToLatLngArrays = (streetData) => {
  const lines = [];
  for (let street of streetData) {
    lines.push(street.line.map(point => [point.y, point.x]));
  }
  return lines;
};

export const convertPolygonsToLatLngArrays = (polygonData) => {
  const polygons = [];
  for (let poly of polygonData) {
    const latLng = [];
    latLng.push(poly.outer.points.map(pt => [pt.y, pt.x]));
    if (poly.holes && poly.holes.length > 0) {
      for (let hole of poly.holes) {
        latLng.push(hole.points.map(pt => [pt.y, pt.x]));
      }
    }
    polygons.push(latLng);
  }
  return polygons;
};

//get bounds based on the outer points of polygon/s of a property
export const getBoundsFromPropertyPolygons = (polygonData) => {
  const points = [];
  for (let poly of polygonData) {
    for (let pt of poly.outer.points) {
      points.push(pt);
    }
  }
  return getBounds(points);
};

//get bounds based on the outer points of a list of property polygons
export const getBoundsFromPropertyList = (polygonList) => {
  const points = [];
  for (let polygon of polygonList) {
    for (let index of Object.keys(polygon)) {
      for (let pt of polygon[index].outer.points) {
        points.push(pt);
      }
    }
  }
  return getBounds(points);
};

//only getting the outer bounds
const getAllPolygonPoints = (polygonData) => {
  const points = [];
  for (let poly of polygonData) {
    for (let pt of poly.outer.points) {
      points.push(pt);
    }
  }
  return points;
};

export const combinePolygonsFromPropertyList = (propertyList) => {
  const polygons = [];
  for (let property of propertyList) {
    const polygonData = Object.assign({}, property);
    delete polygonData.polygons;
    polygonData.polygons = [];
    polygonData.polygons = convertPolygonsToLatLngArrays(property.polygons);
    polygonData.popup = (<div><b>Pin #</b><div>{property.pinnum}</div><br /><b>Civic Address ID</b><div>{property.property_civic_address_id}</div><br /><b>Address: </b><div>{property.property_address}, {property.property_zipcode}</div></div>);
    polygons.push(polygonData);
  }
  return polygons;
};

export const combinePolygonsFromNeighborhoodList = (neighborhoodList) => {
  const polygons = [];
  for (let key of Object.keys(neighborhoodList)) {
    const polygonData = Object.assign({}, neighborhoodList[key]);
    polygonData.polygons = [];
    polygonData.polygons = convertPolygonsToLatLngArrays([neighborhoodList[key].polygon]);
    polygons.push(polygonData);
  }
  return polygons;
};

export const getBoundsFromPolygonData = data => (
  getBounds(getAllPolygonPoints(data))
);

export const formatMaintenanceData = (data) => {
  const maintenanceData = [];
  for (let centerline of data) {
    const segmentInfo = {};
    segmentInfo.line = centerline.line.map(point => [point.y, point.x]);
    if (centerline.maintenance_entities.length === 1) {
      if (centerline.maintenance_entities.indexOf('NCDOT') > -1) {
        segmentInfo.color = '#506aed';
        segmentInfo.maintenance_entity = 'NCDOT';
      } else if (centerline.maintenance_entities.indexOf('CITY OF ASHEVILLE') > -1) {
        segmentInfo.color = '#6fe8cb';
        segmentInfo.maintenance_entity = 'CITY OF ASHEVILLE';
      } else {
        segmentInfo.color = '#f95eff';
        segmentInfo.maintenance_entity = centerline.maintenance_entities[0] === null ? 'NO INFORMATION AVAILABLE' : centerline.maintenance_entities[0];
      }
    }
    if (centerline.maintenance_entities.length > 1) {
      segmentInfo.color = '#DB6D00';
      segmentInfo.maintenance_entity = 'MULTIPLE';
    }
    segmentInfo.popup = (<div><b>Centerline ID</b><div>{parseInt(centerline.centerline_id, 10)}</div><br /><b>Maintenance</b>{centerline.maintenance_entities.map((item, idx) => <div key={idx}>{getMaintenanceInfo(item, centerline.maintenance_entities.length > 1 && idx < centerline.maintenance_entities.length - 1)}</div>)}<br /></div>);
    maintenanceData.push(segmentInfo);
  }
  return maintenanceData;
};

export const createMaintenanceLegend = (data) => {
  const maintenanceEntities = [];
  const colors = [];
  let entityAlreadyPresent;
  for (let i = 0; i < data.length; i += 1) {
    entityAlreadyPresent = false;
    if (maintenanceEntities.indexOf(data[i].maintenance_entity) > -1) {
      entityAlreadyPresent = true;
    }
    if (!entityAlreadyPresent) {
      maintenanceEntities.push(data[i].maintenance_entity);
      colors.push(data[i].color);
    }
  }
  return (
    <div style={{ width: '160px' }}>
      {maintenanceEntities.map((type, index) => (
        <div key={`legendItem-${type}`} style={{ width: '160px', marginBottom: '5px' }}><Icon path={IM_CIRCLE2} size={16} color={colors[index]} verticalAlign="top" /><span style={{ marginLeft: '5px', display: 'inline-block', width: '130px' }}>{type}</span></div>
      ))}
    </div>
  );
};
