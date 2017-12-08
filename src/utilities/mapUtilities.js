import React from 'react';

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
    polygons.push(poly.points.map(pt => [pt.y, pt.x]));
  }
  return polygons;
};

const getAllPolygonPoints = (polygonData) => {
  const points = [];
  for (let poly of polygonData) {
    for (let pt of poly.points) {
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
    polygonData.popup = (<div><b>Pin #</b><div>{property.pinnum}{property.pinnumext}</div><br /><b>Civic Address ID</b><div>{property.civic_address_id || 'none found'}</div><br /><b>Address: </b><div>{property.address}, {property.zipcode}</div></div>);
    polygons.push(polygonData);
  }
  return polygons;
};

export const getBoundsFromPolygonData = data => (
  getBounds(getAllPolygonPoints(data))
);
