import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceArea, ReferenceLine } from 'recharts';
import { colorSchemes, referenceColorScheme } from './colorSchemes';

const renderTitle = (title) => {
  if (title === undefined) {
    return '';
  }
  return (<h3>{title}</h3>);
};

const CustomizedLabel = labelProps => (
  <g className="recharts-reference-area-label">{labelProps.text.map((text, i) => <text key={['labelText', i].join('_')} stroke="none" fill="black" x="0" y={20 * (i + 1)} className="recharts-text" textAnchor="middle"><tspan x={labelProps.x} dy="0em">{text}</tspan></text>)}</g>
);

const BarChart = props => (
  <div style={{ height: props.height }} alt={props.altText}>
    {props.chartTitle !== null && renderTitle(props.chartTitle)}
    <ResponsiveContainer>
      <RechartsBarChart data={props.data} barGap={props.barGap} layout={props.layout} margin={props.margin}>
        {props.layout === 'horizontal' &&
          <XAxis dataKey={props.mainAxisDataKey} hide={props.hidePrimaryAxis} tickFormatter={props.mainTickFormatter !== undefined ? props.mainTickFormatter : null} />
        }
        {props.layout === 'horizontal' &&
          <YAxis tickFormatter={props.secondaryTickFormatter !== undefined ? props.secondaryTickFormatter : null} width={props.yAxisWidth} domain={props.domain} />
        }
        {props.layout === 'vertical' &&
          <YAxis dataKey={props.mainAxisDataKey} hide={props.hidePrimaryAxis} type="category" tickFormatter={props.mainTickFormatter !== undefined ? props.mainTickFormatter : null} width={props.yAxisWidth} />
        }
        {props.layout === 'vertical' &&
          <XAxis type="number" tickFormatter={props.secondaryTickFormatter !== undefined ? props.secondaryTickFormatter : null} domain={props.domain} />
        }
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip formatter={props.toolTipFormatter} />
        {!props.hideLegend &&
          <Legend height={props.legendHeight} />
        }
        {props.barDataKeys.map((barDataKey, i) => (
          <Bar key={barDataKey} dataKey={barDataKey} fill={colorSchemes[props.colorScheme][i % colorSchemes[props.colorScheme].length]} stackId={props.stacked ? 1 : i} animationDuration={50} />
        ))}
        {props.referenceArea &&
          <XAxis type="number" xAxisId={1} domain={[0, 1000]} dataKey={props.mainReferenceAxisDataKey} hide />
        }
        {props.referenceArea && props.referenceAreaLabels.map((text, i) => (
          <ReferenceArea key={['referenceArea', i].join('_')} xAxisId={1} x1={i === 0 ? 0 : props.referenceAreaExes[i - 1]} x2={props.referenceAreaExes[i] || ((i * 250) - 250)} stroke="black" fill={referenceColorScheme[i % referenceColorScheme.length]} strokeOpacity={0.3} label={<CustomizedLabel text={text} />} />
        ))}
        {props.referenceLine && props.referenceX &&
          <ReferenceLine x={props.referenceX} label={props.referenceLineLabel || null} stroke={props.referenceLineColor} strokeWidth={2} isFront />
        }
      </RechartsBarChart>
    </ResponsiveContainer>
  </div>
);

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
