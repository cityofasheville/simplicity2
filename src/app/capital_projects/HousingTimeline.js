import React from 'react';
import PropTypes from 'prop-types';
import Timeline from 'react-calendar-timeline';
import moment from 'moment';

const groups = [
  { id: 1, title: 'Repurposing of City-owned Land' },
  { id: 2, title: 'Council actions for Repurposing Land' },
  { id: 3, title: 'Affordable Housing Projects Direct Investments' },
];

const items = [
  { id: 1, group: 1, title: 'Due Dilligence on properties to support affordable housing', start_time: new Date('January 1, 2017 00:00:00'), end_time: new Date('June 1, 2017 23:59:59'), className: 'standard' },
  { id: 2, group: 2, title: 'City Council Work Session', start_time: new Date('February 7, 2017 17:00:00'), end_time: new Date('February 7, 2017 19:00:00'), className: 'standard' },
  { id: 3, group: 1, title: 'Contract Due Diligence Work on Properties', start_time: new Date('June 1, 2017 00:00:00'), end_time: new Date('June, 2018 23:59:59'), className: 'analysis' },
];

const HousingTimeline = props => (
  <div>
    <Timeline
      groups={groups}
      items={items}
      defaultTimeStart={new Date('January 1, 2017 00:00:00')}
      defaultTimeEnd={new Date('July 1, 2018 23:59:59')}
      sidebarWidth={300}
      canMove={false}
      canChangeGroup={false}
      canResize={false}
      stackItems
    />
  </div>
);

HousingTimeline.propTypes = {
  type: PropTypes.string,
  subType: PropTypes.string,
  data: PropTypes.array, // eslint-disable-line
  radioCallback: PropTypes.func,
};

export default HousingTimeline;
