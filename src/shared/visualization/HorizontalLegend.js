import React from 'react';
import PropTypes from 'prop-types';


const HorizontalLegend = (props) => {
  const rectWidth = 15;

  const labelItems = JSON.parse(JSON.stringify(props.formattedData))
    .filter((item, pos, thisArray) =>
      // Limit it to just the first occurrence
      pos === thisArray.findIndex(d => d.label === item.label && d.color === item.color)
    ).map((item) => {
      item.sum = props.formattedData
        .filter(d => d.label === item.label)
        .reduce((total, num) => {
          const returnObj = {};
          returnObj[props.valueAccessor] = total[props.valueAccessor] + num.value;
          return returnObj;
        });
      return item;
    }).sort((a, b) => b.sum[props.valueAccessor] - a.sum[props.valueAccessor]);

  return (<div
    style={props.style}
  >
    {labelItems.map((item, index) => {
      const label = props.legendLabelFormatter(item.label);
      return (<div
        key={`${label}-legendItem-${index}`}
        style={{
          padding: `0px ${rectWidth / 3}px 0px 0px`,
          whiteSpace: 'normal',
          display: 'inline-block',
          textAlign: 'left',
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
        <span>
          {label}
        </span>
      </div>);
    })}
  </div>);
};

HorizontalLegend.propTypes = {
  formattedData: PropTypes.arrayOf(PropTypes.object),
  legendLabelFormatter: PropTypes.func,
  valueAccessor: PropTypes.string,
};

HorizontalLegend.defaultProps = {
  legendLabelFormatter: d => d,
  valueAccessor: 'value',
};

export default HorizontalLegend;
