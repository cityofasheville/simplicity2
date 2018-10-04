import React from 'react';
import { scaleLinear } from 'd3-scale';

export default function dotBinLayout({
  type,
  data,
  styleFn,
  projection,
  classFn,
  adjustedSize
}) {
  const keys = Object.keys(data)
  let allCalculatedPieces = []
  keys.forEach(key => {
    const ordset = data[key];
    const radiusFunc = scaleLinear()
      .range([2, type.maxRadius])
      .domain([0, type.maxRadiusVal]);
    const calculatedPieces = ordset.pieceData
      .filter(pieceDatum => pieceDatum.data.count > 0)
      .map((piece, i) => {

        const radius = radiusFunc(piece.data.count)
        const pieceSize = radius * 2;
        let xPosition = piece.scaledValue
        let yPosition = ordset.middle - radius
        let finalWidth = pieceSize
        let finalHeight = pieceSize

        if (!piece.negative) {
          yPosition -= piece.scaledValue
        }

        if (projection === "horizontal") {
          yPosition = ordset.middle - radius
          xPosition = piece.scaledValue
          if (piece.negative) {
            xPosition = piece.scaledValue - piece.scaledValue
          }
        }

        const xy = {
          x: xPosition,
          y: yPosition,
          middle: radius,
          height: finalHeight,
          width: finalWidth
        }

        const renderElementObject = (
          <g
            key={`piece-${piece.renderKey}`}
            transform={`translate(${xPosition},${yPosition})`}
            role="img"
            tabIndex="-1"
          >
            <circle
              r={radiusFunc(piece.data.count)}
              style={type.style}
            ></circle>
          </g>
        )

        const calculatedPiece = {
          o: key,
          xy,
          piece,
          renderElement: renderElementObject
        }
        return calculatedPiece
      })
    allCalculatedPieces = [...allCalculatedPieces, ...calculatedPieces]
  })
  return allCalculatedPieces
}
