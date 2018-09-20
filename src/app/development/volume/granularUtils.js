import React from 'react';
import gql from 'graphql-tag';
import { histogram } from 'd3-array';

const dateComparisonOpts = {
  // weekday: 'short',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

export const colorScheme = [
  /* This is two of the color schemes from the other color scheme file
    (under shared/visualizations) joined and deduped
  */
  '#B66DFF',
  '#DB6D00',
  '#006DDB',
  '#FF6DB6',
  '#01b0b0',
  '#2fe12f',
  '#920000',
  '#004949',
  '#6DB6FF',
  '#490092',
  '#ff99c7',
];

export function groupStatuses(data) {
  // Issued/Finaled/Closed
  const done = ['Partial Issued', 'Reissued', 'Issued', 'Sent', 'Closed', 'Issued CA', 'Finaled', 'Record Closed', 'Approved']
  // Plan Check/In Review
  const inReview = ['Plan Check', 'Plan Check 2', 'In Review']
  // Application Phase
  const appPhase = ['Application Received', 'Application Submitted', 'Submittal Required']

  return data.map(d => {
    const rVal = Object.assign({}, d)
    if (done.includes(d.status_current)) {
      rVal.status_current = 'Issued/Finaled/Closed'
    } else if (appPhase.includes(d.status_current)) {
      rVal.status_current = 'Application Phase'
    } else if (inReview.includes(d.status_current)) {
      rVal.status_current = 'Plan Check/In Review'
    }
    return rVal;
  })
}

export const openedOnlineRule = inputDatum => inputDatum.created_by.includes('PUBLICUSER') || inputDatum.created_by === 'TALLEY' || inputDatum.created_by === 'CSHORT';

export function groupHierachyOthers(inputHierarchy, otherGroupCutoff = 5) {
  if (inputHierarchy.length <= otherGroupCutoff) {
    return inputHierarchy;
  }
  const hierarchyToUse = inputHierarchy.slice(0, otherGroupCutoff);

  const others = [].concat(...inputHierarchy.slice(
    otherGroupCutoff,
    inputHierarchy.length - 1
  ).map(d => d.values));

  hierarchyToUse.push({
    key: 'Other',
    values: others,
    value: others.length,
  });
  return hierarchyToUse.sort((a, b) => b.value - a.value);
}

export function stackedHistogramFromNodes(nodes, includedDates) {
  const histFunc = histogram()
    .value(d => new Date(d.applied_date))
    .thresholds(includedDates)
    .domain([
      includedDates[0],
      includedDates[includedDates.length - 1],
    ])

  console.log(nodes)
  return [].concat(...nodes
    .map((node) => {
      console.log(node)
      return histFunc(node.unNestedValues)
        .map(d => {
          return {
            key: node.key,
            count: d.length,
            binStartDate: d.x0,
            values: d || [],
          };
        })
    }));
}

export function splitOrdinalByBool(inputData, matchTestFunc, nameTrue) {
  const splitOrdinal = [];
  inputData.forEach((datum) => {
    const matchy = Object.assign({}, datum);
    matchy[nameTrue] = true;
    const notMatchy = Object.assign({}, datum);
    notMatchy[nameTrue] = false;

    matchy.values = [];
    notMatchy.values = [];

    datum.values.forEach(datumValue => (matchTestFunc(datumValue) ?
      matchy.values.push(datumValue)
      : notMatchy.values.push(datumValue)));

    matchy.count = matchy.values.length;
    notMatchy.count = notMatchy.values.length;

    splitOrdinal.push(notMatchy);
    splitOrdinal.push(matchy);
  });

  return splitOrdinal;
}


export const GET_PERMITS = gql`
  query getPermitsQuery($date_field: String!, $after: String, $before: String) {
    permits(date_field: $date_field, after: $after, before: $before) {
        applicant_name
        applied_date
        permit_category
        permit_description
        permit_group
        permit_number
        permit_subtype
        permit_type
        status_current
        status_date
        created_by
        building_value
        job_value
        total_project_valuation
        total_sq_feet
        fees
        paid
        balance
        invoiced_fee_total
        address
        comments {
          comment_seq_number
          comment_date
          comments
        }
    }
  }
`;
