import React from 'react';
import PropTypes from 'prop-types';
import { Legend, ResponsiveOrdinalFrame } from 'semiotic';
import { color } from 'd3-color';


const BooleanSplitMultiples = props => (
  <div
    style={{
      textTransform: 'capitalize',
    }}
  >
    {props.entriesHierarchy.map((datum) => {
      const brighterColor = color(props.nodeColors[datum.key]).brighter(1.25);
      const thisData = props.openedOnline.filter(d => d.key === datum.key);
      const margins = {
        top: 40,
        right: 10,
        bottom: 35,
        left: 25,
      }

      let numOnline = 0;
      let numInPerson = 0;
      thisData.forEach(datumDay => {
        datumDay.openedOnline ? numOnline += datumDay.count : numInPerson += datumDay.count;
      })

      return (<div
        style={{ display: 'inline-block' }}
        key={datum.key}
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
              color: props.nodeColors[piece.key],
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
          title={datum.key}
          style={d => {
            return {
              fill: d.openedOnline ? props.nodeColors[datum.key] : brighterColor,
              stroke: props.nodeColors[datum.key],
              strokeWidth: 0.25,
              opacity: d.count > 0 ? 1 : 0,
            };
          }}
        />
        <svg style={{ height: 100, width: 185, fontSize: '0.75em'}}>
          <g transform={`translate(${margins.left},-10)`}>
            <Legend
              legendGroups={[
                {
                  styleFn: (d) => ({ fill: d.color, stroke: props.nodeColors[datum.key] }),
                  items: [
                    { label: `Online: ${numOnline}`, color: props.nodeColors[datum.key] },
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

BooleanSplitMultiples.propTypes = {
};

BooleanSplitMultiples.defaultProps = {
};

export default BooleanSplitMultiples;
