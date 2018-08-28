import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveOrdinalFrame } from 'semiotic';
import { dotBin } from './granularUtils';


const StatusDistributionMultiples = props => (
  <div
    style={{
      textTransform: 'capitalize',
    }}
  >
    {props.filteredStatuses.map((datum) => {
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
              fill: props.nodeColors[datum.key],
              stroke: props.nodeColors[datum.key],
              fillOpacity: 0.5,
            },
            maxRadius: props.maxRadius
          }}
          rAccessor={d => new Date(d[props.dateField])}
          rExtent={[
            props.includedDates[0],
            props.includedDates[props.includedDates.length - 1],
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
              tickValues: props.includedDates.filter((tick, i) => i % 2 === 0),
            },
          ]}
          key={datum.key}
          data={datum.values}
          title={datum.key}
        />
      </div>
      );
    })}
  </div>
)

StatusDistributionMultiples.propTypes = {
};

StatusDistributionMultiples.defaultProps = {
};

export default StatusDistributionMultiples;


