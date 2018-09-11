import React from 'react';
import PropTypes from 'prop-types';
import GranularDataReceivers from './GranularDataReceivers';
import TimeSlider from './TimeSlider';

class GranularVolume extends React.Component {
  constructor() {
    super();

    this.state = {
      timeSpan: [new Date(2018, 7, 1), new Date()],
      dateField: 'applied_date',
    };

    this.onTimeBrushEnd = this.onTimeBrushEnd.bind(this);
  }

  onTimeBrushEnd(e) {
    this.setState({
      timeSpan: e,
    });
  }

  render() {
    /* TODO:
      allow users to drill into permits with click/modal behavior
        todo: make modal faster-- put on individual visualizations?
      add tooltip to dotbin pieces
      set radius of dotbin properly
      add fees

      freeze header (and make it smaller) to keep updated vs opened, date range, and permit type in view
      split code more responsibly-- put data manipulation and loading thing in each vis rather than on granulardatareceivers
      props validation
      update URL to allow bookmarking
      bin by week if it's over 6 weeks, by month if it's over 1 year
      do binning on server? is this going to be slow AF?
      select more than one in permit type (etc) dropdowns
    */

    const datePickerStyle = {
      maxWidth: '45%',
      display: 'inline-block',
      padding: '0% 0.5% 0% 0%',
    };

    return (<div>
      <h1 style={{ width: '62.5%', display: 'inline-block' }} >Permits by <select
        style={{ fontSize: '0.85em' }}
        value={this.state.dateField}
        onChange={e => this.setState({ dateField: e.target.value })}
      >
        <option value="applied_date">Date Opened</option>
        <option value="status_date">Date Updated</option>
      </select>
      </h1>
      <div className="col-md-12">
        <TimeSlider
          // defaultBrushExtent={this.state.timeSpan}
          onBrushEnd={this.onTimeBrushEnd}
        />
      </div>
      <div >
        <GranularDataReceivers
          timeSpan={this.state.timeSpan}
          dateField={this.state.dateField}
        />
      </div>
    </div>);
  }
}

export default GranularVolume;
