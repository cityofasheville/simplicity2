import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const orderedDates = [
  {
    accelaLabel: 'Pre-App Date',
    displayLabel: 'Pre-application meeting'
  },
  {
    accelaLabel: 'Neighborhood Meeting Date',
    displayLabel: 'Neighborhood meeting',
  },
  {
    accelaLabel: 'Initial TRC Date 1',
    displayLabel: 'Technical review committee meeting',
  },
  {
    accelaLabel: 'Initial TRC Date 2',
    displayLabel: 'Technical review committee meeting (revised materials)',
  },
  {
    accelaLabel: 'Initial TRC Date 3',
    displayLabel: 'Technical review committee meeting (revised materials)',
  },
  {
    accelaLabel: 'DTC Date 1',
    displayLabel: 'Downtown Commission meeting',
  },
  {
    accelaLabel: 'DTC Date 2',
    displayLabel: 'Downtown Commission meeting (revised materials)',
  },
  {
    accelaLabel: 'PZC Date 1',
    displayLabel: 'Planning and Zoning commission meeting',
  },
  {
    accelaLabel: 'PZC Date 2',
    displayLabel: 'Planning and Zoning commission meeting (revised materials)',
  },
  {
    accelaLabel: 'Final TRC Date 1',
    displayLabel: 'Technical review committee meeting (revised materials)',
  },
  {
    accelaLabel: 'Final TRC Date 2',
    displayLabel: 'Technical review committee meeting (revised materials)',
  },
  {
    accelaLabel: 'City Council Date 1',
    displayLabel: 'City Council meeting',
  },
  {
    accelaLabel: 'City Council Date 2',
    displayLabel: 'City Council meeting (revised materials)',
  },
];


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
    const pointRadius = 20;
    const midpointX = dimensions.width / 2;

    const theseDates = orderedDates
      .filter(dateObject => this.props.formattedPermit[dateObject.accelaLabel])
      .map(dateObject =>
        Object.assign(
          {},
          dateObject,
          {
            dateInput: this.props.formattedPermit[dateObject.accelaLabel],
            // dateValue: this.props.formattedPermit[dateObject.accelaLabel] ?
            //   moment(this.props.formattedPermit[dateObject.accelaLabel]).valueOf() :
            //   undefined,
          }
        )
      )//.sort((a, b) => a.dateValue - b.dateValue);
    // TODO: SORT THEM AUTOMATICALLY OR NO?
    const eachWidth = (dimensions.width - (padding + padding * theseDates.length)) / theseDates.length;
    const midRowIndex = (theseDates.length - 1) / 2;
    const getX = (dateObj, i) =>
      midpointX + ((i % theseDates.length) - midRowIndex) * (padding + eachWidth);

    const showLabels = eachWidth > 80;

    return (
      <svg height={dimensions.height} width={dimensions.width}>
        {theseDates.map((d, i, datesArray) => {
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
      <div ref={(el) => { this.container = el; }} style={{ height: '200px', width: '100%' }}>
        {dimensions && this.renderContent()}
      </div>
    );
  }
}

export default Timeline;
