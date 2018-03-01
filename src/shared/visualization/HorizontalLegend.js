import React from 'react';


const HorizontalLegend = (formattedData, legendLabelFormatter, inputStyle) => {
  const styles = inputStyle || {
    width: '100%',
  };
  styles.textAlign = 'center';
  const rectWidth = 15;

  const labelItems = JSON.parse(JSON.stringify(formattedData))
    .filter((item, pos, thisArray) =>
      // Limit it to just the first occurrence
      pos === thisArray.findIndex(d => d.label === item.label && d.color === item.color)
    ).map((item) => {
      item.value = formattedData.reduce((total, num) => total + num.value);
      return item;
    }).sort((a, b) => b.value - a.value);

  return (<div
    style={styles}
  >
    {labelItems.map((item, index) => {
      const label = legendLabelFormatter(item.label);
      return (<div
        key={`${label}-legendItem-${index}`}
        style={{
          margin: `0px ${rectWidth / 3}px 0px 0px`,
          whiteSpace: 'normal',
          display: 'inline-block',
        }}
      >
        <svg
          height={rectWidth}
          width={rectWidth}
          style={{
            margin: `0px ${rectWidth / 4}px`,
          }}
        >
          <rect
            style={{
              fill: item.color,
            }}
            x={0}
            y={0}
            width={rectWidth}
            height={rectWidth}
          />
        </svg>
        <text>
          {label}
        </text>
      </div>);
    })}
  </div>);
};

export default HorizontalLegend;
