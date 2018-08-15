import React from 'react';
import PropTypes from 'prop-types';
import { DateTimePicker } from 'react-widgets';
import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import GranularDataReceivers from './GranularDataReceivers';


class GranularVolume extends React.Component {
  constructor() {
    super();

    this.state = {
      timeSpan: [new Date(2018, 7, 1), new Date()],
      dateField: 'applied_date',
    };
  }

  render() {
    Moment.locale('en');
    momentLocalizer();
    /*
      TO ASK:
        Should menus show all types or show other?  Or indicate type has been rolled into other?
        Or should we do checkboxes like the other one instead of making "other"?

      TODO:
        props validation
        make opened/updated an option
        separate out graphql query
        bin by week if it's over 6 weeks, by month if it's over 1 year
        fix date issue-- have checkdate start at right place
        allow users to drill into permits with click/modal behavior
        update URL to allow bookmarking
    */

    const datePickerStyle = {
      width: '25%',
      fontSize: '0.45em',
      display: 'inline-block',
      padding: '0% 2%',
    };

    return (<div>
      <h1>Permits <select
        style={{ fontSize: '0.9em' }}
        value={this.state.dateField}
        onChange={e => this.setState({ dateField: e.target.value })}
      >
        <option value="applied_date">Opened</option>
        <option value="status_date">Updated</option>
      </select> between <DateTimePicker
        value={this.state.timeSpan[0]}
        onChange={value => this.setState({ timeSpan: [value, this.state.timeSpan[1]] })}
        time={false}
        style={datePickerStyle}
      /> and <DateTimePicker
        style={datePickerStyle}
        value={this.state.timeSpan[1]}
        onChange={value => this.setState({ timeSpan: [this.state.timeSpan[0], value] })}
        time={false}
      />
      </h1>
      <GranularDataReceivers
        timeSpan={this.state.timeSpan}
        dateField={this.state.dateField}
      />
    </div>);
  }
}

export default GranularVolume;
