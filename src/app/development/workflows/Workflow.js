import React from 'react';
import PropTypes from 'prop-types';
import { timeDay, timeMonday, timeMonth } from 'd3-time';
import { nest } from 'd3-collection';

const Workflow = (props) => {
  const uniqueTasks = props.data.length;
  const uniquePermits = nest()
    // .key(d => d.permit_type)
    // .key(d => d.permit_subtype)
    // .key(d => d.permit_category)
    .key(d => d.permit_number).entries(props.data);

  console.log(uniqueTasks, uniquePermits)

  return (<div className="dashRows">
    <div>
      {props.data.length + ' tasks on ' + uniquePermits.length + ' permits'}
    </div>
  </div>);
};

export default Workflow;
