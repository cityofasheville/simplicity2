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

    return <div style={styles} >
      {this.props.items.map((item, index, originalArr) => {
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
    items: PropTypes.arrayOf(PropTypes.object),
    legendLabelFormatter: PropTypes.func,
    /* Array format of [
        {
            label: "blabalbla",
            color: "blablabla"
        },
    ] */
}

HorizontalLegend.defaultProps = {
    items: [],
    legendLabelFormatter: d => d,
}

export default HorizontalLegend;




