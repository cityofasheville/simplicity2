import React from 'react';
import PropTypes from 'prop-types';
import { OrdinalFrame } from 'semiotic'
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceArea, ReferenceLine } from 'recharts';
import { colorSchemes, referenceColorScheme } from './colorSchemes';

const BarChart = props => (
  <OrdinalFrame
    data={props.dataKeys.map((k, kIndex) => props.data.map(function(d) {
      let rVal = {};
      rVal[props.mainAxisDataKey] = d[props.mainAxisDataKey]
      rVal.label = k
      rVal.value = d[k] ? d[k] : 0
      const thisScheme = colorSchemes[props.colorScheme]
      rVal.color = thisScheme[kIndex % thisScheme.length]
      return rVal
    })).reduce((p, c) => p.concat(c))}
    axis={(
      {
        orient: 'left',
        tickFormat: d => d,
        label: {
          name: 'Count',
          position: { anchor: 'middle' }
        }
      }
    )}
    projection={props.layout}
    type='bar'
    oLabel={true}
    oAccessor={props.mainAxisDataKey}
    oPadding={10}
    rAccessor='value'
    style={d => ({fill: d.color})}
    pieceHoverAnnotation={true}
    title={props.chartTitle}
    tooltipContent={function(d) {
      const xAxisLabel = props.mainAxisDataKey
      return <div>
          {xAxisLabel[0].toUpperCase() + xAxisLabel.slice(1)}: {d.data[xAxisLabel]}, {d.data.label}: {d.data.value}
        </div>
      }}
    />
)

BarChart.propTypes = {
  chartTitle: PropTypes.string,
  altText: PropTypes.string,
  data: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  barDataKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
  mainAxisDataKey: PropTypes.string.isRequired,
  mainReferenceAxisDataKey: PropTypes.string,
  secondaryTickFormatter: PropTypes.func,
  hidePrimaryAxis: PropTypes.bool,
  mainTickFormatter: PropTypes.func,
  height: PropTypes.number,
  stacked: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
  dollars: PropTypes.bool,
  colorScheme: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  referenceArea: PropTypes.bool,
  referenceAreaLabels: PropTypes.arrayOf(PropTypes.array),
  referenceAreaExes: PropTypes.arrayOf(PropTypes.number),
  referenceLine: PropTypes.bool,
  referenceLineColor: PropTypes.string,
  referenceLinLabel: PropTypes.string,
  referenceLineX: PropTypes.number,
  domain: PropTypes.array, // eslint-disable-line,
  toolTipFormatter: PropTypes.func,
  barGap: PropTypes.number,
  legendHeight: PropTypes.number,
  layout: PropTypes.string,
  yAxisWidth: PropTypes.number,
  margin: PropTypes.object,
  hideLegend: PropTypes.bool,
};

BarChart.defaultProps = {
  altText: 'Bar chart',
  data: [],
  barDataKeys: [],
  mainReferenceAxisDataKey: '',
  mainAxisDataKey2: '',
  yTickFormater: null,
  xTickFormater: null,
  height: 450,
  stacked: false,
  dollars: false,
  colorScheme: 'pink_green_diverging',
  referenceArea: false,
  referenceLineColor: 'black',
  referenceAreaLabels: [],
  referenceAreaExes: [],
  domain: [0, 'auto'],
  toolTipFormatter: null,
  barGap: 4,
  layout: 'horizontal',
  legendHeight: 35,
  hidePrimaryAxis: false,
  yAxisWidth: 60,
  margin: { top: 0, left: 10, bottom: 0, right: 0 },
  hideLegend: false,
};

export default BarChart;
