import React from 'react';
import PropTypes from 'prop-types';
import LoadingAnimation from '../../../shared/LoadingAnimation';
import YearlyPermitVol from './YearlyPermitVol';
import { permitVol } from './data';


class VolumeDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
    }

    this.permitVol = permitVol.map((d) => {
      const rObj = Object.assign({}, d);
      rObj['New Residential'] = d['New Residential Permits'];
      rObj['New Commercial'] = d['Commercial'];
      rObj['Scheduled Inspections'] = 0;
      rObj['Scheduled Inspections Construction Value'] = '0';
      return rObj;
    });

    // TODO: MAKE SURE MULTIFAMILY IS NOT INCLUDED IN COMMERCIAL COUNT

    this.volKeysToUse = [
      'New Residential',
      'Residential Alterations and Additions',
      'New Commercial',
      'Commercial Alterations and Additions',
      'Multi Family',
      'Scheduled Inspections',
    ];
  }

  componentDidMount() {
    fetch('http://www.civicdata.com/api/action/datastore_search_sql?sql=SELECT*from%222fe31755-8a8b-4bba-8f1e-4777592b8efd%22')
      .then(res => res.json())
      .then(
        (result) => {
          if (result.result.records) {
            result.result.records.forEach((record) => {
              const scheduledDate = new Date(record['SCHEDULED_DATE']).toLocaleDateString(
                'en-US',
                { month: 'long', year: 'numeric' }
              );
              const datum = this.permitVol.find(d => d['Month & Year'] === scheduledDate);
              if (datum) {
                datum['Scheduled Inspections'] += 1;
              }
            });
            this.setState({
              isLoaded: true,
            });
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  render() {
    if (!this.state.isLoaded) {
      return <LoadingAnimation />;
    }
    return (<div>
      <h1>Permit Volume</h1>
      <p>Click the boxes in the legend to show and hide permit types.  Move the highlight box on the summary line chart to change the time span of data for the monthly comparison graph. </p>
      <YearlyPermitVol
        permitData={this.permitVol}
        colorScheme={['#B66DFF', '#DB6D00', '#006DDB', '#FF6DB6', '#920000', '#01b0b0', '#2fe12f', '#004949', '#6DB6FF', '#490092']}
        volumeKeys={this.volKeysToUse}
      />
    </div>);
  }
}

export default VolumeDashboard;
