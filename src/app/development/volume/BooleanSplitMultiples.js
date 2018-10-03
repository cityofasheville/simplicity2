import React from 'react';
import PropTypes from 'prop-types';
import { Legend, ResponsiveOrdinalFrame } from 'semiotic';
import { color } from 'd3-color';
import { max } from 'd3-array';
import Tooltip from '../../../shared/visualization/Tooltip';
import {
  openedOnlineRule,
  splitOrdinalByBool,
} from './granularUtils';

const BooleanSplitMultiples = (props) => {
  const openedOnline = splitOrdinalByBool(
    props.histogramData,
    openedOnlineRule,
    'openedOnline',
  );
  const maxRExtent = max(openedOnline.map(v => +v.count)) + 5
  return (
    <div
      style={{
        textTransform: 'capitalize',
      }}
    >
      {props.selectedNodes.map((node) => {
        const thisColor = node.color;
        const brighterColor = color(thisColor).brighter(1.25);
        // PREVENT THINGS WITH SAME NAME FROM GETTING ADDED TOGETHER by adding heritage
        const thisData = openedOnline.filter(d =>
          d.key === node.key && d.heritage.join() === node.heritage.join());
        const margins = {
          top: 40,
          right: 10,
          bottom: 35,
          left: 25,
        };

        let numOnline = 0;
        let numInPerson = 0;
        thisData.forEach((nodeDay) => {
          if (nodeDay.openedOnline) {
            numOnline += nodeDay.count;
          } else {
            numInPerson += nodeDay.count;
          }
        });
        const slicedHeritage = node.heritage.slice(1)
        const title = slicedHeritage.length > 0 ?
          `${node.heritage.slice(1).join(' > ')} > ${node.key}`
          : `${node.key}`;

        return (<div
          style={{ display: 'inline-block' }}
          key={`${node.key}-${node.heritage.join('-')}`}
          className="col-md-4"
        >
          <ResponsiveOrdinalFrame
            size={[185, 185]}
            responsiveWidth
            margin={margins}
            oPadding={1}
            oAccessor="binStartDate"
            rAccessor="count"
            rExtent={[0, maxRExtent]}
            type="bar"
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
              if (i % 5 !== 0) { return null; }
              const dateString = new Date(d)
                .toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
            title={title}
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
          <svg style={{ height: 100, width: 185, fontSize: '0.75em' }} >
            <g transform={`translate(${margins.left},-10)`}>
              <Legend
                legendGroups={[
                  {
                    styleFn: d => ({ fill: d.color, stroke: thisColor }),
                    items: [
                      { label: `Online: ${numOnline}`, color: thisColor },
                      { label: `In Person: ${numInPerson}`, color: brighterColor },
                    ],
                  },
                ]}
                title=""
              />
            </g>
          </svg>
        </div>);
      })}
    </div>
  );
};

BooleanSplitMultiples.propTypes = {
};

BooleanSplitMultiples.defaultProps = {
};

export default BooleanSplitMultiples;
