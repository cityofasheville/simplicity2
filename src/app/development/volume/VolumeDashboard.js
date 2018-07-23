import React from 'react';
import PropTypes from 'prop-types';
import YearlyPermitVol from './YearlyPermitVol'
import { permitVol } from './data'


class VolumeDashboard extends React.Component {
  constructor(props) {
    super(props);

    const resRollupKeys = [
      'Single Family',
      'Town Houses',
      'Duplexes',
      'Mobile Homes',
    ];

    this.permitVol = permitVol.map((d) => {
      const rObj = Object.assign({}, d);
      rObj['New Residential'] = 0;
      rObj['New Residential Construction Value'] = 0;
      resRollupKeys.forEach((rollupKey) => {
        rObj['New Residential'] += d[rollupKey];
        let value = +d[`${rollupKey} Construction Value`].replace(/\D/g, '');
        if (value === '') { value = 0; }
        rObj['New Residential Construction Value'] += value;
      });
      return rObj;
    });
  }

  render() {
    return (<div>
      <h1>Permit Volume</h1>
      <p>Click the boxes in the legend to show and hide permit types.  Move the highlight box on the summary line chart to change the time span of data for the monthly comparison graph. </p>
      <YearlyPermitVol
        permitData={permitVol}
        colorScheme={['#B66DFF', '#DB6D00', '#006DDB', '#000000', '#FF6DB6', '#920000', '#01b0b0', '#2fe12f', '#004949', '#6DB6FF', '#490092']}
        volumeKeys={[
          'New Residential',
          'Residential Alterations and Additions',
          'Commercial',
          'Commercial Alterations and Additions',
          'Multi Family',
        ]}
      />
    </div>);
  }

}

export default VolumeDashboard;
