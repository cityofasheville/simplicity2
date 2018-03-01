import React from 'react';
import PropTypes from 'prop-types';


class HorizontalLegend extends React.Component {

  constructor() {
    super()
  }

  render() {
    const styles = this.props.style || {
      width: '100%'
    }
    styles.textAlign = 'center'
    const rectWidth = 15

    const labelItems = this.props.formattedData
      .filter((item, pos, thisArray) =>
        // Limit it to just the first occurrence
        pos === thisArray.findIndex(d => d.label === item.label && d.color === item.color)
      ).sort((a, b) => a.value - b.value)

    return <div
      style={styles}
    >
      {labelItems.map((item, index, originalArr) => {
        const label = this.props.legendLabelFormatter(item.label)
        return <div
          key={label + "-legendItem-" + index}
          style={{
            margin: `0px ${rectWidth/3}px 0px 0px`,
            whiteSpace: 'normal',
            display: 'inline-block'
          }}
        >
          <svg
            height={rectWidth}
            width={rectWidth}
            style={{
              margin: `0px ${rectWidth/4}px`
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
          <text
          >
            {label}
          </text>
        </div>
      })}
    </div>
  }
}

HorizontalLegend.propTypes = {
    formattedData: PropTypes.arrayOf(PropTypes.object),
    legendLabelFormatter: PropTypes.func,
}

HorizontalLegend.defaultProps = {
    items: [],
    legendLabelFormatter: d => d,
}

export default HorizontalLegend;




