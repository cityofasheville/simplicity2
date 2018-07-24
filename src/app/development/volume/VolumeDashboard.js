import React from 'react';
import PropTypes from 'prop-types';
import YearlyPermitVol from './YearlyPermitVol'
import { permitVol } from './data'


class VolumeDashboard extends React.Component {
  constructor(props) {
    super(props);

    this.permitVol = permitVol.map((d) => {
      const rObj = Object.assign({}, d);
      rObj['New Residential'] = d['New Residential Permits'];
      rObj['New Commercial'] = d['Commercial'];
      return rObj;
    });
  }

  render() {
    return (<div>
      <h1>Permit Volume</h1>
      <p>Click the boxes in the legend to show and hide permit types.  Move the highlight box on the summary line chart to change the time span of data for the monthly comparison graph. </p>
      <YearlyPermitVol
        permitData={this.permitVol}
        colorScheme={['#B66DFF', '#DB6D00', '#006DDB', '#FF6DB6', '#920000', '#01b0b0', '#2fe12f', '#004949', '#6DB6FF', '#490092']}
        volumeKeys={[
          'New Residential',
          'Residential Alterations and Additions',
          'New Commercial',
          'Commercial Alterations and Additions',
          'Multi Family',
        ]}
      />
    </div>);
  }

}

export default VolumeDashboard;
