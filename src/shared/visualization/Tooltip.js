import React from 'react';
import PropTypes from 'prop-types';


const Tooltip = (props) => {
  const styles = props.style || {};
  styles.padding = '0.35rem';
  styles.letterSpacing = '0.015rem'
  const minWidth = Math.min(
    (props.textLines.map(line => line.text).join('').length + 1) / props.textLines.length,
    10
  );
  styles.minWidth = `${minWidth}em`;
  return (<span style={styles} className="tooltip">
    <div style={{ textAlign: 'center' }}>
      {props.title}
    </div>
    {props.textLines.map((lineObj, i) =>
      <div key={`textLine-${i}`} style={{ color: lineObj.color }}>{lineObj.text}</div>
    )}
  </span>);
};

Tooltip.propTypes = {
  textLines: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Tooltip.defaultProps = {
  textLines: [],
  title: '',
};

export default Tooltip;
