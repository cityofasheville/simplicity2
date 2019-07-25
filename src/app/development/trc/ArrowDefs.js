import React from 'react';
import PropTypes from 'prop-types';
import { trcProjectTypes } from './textContent';

/*
Make little triangles that we can use at the end of the diagram links by referencing their id attribute.

From https://developer.mozilla.org/en-US/docs/Web/SVG/Element/defs:
"The <defs> element is used to store graphical objects that will be used at a later time. Objects created inside a <defs> element are not rendered directly. To display them you have to reference them (with a <use> element for example)."
*/
const ArrowDefs = ({ arrowWidth }) => (
  <defs>
    {Object.values(trcProjectTypes).map(type => (
      <marker
        key={`marker-${type.short}`}
        id={`marker-${type.short}`}
        markerWidth={arrowWidth}
        markerHeight={arrowWidth}
        refX={arrowWidth * (2 / 3)}
        refY={arrowWidth / 2}
        orient="auto"
        markerUnits="strokeWidth"
      >
        <path
          d={`M0,0 L0,${arrowWidth} L${arrowWidth * (2 / 3)},${arrowWidth / 2} z`}
          fill={type.color}
        />
      </marker>
    ))}
  </defs>
);

ArrowDefs.propTypes = {
  arrowWidth: PropTypes.number.isRequired,
};

export default ArrowDefs;
