import React from 'react';
import PropTypes from 'prop-types';
import { histogram } from 'd3-array';
import { nest } from 'd3-collection';
import { scaleLinear } from 'd3-scale';
import { ResponsiveOrdinalFrame } from 'semiotic';
import Tooltip from '../../../shared/visualization/Tooltip';
import { groupStatuses } from './granularUtils';

function dotBin(input) {
  const renderedPieces = [];
  const keys = Object.keys(input.data);

  {/* Make shared extent with FacetController after issue is fixed */}

  const radiusFunc = scaleLinear()
    // TODO: DETERMINE RANGE PROGRAMMATICALLY
    .range([2, 10])
    .domain([0, input.type.maxRadius]);

  keys.forEach(key => {
    const column = input.data[key];
    const circles = {}

    const circleArray = column.pieceData
      .filter(pieceDatum => pieceDatum.data.count > 0)
      .map((pieceDatum) => {
        return <circle
          key={pieceDatum.renderKey}
          r={radiusFunc(pieceDatum.data.count)}
          cx={pieceDatum.scaledValue}
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
    const statusNest = nest().key(d => d.status_current);

    const filteredStatuses = this.props.selectedNodes.map(hierarchyObj => {
      const rObj = Object.assign({}, hierarchyObj);
      rObj.values = groupStatuses(hierarchyObj.selectedActiveValues)
      rObj.histByStatus = [].concat(...statusNest.entries(rObj.values).map(status => {
        const histBuckets = this.histFunc(status.values).map(bucket => {
          const histBucket = Object.assign({}, bucket)
          histBucket.key = status.key
          histBucket.count = bucket.length;
          return histBucket
        })
        return histBuckets;
      }))
      return rObj;
    });

    const maxRadius = filteredStatuses.map(d => d.histByStatus.map(datum => datum.count).sort((a, b) => b - a)[0])[0]

    return (<div
      style={{
        textTransform: 'capitalize',
      }}
    >
      {filteredStatuses.map((datum) => {
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
              right: 10,
              bottom: 55,
              left: 150,
            }}
            oPadding={5}
            oAccessor={d => d.key || 'No Status'}
            oLabel={(d) => {
              const fontSize = '0.65'
              return (
                <text
                  textAnchor="end"
                  transform="translate(-10,0)"
                  style={{ fontSize: `${fontSize}em` }}
                >
                  {d}
                </text>
              );
            }}
            type={{
              type: dotBin,
              style: {
                fill: datum.color,
                stroke: datum.color,
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
            rAccessor={d => new Date(d.x0)}
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
            data={datum.histByStatus}
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
  selectedNodes: PropTypes.arrayOf(PropTypes.object),
  dateField: PropTypes.string,
  includedDates: PropTypes.arrayOf(PropTypes.object),
};

StatusDistributionMultiples.defaultProps = {
};

export default StatusDistributionMultiples;
