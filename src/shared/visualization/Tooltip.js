import React from 'react';


const Tooltip = (textLines, title, style) => {
  const styles = style || {};
  styles.fontSize = '1.5rem';
  styles.padding = '0.5rem';
  const minWidth = Math.min(
    (textLines.map(line => line.text).join('').length + 0.5) / textLines.length,
    20
  );
  styles.minWidth = `${minWidth}rem`;
  return (<div style={styles}>
    <div style={{ fontWeight: 'bolder', textAlign: 'center' }}>
      {title}
    </div>
    {textLines.map((lineObj, i) =>
      <div key={`textLine-${i}`} style={{ color: lineObj.color }}>{lineObj.text}</div>
    )}
  </div>);
};

export default Tooltip;
