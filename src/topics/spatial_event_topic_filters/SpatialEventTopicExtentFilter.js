import React from 'react';

const extentOptions = [
  { label: 'a quarter block (27.5 yards)', value: 0 },
  { label: 'half a block (55 yards)', value: 1 },
  { label: 'a city block (110 yards)', value: 2 },
  { label: 'the last 5 years', value: 3 },
  { label: 'a couple city blocks (1/8 mile)', value: 4 },
  { label: 'a quarter mile', value: 5 },
];

const SpatialEventTopicTimeFilter = props => (
  <div>
    {props.spatialType === 'address' ?
      (<div className="form-group">
        <label htmlFor="extent" className="col-sm-2 control-label">within</label>
        <div className="col-sm-10">
          <select name="extent" id="extent" className="form-control" defaultValue={4}>
            {extentOptions.map((extentOption, i) => (
              <option key={i} value={extentOption.value}>{extentOption.label}</option>
            ))}
          </select>
        </div>
      </div>) : null
    }
  </div>
);

SpatialEventTopicTimeFilter.propTypes = {
  spatialType: React.PropTypes.string.isRequired,
};

export default SpatialEventTopicTimeFilter;
