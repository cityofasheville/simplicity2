import React from 'react';
import PropTypes from 'prop-types';
import { timeDay, timeMonth } from 'd3-time';
import PermitDataQuery from './PermitDataQuery';
import TimeSlider from './TimeSlider';

class GranularVolume extends React.Component {
  constructor(props) {
    super(props);

    const now = new Date();
    let defaultBrushExtent = [ // AKA brush extent
      timeMonth.offset(now, -1).getTime(),
      // between today and today minus 31 days
      now.getTime(),
    ];
    if (this.props.location.pathname.includes('granular_volume')) {
      defaultBrushExtent[0] = timeMonth.offset(now, -3).getTime()
    }

    this.state = {
      timeSpan: defaultBrushExtent,
      dateField: 'applied_date',
    };

    this.onTimeBrushEnd = this.onTimeBrushEnd.bind(this);
  }

  onTimeBrushEnd(e) {
    // TODO: REJECT NEW TIMESPAN IF IT IS BAD
    this.setState({
      timeSpan: e,
    });
  }

  render() {
    /* TODO:
      on timeslider click, have loading modal until data
      on hierarchical select click, have loading modal until done


      allow users to drill into permits with click/modal behavior
        todo: make modal faster-- put on individual visualizations?
      update URL to allow bookmarking
      props validation
    */

    return (<div>
      <h1 style={{ width: '62.5%', display: 'inline-block' }} >Records by <select
        style={{ fontSize: '0.85em' }}
        value={this.state.dateField}
        onChange={e => this.setState({ dateField: e.target.value })}
      >
        <option value="applied_date">Date Opened</option>
        <option value="status_date">Date Updated</option>
      </select>
      </h1>
      <div>
        <a
          href="https://goo.gl/forms/RpZcZs7m13IZzGrw1"
          rel="noreferrer nooopener"
          target="_blank"
          style={{
            right: 0,
            position: 'absolute',
            top: '2vh',
          }}
        >
          Give feedback about this dashboard
        </a>
      </div>
      <div className="col-md-12">
        <TimeSlider
          onBrushEnd={this.onTimeBrushEnd}
          defaultBrushExtent={this.state.timeSpan}
        />
      </div>
      <div>
        <PermitDataQuery
          timeSpan={this.state.timeSpan}
          dateField={this.state.dateField}
          location={this.props.location}
        />
      </div>
    </div>);
  }
}

export default GranularVolume;
