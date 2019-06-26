import React from 'react';
import PropTypes from 'prop-types';


class Timeline extends React.Component {
  constructor() {
    super();

    this.state = {
      dimensions: null,
    };
    this.container = null;
  }

  updateDimensions() {
    if (!this.container) {
      return;
    }
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
    let datesToUse = this.props.formattedPermit.orderedDates;
    if (datesToUse.length === 1) {
      datesToUse = this.props.formattedPermit.orderedDates
        .concat([{
          accelaLabel: 'dummy',
          dateInput: '',
          displayLabel: '',
        }]);
    }

    const eachWidth = (dimensions.width - (padding + padding * datesToUse.length)) / datesToUse.length;
    const midRowIndex = (datesToUse.length - 1) / 2;
    const getX = (dateObj, i) =>
      midpointX + ((i % datesToUse.length) - midRowIndex) * (padding + eachWidth);

    const showLabels = eachWidth > 80;

    return (
      <svg height={dimensions.height} width={dimensions.width}>
        {datesToUse.map((d, i, datesArray) => {
          const thisX = getX(d, i);
          const circleY = padding + pointRadius;
          return (<g key={d.accelaLabel}>
            {d.accelaLabel !== 'dummy' && <circle
              cx={thisX}
              cy={circleY}
              r={pointRadius}
              fill={this.props.formattedPermit.trcType.color}
            />}
            {d.accelaLabel === 'dummy' && <path
              d={`M${thisX},${circleY - pointRadius / 2} L${thisX},${circleY + pointRadius / 2} L${thisX + pointRadius},${circleY} z`}
              fill={this.props.formattedPermit.trcType.color}
            />}
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
                <div>{this.props.dateFormatter(d.dateInput)}</div>
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
      <div ref={(el) => { this.container = el; }} style={{ height: '150px', width: '100%' }}>
        {dimensions && this.renderContent()}
      </div>
    );
  }
}

export default Timeline;
