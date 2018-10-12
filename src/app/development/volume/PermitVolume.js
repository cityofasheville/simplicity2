import React from 'react';
import PropTypes from 'prop-types';
import { timeDay, timeMonth } from 'd3-time';
import PermitDataQuery from './PermitDataQuery';
import TimeSlider from './TimeSlider';

class GranularVolume extends React.Component {
  constructor(props) {
    super(props);
    const isGranularVolumePath = this.props.location.pathname.includes('granular_volume');
    const thirtyDays = 2678400000;

    let defaultBrushExtent = [ // AKA brush extent
      timeDay.ceil(new Date()).getTime() - thirtyDays,
      // between today and today minus 31 days
      timeDay.ceil(new Date()).getTime(),
    ];
    if (isGranularVolumePath) {
      defaultBrushExtent[0] = defaultBrushExtent[1] - thirtyDays * 6
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
      allow users to drill into permits with click/modal behavior
        todo: make modal faster-- put on individual visualizations?
      update URL to allow bookmarking
      props validation
    */

    return (<div>
      <div
        id="loading-modal"
        style={{
          height: '100%',
          width: '100%',
          opacity: 0.1,
          zIndex: 1,
          position: 'absolute',
          cursor: 'progress',
          display: 'none',
        }}
      ></div>
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
