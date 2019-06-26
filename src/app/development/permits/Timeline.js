import React from 'react';
import PropTypes from 'prop-types';


class Timeline extends React.Component {
  constructor() {
    super();

    this.state = {
      dimensions: null,
    };
  }

  updateDimensions() {
    this.setState({
      dimensions: {
        width: this.container.offsetWidth,
        height: this.container.offsetHeight,
      },
    });
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  renderContent() {
    const { dimensions } = this.state;
    const padding = dimensions.height / 10;
    const pointRadius = 10;
    const midpointX = dimensions.width / 2;
    const eachWidth = (dimensions.width - (padding + padding * this.props.formattedPermit.orderedDates.length)) / this.props.formattedPermit.orderedDates.length;
    const midRowIndex = (this.props.formattedPermit.orderedDates.length - 1) / 2;
    const getX = (dateObj, i) =>
      midpointX + ((i % this.props.formattedPermit.orderedDates.length) - midRowIndex) * (padding + eachWidth);

    const showLabels = eachWidth > 80;

    return (
      <svg height={dimensions.height} width={dimensions.width}>
        {this.props.formattedPermit.orderedDates.map((d, i, datesArray) => {
          const thisX = getX(d, i);
          const circleY = padding + pointRadius;
          return (<g key={d.accelaLabel}>
            <circle
              cx={thisX}
              cy={circleY}
              r="16"
              fill={this.props.formattedPermit.trcType.color}
            />
            {i > 0 &&
              <path
                d={`M${getX(datesArray[i - 1], i - 1)} ${circleY} L${thisX} ${circleY} z`}
                stroke={this.props.formattedPermit.trcType.color}
                strokeWidth="3px"
              />
            }
            <foreignObject
              x={thisX - (eachWidth / 2)}
              y={padding * 2 + pointRadius}
              width={eachWidth}
              height={dimensions.height - (padding * 3 + pointRadius)}
              style={{ overflow: 'visible' }}
            >
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <div>{d.dateInput}</div>
                <div>{d.displayLabel}</div>
              </div>
            </foreignObject>
          </g>)
        })}
      </svg>
    );
  }

  render() {
    const { dimensions } = this.state;
    return (
      <div ref={(el) => { this.container = el; }} style={{ height: '100px', width: '100%' }}>
        {dimensions && this.renderContent()}
      </div>
    );
  }
}

export default Timeline;
