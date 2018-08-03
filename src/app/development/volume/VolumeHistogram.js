import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveOrdinalFrame } from 'semiotic';
import Tooltip from '../../../shared/visualization/Tooltip';


const VolumeHistogram = props => (
  <ResponsiveOrdinalFrame
    responsiveWidth
    data={props.data}
    size={[500, 200]}
    projection="vertical"
    type="bar"
    margin={{
      top: 10,
      right: 10,
      bottom: 60,
      left: 20,
    }}
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
    style={d => ({ fill: props.nodeColors[d.key] })}
    hoverAnnotation
    tooltipContent={d => d.key}
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
  nodeColors: [],
};

export default VolumeHistogram;
