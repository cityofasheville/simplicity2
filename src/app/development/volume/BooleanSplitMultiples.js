import React from 'react';
import PropTypes from 'prop-types';
import { Legend, ResponsiveOrdinalFrame } from 'semiotic';
import { color } from 'd3-color';
import { max } from 'd3-array';
import Tooltip from '../../../shared/visualization/Tooltip';
import {
  openedOnlineRule,
  splitOrdinalByBool,
  multiplesTitle,
} from './granularUtils';

const BooleanSplitMultiples = (props) => {
  const openedOnline = splitOrdinalByBool(
    props.histogramData,
    openedOnlineRule,
    'openedOnline',
  );
  const maxRExtent = max(props.histogramData.map(v => +v.count)) + 5
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
          top: 45,
          right: 10,
          bottom: 45,
          left: 40,
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
        const title = multiplesTitle(node)

        return (<div
          style={{ display: 'inline-block' }}
          key={`${node.key}-${node.heritage.join('-')}`}
          className="col-md-4"
        >
          <div className="visualization-title">{title}</div>
          <ResponsiveOrdinalFrame
            size={[185, 200]}
            responsiveWidth
            margin={margins}
            oPadding={3}
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
              const title = props.timeFormatter(new Date(pieces[0].binStartDate), true);

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
              if (i % 2 !== 0) { return null; }
              const dateString = props.timeFormatter(new Date(d));
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
