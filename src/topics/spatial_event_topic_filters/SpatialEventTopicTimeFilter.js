import React from 'react';

const timeFrameOptions = [
  { label: 'the last 30 days', value: 0 },
  { label: 'the last 6 months', value: 1 },
  { label: 'the last year', value: 2 },
  { label: 'the last 5 years', value: 3 },
  { label: 'the last 10 years', value: 4 },
  { label: 'all time', value: 5 },
];

const SpatialEventTopicTimeFilter = () => (
  <div className="form-group">
    <label htmlFor="time" className="col-sm-2 control-label">during</label>
    <div className="col-sm-10">
      <select name="time" id="time" className="form-control" defaultValue={2}>
        {timeFrameOptions.map((timeFrameOption, i) => (
          <option key={i} value={timeFrameOption.value}>{timeFrameOption.label}</option>
        ))}
      </select>
    </div>
  </div>
);

export default SpatialEventTopicTimeFilter;
