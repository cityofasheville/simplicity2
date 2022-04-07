import React from 'react';
import PropTypes from 'prop-types';


class PermitTimeline extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dimensions: null,
    };
    this.updateDimensions = this.updateDimensions.bind(this);
    console.log(props);
  }

  updateDimensions() {
    const container = document.getElementById('permit-timeline-container').getBoundingClientRect();
    this.setState({
      dimensions: {
        width: container.width,
        height: container.height,
      },
    });
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
    this.updateDimensions();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  renderContent() {
    const { dimensions } = this.state;
    const padding = 15;
    const pointRadius = 8;
    let datesToUse = this.props.formattedPermit.orderedDates;
    if (this.props.currentStatusItem !== undefined && !this.props.currentStatusItem.closed) {
      datesToUse = this.props.formattedPermit.orderedDates
        .concat([{
          accelaLabel: 'dummy',
          dateInput: null,
          displayLabel: '',
        }]);
    }
    const timelineWidth = Math.max(datesToUse.length * 125, dimensions.width - padding);
    const midpointX = timelineWidth / 2;
    const eachWidth = (timelineWidth - (padding + padding * datesToUse.length)) / datesToUse.length;
    const midRowIndex = (datesToUse.length - 1) / 2;
    const getX = (dateObj, i) =>
      midpointX + ((i % datesToUse.length) - midRowIndex) * (padding + eachWidth);

    return (
      <svg height={dimensions.height} width={timelineWidth}>
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
            {d.dateInput && <foreignObject
              x={thisX - (eachWidth / 2)}
              y={padding * 2 + pointRadius}
              width={eachWidth}
              height={dimensions.height - (padding * 3 + pointRadius)}
              style={{ overflow: 'visible' }}
            >
              <div style={{ textAlign: 'center', padding: '0.5rem', fontSize: '0.75rem' }}>
                <div>{this.props.dateFormatter(d.dateInput)}</div>
                <div>{d.displayLabel}</div>
              </div>
            </foreignObject>}
          </g>)
        })}
      </svg>
    );
  }

  render() {
    const { dimensions } = this.state;
    return (
      <div id="permit-timeline-container">
        <div style={{ padding: '0.25rem 0.25rem 0.5rem 0', fontWeight: '500' }}>Where is it in the process?</div>
        {dimensions && this.renderContent()}
      </div>
    );
  }
}

export default PermitTimeline;
