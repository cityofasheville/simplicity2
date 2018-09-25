import React from 'react';
import PropTypes from 'prop-types';
import { Legend, ResponsiveOrdinalFrame } from 'semiotic';
import { color } from 'd3-color';
import Tooltip from '../../../shared/visualization/Tooltip';
import {
  openedOnlineRule,
  splitOrdinalByBool,
} from './granularUtils';

const BooleanSplitMultiples = (props) => {
  const openedOnline = splitOrdinalByBool(props.histogramData, openedOnlineRule, 'openedOnline');
  return (
    <div
      style={{
        textTransform: 'capitalize',
      }}
    >
      {props.entriesHierarchy.map((node) => {
        const thisColor = node.color;
        const brighterColor = color(thisColor).brighter(1.25);
        const thisData = openedOnline.filter(d => d.key === node.key);
        const margins = {
          top: 40,
          right: 10,
          bottom: 35,
          left: 25,
        }

        let numOnline = 0;
        let numInPerson = 0;
        thisData.forEach(nodeDay => {
          nodeDay.openedOnline ? numOnline += nodeDay.count : numInPerson += nodeDay.count;
        })

        return (<div
          style={{ display: 'inline-block' }}
          key={node.key}
          className="col-md-4"
        >
          <ResponsiveOrdinalFrame
            size={[185, 185]}
            responsiveWidth
            margin={margins}
            oPadding={1}
            oAccessor="binStartDate"
            rAccessor="count"
            rExtent={[0, 50]}
            type="bar"
            canvasPieces
            pieceIDAccessor="key"
            axis={[
              {
                orient: 'left',
                tickFormat: d => (
                  <text
                    textAnchor="end"
                    style={{ fontSize: '0.70em' }}
                  >
                    {d}
                  </text>
                ),
              },
            ]}
            hoverAnnotation
            tooltipContent={(d) => {
              const pieces = d.type === 'column-hover' ? d.pieces : [d.data];
              const title = new Date(pieces[0].binStartDate).toLocaleDateString('en-US');

              const textLines = pieces.map(piece => ({
                text: `${piece.openedOnline ? 'Online' : 'In Person'}: ${piece.count}`,
                color: thisColor,
              })).reverse();

              return (<Tooltip
                title={title}
                textLines={textLines}
              />);
            }}
            oLabel={(d, pieces, i) => {
              if (i % 5 !== 0) { return null }
              const dateString = new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              return (
                <text
                  textAnchor="end"
                  transform="rotate(-35)"
                  style={{ fontSize: '0.70em' }}
                >
                  {dateString}
                </text>
              );
            }}
            data={thisData}
            title={node.key}
            style={(d) => {
              if (d.count === 0) {
                return {
                  fill: 'none',
                  stroke: 'none',
                };
              }
              return {
                fill: d.openedOnline ? thisColor : brighterColor,
                stroke: thisColor,
                strokeWidth: 0.25,
              };
            }}
          />
          <svg style={{ height: 100, width: 185, fontSize: '0.75em'}}>
            <g transform={`translate(${margins.left},-10)`}>
              <Legend
                legendGroups={[
                  {
                    styleFn: (d) => ({ fill: d.color, stroke: thisColor }),
                    items: [
                      { label: `Online: ${numOnline}`, color: thisColor },
                      { label: `In Person: ${numInPerson}`, color: brighterColor },
                    ]
                  }
                ]}
                title=""
            />
            </g>
          </svg>
        </div>);
      })}
    </div>
  )
}

BooleanSplitMultiples.propTypes = {
};

BooleanSplitMultiples.defaultProps = {
};

export default BooleanSplitMultiples;
