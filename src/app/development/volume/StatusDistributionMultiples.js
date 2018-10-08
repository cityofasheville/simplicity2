import React from 'react';
import PropTypes from 'prop-types';
import { histogram } from 'd3-array';
import { nest } from 'd3-collection';
import { ResponsiveOrdinalFrame } from 'semiotic';
import Tooltip from '../../../shared/visualization/Tooltip';
import {
  groupStatuses,
  multiplesTitle,
  getHistDomain,
 } from './granularUtils';
import dotBinLayout from './dotBinLayout';

class StatusDistributionMultiples extends React.Component {
  constructor(props) {
    super(props)

    const domain = getHistDomain([
      this.props.includedDates[0],
      this.props.includedDates[this.props.includedDates.length - 1],
    ])

    this.histFunc = histogram()
      .value(d => new Date(d[this.props.dateField]))
      .thresholds(this.props.includedDates)
      .domain(domain);
  }

  render() {
    // TODO: make this a granular util?  break up the granular util hist method to use this or something?
    const statusNest = nest().key(d => d.status_current);
    const filteredStatuses = this.props.selectedNodes.map(hierarchyObj => {
      const rObj = Object.assign({}, hierarchyObj);
      rObj.values = groupStatuses(hierarchyObj.selectedActiveValues)
      rObj.histByStatus = [].concat(...statusNest.entries(rObj.values).map(status => {
        const histBuckets = this.histFunc(status.values)
          .map(bucket => {
            const histBucket = Object.assign({}, bucket)
            histBucket.key = status.key
            histBucket.count = bucket.length;
            return histBucket
          })
        return histBuckets;
      }))
      return rObj;
    });

    const maxRadius = filteredStatuses.map(d =>
      d.histByStatus.map(datum => datum.count)
        .sort((a, b) => b - a)[0]
    )[0];

    // TODO: WHY ARE DATES SCREWY?

    return (<div
      style={{
        textTransform: 'capitalize',
      }}
    >
      {filteredStatuses.map((datum) => {
        const title = multiplesTitle(datum)
        return (<div
          className="col-md-6"
          style={{ display: 'inline-block' }}
          key={title}
        >
          <div className="visualization-title">{title}</div>
          <ResponsiveOrdinalFrame
            pieceHoverAnnotation
            htmlAnnotationRules={d => {
              if (!d.d.type === 'frame-hover') {
                return null;
              }
              const datum = d.d;
              const title = this.props.timeFormatter(datum.value, true);
              const textLine = `${datum.column}: ${datum.data.count}`;
              return (<Tooltip
                title={title}
                textLines={[{ text: textLine }]}
                key={title + textLine}
                style={{
                  position: 'absolute',
                  top: datum.y,
                  left: datum.x,
                  textTransform: 'capitalize',
                }}
              />)
            }}
            projection="horizontal"
            size={[300, 300]}
            responsiveWidth
            margin={{
              top: 45,
              right: 20,
              bottom: 55,
              left: 150,
            }}
            oPadding={2}
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
              type: dotBinLayout,
              style: {
                fill: datum.color,
                stroke: datum.color,
                fillOpacity: 0.5,
              },
              maxRadiusVal: maxRadius,
              maxRadius: 15,
            }}
            rAccessor={d => new Date(d.x0)}
            rExtent={[
              this.props.includedDates[0],
              // TODO: why tho
              this.props.includedDates[this.props.includedDates.length - 1],
            ]}
            pieceIDAccessor={d => {
              const timeVal = new Date(d.x0).getTime()
              return `${timeVal}-${d.key.replace('', '-')}`}}
            axis={[
              {
                orient: 'bottom',
                tickFormat: (d, i) => (
                  <text
                    textAnchor="end"
                    transform="translate(0,-10)rotate(-35)"
                    style={{ fontSize: '0.65em' }}
                  >
                    {this.props.timeFormatter(new Date(d))}
                  </text>
                ),
                tickValues: this.props.includedDates,
              },
            ]}
            data={datum.histByStatus}
          />
        </div>
        );
      })}
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
