import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveOrdinalFrame } from 'semiotic';
import Tooltip from '../../../shared/visualization/Tooltip';


const VolumeHistogram = props => (
  <ResponsiveOrdinalFrame
    responsiveWidth
    canvasPieces
    data={props.data}
    size={[500, 200]}
    projection="vertical"
    type="bar"
    margin={{
      top: 10,
      right: 10,
      bottom: 55,
      left: 40,
    }}
    axis={[
      {
        orient: 'left',
        tickFormat: d => (
          <text
            textAnchor="end"
            style={{ fontSize: '0.70em' }}
          >
            {d}
          </text>
        ),
      },
    ]}
    oLabel={(d) => {
      const dateString = new Date(d).toLocaleDateString('en-US', props.dateOptions);
      return (
        <text
          textAnchor="end"
          transform="rotate(-35)"
          style={{ fontSize: '0.70em' }}
        >
          {dateString}
        </text>
      );
    }}
    oAccessor="binStartDate"
    oPadding={5}
    rAccessor="count"
    style={d => {
      return { fill: d.count === 0 ? 'none' : d.color, stroke: 'white', strokeWidth: 0.1 }
    }}
    hoverAnnotation
    tooltipContent={(d) => {
      const pieces = d.type === 'column-hover' ? d.pieces : [d.data];
      const title = new Date(pieces[0].binStartDate).toLocaleDateString('en-US', props.dateOptions);

      const textLines = pieces.map(piece => ({
        text: `${piece.key}: ${piece.count}`,
        color: piece.color,
      })).reverse();

      return (<Tooltip
        title={title}
        textLines={textLines}
      />);
    }}
  />
);

VolumeHistogram.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  dateOptions: PropTypes.object,
  nodeColors: PropTypes.object,
};

VolumeHistogram.defaultProps = {
  data: [],
  dateOptions: {
    month: 'short',
    day: 'numeric',
  },
  nodeColors: {},
};

export default VolumeHistogram;
