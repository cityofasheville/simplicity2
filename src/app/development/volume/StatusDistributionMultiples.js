import React from 'react';
import PropTypes from 'prop-types';
import { nest } from 'd3-collection';
import { scaleLinear } from 'd3-scale';
import { histogram } from 'd3-array';
import { ResponsiveOrdinalFrame } from 'semiotic';
import Tooltip from '../../../shared/visualization/Tooltip';
import { groupStatuses, dateComparisonOpts } from './granularUtils';

function dotBin(input) {
  const renderedPieces = [];
  const keys = Object.keys(input.data);

  const radiusFunc = scaleLinear()
    .range([2, 8])
    .domain([0, input.type.maxRadius]);

  keys.forEach(key => {
    const column = input.data[key];
    const circles = {}
    column.pieceData.forEach(pieceDatum => {
      const thisDate = new Date(pieceDatum.value).toLocaleDateString('en-US', dateComparisonOpts)
      if (circles[thisDate]) {
        circles[thisDate].push(pieceDatum)
      } else {
        circles[thisDate] = [pieceDatum]
      }
    })

    const circleArray = Object.keys(circles).map((circleKey) => {
      return <circle
        key={`piece-${key}-${circleKey}`}
        r={radiusFunc(circles[circleKey].length)}
        cx={input.rScale(new Date(circleKey))}
        cy={column.middle - column.padding}
        style={input.type.style}
        // onMouseOver={(e) => input.type.mouseOver(circleKey, circles[circleKey], e)}
      ></circle>
    })

    const dotArray = (
      <g
        key={`piece-${key}`}
        // onMouseOut={() => input.type.mouseOut()}
      >
        {circleArray}
      </g>
    );
    renderedPieces.push(dotArray);
  });
  return renderedPieces;
}


class StatusDistributionMultiples extends React.Component {
  constructor(props) {
    super(props)

    this.histFunc = histogram()
      .value(d => new Date(d[this.props.dateField]))
      .thresholds(this.props.includedDates)
      .domain([
        this.props.includedDates[0],
        this.props.includedDates[this.props.includedDates.length - 1],
      ]);

    this.state = {
      // tooltip: {
      //   coords: [0, 0],
      //   opacity: 0,
      //   title: '',
      //   data: [],
      // }
    }
  }

  render() {
    const filteredStatuses = [];
    let maxRadius = 0;
    const statusNest = nest().key(d => d.status_current);
    this.props.entriesHierarchy.forEach(hierarchyObj => {
      const rObj = Object.assign({}, hierarchyObj);
      rObj.values = groupStatuses(hierarchyObj.values)
      rObj.valuesByStatus = statusNest.entries(rObj.values).sort((a, b) => (b.values.length - a.values.length))
      rObj.histByStatus = rObj.valuesByStatus.map(status => {
        const statusRObj = Object.assign({}, status);
        statusRObj.values = this.histFunc(statusRObj.values);
        const maxRadiusCandidate = statusRObj.values.map(day => day.length).sort((a, b) => b - a)[0];
        maxRadius = maxRadiusCandidate > maxRadius ? maxRadiusCandidate : maxRadius;
        return statusRObj;
      });
      filteredStatuses.push(rObj);
    });

    console.log(filteredStatuses)

    return (<div
      style={{
        textTransform: 'capitalize',
      }}
    >
      {filteredStatuses.map((datum) => {
        console.log(datum)
        return (<div
          className="col-md-6"
          style={{ display: 'inline-block' }}
          key={datum.key}
        >
          <ResponsiveOrdinalFrame
            projection="horizontal"
            size={[300, 300]}
            responsiveWidth
            margin={{
              top: 45,
              right: 0,
              bottom: 55,
              left: 150,
            }}
            oPadding={5}
            oAccessor={d => d.status_current || 'No Status'}
            oLabel={(d) => {
              const fontSize = '0.65'
              return (
                <text
                  textAnchor="end"
                  style={{ fontSize: `${fontSize}em` }}
                >
                  {d}
                </text>
              );
            }}
            type={{
              type: dotBin,
              style: {
                fill: this.props.nodeColors[datum.key],
                stroke: this.props.nodeColors[datum.key],
                fillOpacity: 0.5,
              },
              maxRadius: maxRadius,
              // mouseOver: (k, d, e) => {
              //   this.setState({
              //     tooltip: {
              //       title: k,
              //       data: d,
              //       coords: [e.pageX, e.pageY],
              //       opacity: 1,
              //     }
              //   })
              // },
              // mouseOut: () => this.setState({
              //   tooltip: {
              //     opacity: 0,
              //     data: [],
              //     coords: [0, 0]
              //   }
              // })
            }}
            rAccessor={d => new Date(d[this.props.dateField])}
            rExtent={[
              this.props.includedDates[0],
              this.props.includedDates[this.props.includedDates.length - 1],
            ]}
            pieceIDAccessor="key"
            axis={[
              {
                orient: 'bottom',
                tickFormat: d => (
                  <text
                    textAnchor="end"
                    transform="translate(0,-10)rotate(-35)"
                    style={{ fontSize: '0.65em' }}
                  >
                    {new Date(d).toLocaleDateString(
                      'en-US',
                      { month: 'short', day: 'numeric' }
                    )}
                  </text>
                ),
                tickValues: this.props.includedDates.filter((tick, i) => i % 2 === 0),
              },
            ]}
            key={datum.key}
            data={datum.values}
            title={datum.key}
          />
        </div>
        );
      })}
      {/* <Tooltip */}
      {/*   title={this.state.tooltip.title} */}
      {/*   textLines={[{ text: this.state.tooltip.data.length }]} */}
      {/*   style={{ */}
      {/*     opacity: this.state.tooltip.opacity, */}
      {/*     position: 'absolute', */}
      {/*     left: this.state.tooltip.coords[0], */}
      {/*     top: this.state.tooltip.coords[1] */}
      {/*   }} */}
      {/* /> */}
    </div>)
  }


}

StatusDistributionMultiples.propTypes = {
  entriesHierarchy: PropTypes.arrayOf(PropTypes.object),
  nodeColors: PropTypes.object,
  dateField: PropTypes.string,
  includedDates: PropTypes.arrayOf(PropTypes.object),
};

StatusDistributionMultiples.defaultProps = {
};

export default StatusDistributionMultiples;
