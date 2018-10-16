import React from 'react';
import PropTypes from 'prop-types';
import { timeDay, timeMonday, timeMonth } from 'd3-time';
import { nest } from 'd3-collection';

const Workflow = (props) => {
  const uniqueTasks = props.data.length;

  const uniquePermitsNest = nest()
    .key(d => d.permit_number);

  const typeNest = nest()
    // .key(d => d.permit_group)
    .key(d => d.permit_type)
    .key(d => d.permit_subtype)
    .key(d => d.permit_category)

  const byPerson = nest()
    .key(d => d.user_department)
    // .key(d => d.user_name)
    .entries(props.data)
    .sort((a, b) => b.values.length - a.values.length)
    .map(person => {
      person.valuesByType = typeNest.entries(person.values)
      person.uniquePermits = uniquePermitsNest.entries(person.values)
      return person;
    })


  console.log(byPerson)


  return (<div className="dashRows">
    <div>
      {props.data.length + ' tasks'}
    </div>
  </div>);
};

export default Workflow;
