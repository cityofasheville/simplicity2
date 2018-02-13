import React from 'react';
import PropTypes from 'prop-types';
import BarChartContainer from '../../shared/visualization/BarChartContainer';

const days_exit_keys = [
  'Non-GPD',
  'SITH',
];

const days_exit_data = [
  {
    month: '02/2017',
    'Non-GPD': 124,
    GPD: 366,
  },
  {
    month: '03/2017',
    'Non-GPD': 101,
    GPD: 279,
  },
  {
    month: '04/2017',
    'Non-GPD': 136,
    GPD: 332,
  },
  {
    month: '05/2017',
    'Non-GPD': 101,
    GPD: 331,
  },
  {
    month: '06/2017',
    'Non-GPD': 90,
    GPD: 145,
  },
  {
    month: '07/2017',
    'Non-GPD': 105,
    GPD: 292,
  },
];

const HomelessnessVeteransExitTime = props => (
  <div>
    <div className="row">
      <div className="col-sm-12">
        <h3>How long does it take to house a Veteran?</h3>
        <p>The City of Asheville and Buncombe County are striving to achieve &quot;functional zero&quot; for Veteran homelessness, as defined for NC 501, Asheville-Buncombe Continuum of Care. Functional zero would be achieved when every newly identified homeless Veteran in Asheville-Buncombe is connected with an appropriate housing intervention within 30 days and is permanently housed within 90 days after signing a Declaration of Housing Preference form, unless the Veteran elects to enter a long term transitional housing program (known as Grant and Per Diem programs, GPD). Veterans who choose to enter GPD programs can remain in those programs for up to two years. We connect newly identified homeless Veterans who wish to be connected with a housing intervention within two weeks. The below charts show how many days to a positive exit from homelessness.</p>
      </div>
    </div>
    <div className="row">
      <div className="col-sm-6">
        <BarChartContainer layout="vertical" chartTitle="Average days from identification to positive exit: non-GPD" mainAxisDataKey="month" dataKeys={['Non-GPD']} colorScheme="bright_colors" data={props.data} altText="Bar chart of average days from identification to positive exit: non-GPD" domain={[0, 380]} referenceLine referenceX={90} referenceLineLabel="90 days" margin={{ top: 15, left: 10, right: 0, bottom: 0 }} />
      </div>
      <div className="col-sm-6">
        <BarChartContainer layout="vertical" chartTitle="Average days from identification to positive exit: All Grant & Per Diem programs" mainAxisDataKey="month" dataKeys={['GPD']} colorScheme="bright_colors_2" data={props.data} altText="Bar chart of average days from identification to positive exit: All Grant & Per Diem programs" />
      </div>
    </div>
  </div>
);

const dataShape = {
  month: PropTypes.string,
  'Non-SITH': PropTypes.number,
  SITH: PropTypes.number,
};

HomelessnessVeteransExitTime.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape(dataShape)),
};

HomelessnessVeteransExitTime.defaultProps = {
  data: days_exit_data,
}

export default HomelessnessVeteransExitTime;
