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
