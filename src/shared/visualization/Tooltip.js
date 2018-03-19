import React from 'react';
import PropTypes from 'prop-types';


const Tooltip = (props) => {
  const styles = props.style || {};
  styles.fontSize = '1.5rem';
  styles.padding = '0.5rem';
  const minWidth = Math.min(
    (props.textLines.map(line => line.text).join('').length) / props.textLines.length,
    20
  );
  styles.minWidth = `${minWidth / 2}em`;
  return (<div style={styles}>
    <div style={{ fontWeight: 'bolder', textAlign: 'center' }}>
      {props.title}
    </div>
    {props.textLines.map((lineObj, i) =>
      <div key={`textLine-${i}`} style={{ color: lineObj.color }}>{lineObj.text}</div>
    )}
  </div>);
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
