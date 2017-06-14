import React from 'react';
import PropTypes from 'prop-types';
import { RadioGroup, Radio } from 'react-radio-group';
import BarChartContainer from '../../shared/visualization/BarChartContainer';

const getDollars = (value) => {
  if (Math.abs(value) > 1000000) {
    return [value < 0 ? '-$' : '$', (Math.abs(value) / 1000000).toFixed(0).toLocaleString(), ' M'].join('');
  } else if (Math.abs(value) > 1000) {
    return [value < 0 ? '-$' : '$', (Math.abs(value) / 1000).toFixed(0).toLocaleString(), ' k'].join('');
  }
  return [value < 0 ? '-$' : '$', Math.abs(value).toFixed(0).toLocaleString()].join('');
};

const getDollarsLong = value => (
  [value < 0 ? '-$' : '$', Math.abs(value).toLocaleString()].join('')
);

const ProjectExpendedBarChart = props => (
  <div>
    {props.type === 'Transportation' &&
      <div className="pull-right">
        <RadioGroup name="barChartRadios" selectedValue={props.subType} onChange={props.radioCallback}>
          <Radio value="Road Resurfacing and Sidewalk Improvements" />Road & Sidewalk Improvements
          <Radio value="New Sidewalks and Greenways" />New Sidewalks & Greenways
          <Radio value="Pedestrian Safety" />Pedestrian Safety
        </RadioGroup>
      </div>}
    <div className="row">
      <div className="col-sm-12">
        <div style={{ clear: 'both' }}>
          <BarChartContainer data={props.data} layout="vertical" secondaryTickFormatter={getDollars} toolTipFormatter={getDollarsLong} mainAxisDataKey="name" dataKeys={['Remaining funds', 'Expended funds']} colorScheme="bright_colors_2" altText={[props.type, 'bond project funds expended by project'].join(' ')} stacked yAxisWidth={200} />
        </div>
      </div>
    </div>
  </div>
);

ProjectExpendedBarChart.propTypes = {
  type: PropTypes.string,
  subType: PropTypes.string,
  data: PropTypes.array, // eslint-disable-line
  radioCallback: PropTypes.func,
};

export default ProjectExpendedBarChart;
