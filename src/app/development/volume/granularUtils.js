import React from 'react';
import gql from 'graphql-tag';
import { histogram } from 'd3-array';
import { scaleLinear } from 'd3-scale';


const dateComparisonOpts = {
  // weekday: 'short',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

export const colorScheme = [
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

export function dotBin(input) {
  const renderedPieces = [];
  const keys = Object.keys(input.data);

  // console.log(input)

  const radiusFunc = scaleLinear()
    .range([2, 8])
    .domain([0, input.type.maxRadius]);

  keys.forEach(key => {
    const column = input.data[key];
    const circles = {}
    column.pieceData.forEach(pieceDatum => {
      const thisDate = new Date(pieceDatum.value).toLocaleDateString('en-US', dateComparisonOpts)
      if (circles[thisDate]) {
        circles[thisDate].push(pieceDatum)
      } else {
        circles[thisDate] = [pieceDatum]
      }
    })

    const circleArray = Object.keys(circles).map((circleKey) => {
      return <circle
        key={`piece-${key}-${circleKey}`}
        r={radiusFunc(circles[circleKey].length)}
        cx={input.rScale(new Date(circleKey))}
        cy={column.middle - column.padding}
        style={input.type.style}
        // onMouseOver={(e) => input.type.mouseOver(circleKey, circles[circleKey], e)}
      ></circle>
    })

    const dotArray = (
      <g
        key={`piece-${key}`}
        // onMouseOut={() => input.type.mouseOut()}
      >
        {circleArray}
      </g>
    );
    renderedPieces.push(dotArray);
  });
  return renderedPieces;
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

export function histogramFromHierarchical(rawData, entriesHierarchy, includedDates) {
  // Standard date format for comparison

  const histFunc = histogram(rawData)
    .value(d => new Date(d.applied_date))
    .thresholds(includedDates);

  return [].concat(...entriesHierarchy
    .map((hierarchyType) => {
      const binnedValues = histFunc(hierarchyType.values);

      return includedDates.map((thisDate) => {
        const bin = binnedValues.find(v => new Date(v.x0).toLocaleDateString('en-US', dateComparisonOpts) === new Date(thisDate).toLocaleDateString('en-US', dateComparisonOpts));
        const binLength = bin ? bin.length : 0;
        return {
          key: hierarchyType.key,
          count: binLength,
          binStartDate: thisDate,
          values: bin || [],
        };
      });
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
