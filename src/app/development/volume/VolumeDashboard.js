import React from 'react';
import PropTypes from 'prop-types';
import YearlyPermitVol from './YearlyPermitVol'
import { permitVol } from './data'


class VolumeDashboard extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return (<div>
      <YearlyPermitVol
        permitData={permitVol}
        colorScheme={['#B66DFF', '#DB6D00', '#006DDB', '#000000', '#FF6DB6', '#920000', '#01b0b0', '#2fe12f', '#004949', '#6DB6FF', '#490092']}
        volumeKeys={[
          'Single Family',
          'Multi Family',
          'Town Houses',
          'Duplexes',
          'Commercial',
          'Residential Alterations and Additions',
          'Commercial Alterations and Additions',
          'Mobile Homes',
          'Total',
        ]}
      />
    </div>);
  }

}

export default VolumeDashboard;
