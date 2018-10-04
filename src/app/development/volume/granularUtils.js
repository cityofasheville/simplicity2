import gql from 'graphql-tag';
import { histogram } from 'd3-array';
import { timeDay, timeMonday, timeMonth } from 'd3-time';

export const colorScheme = [
  '#490092',
  '#920000',
  '#B66DFF',
  '#DB6D00',
  '#006DDB',
  '#FF6DB6',
  '#6DB6FF',
];

export function multiplesTitle(node) {
  const slicedHeritage = node.heritage.slice(1)
  return slicedHeritage.length > 0 ?
    `${node.heritage.slice(1).join(' > ')} > ${node.key}`
    : `${node.key}`;
}

function whichD3TimeFunction(timeExtent) {
  const oneDayMilliseconds = (24 * 60 * 60 * 1000);
  const firstTime = new Date(timeExtent[0]).getTime();
  const lastTime = new Date(timeExtent[1]).getTime();
  const daySpan = (lastTime - firstTime) / oneDayMilliseconds;
  if (daySpan <= 30) {
    return timeDay
  } else if (daySpan > 30 && daySpan / 7 <= 30) {
    return timeMonday
  } else if (daySpan / 7 > 30) {
    return timeMonth
  }
}

export function dateDisplayOptsFuncMaker(timeExtent) {
  const timeFunc = whichD3TimeFunction(timeExtent);
  let dateOpts = {
    // timeZone: 'America/New_York',
    // why is this messed up?
  }
  if (timeFunc === timeDay || timeFunc === timeMonday) {
    dateOpts.day = 'numeric';
    dateOpts.month = 'short';
  } else if (timeFunc === timeMonth) {
    dateOpts.month = 'short';
    dateOpts.year = 'numeric';
  }
  return function(inputDate, longTitle = false) {
    let returnString = timeFunc.round(inputDate)
      .toLocaleDateString('en-US', dateOpts)
    if (timeFunc === timeMonday && longTitle) {
      returnString = `Week of ${returnString}`
    }
    return returnString
  }
}

export function groupStatuses(data) {
  // Issued/Finaled/Closed
  const done = [
    'Partial Issued',
    'Reissued',
    'Issued',
    'Sent',
    'Closed',
    'Issued CA',
    'Finaled',
    'Record Closed',
    'Approved',
  ];
  // Plan Check/In Review
  const inReview = ['Plan Check',
    'Plan Check 2',
    'In Review',
  ];
  // Application Phase
  const appPhase = ['Application Received',
    'Application Submitted',
    'Submittal Required',
  ]

  return data.map((d) => {
    const rVal = Object.assign({}, d)
    if (done.includes(d.status_current)) {
      rVal.status_current = 'Issued/Finaled/Closed'
    } else if (appPhase.includes(d.status_current)) {
      console.log(d)
      rVal.status_current = 'Application Phase'
    } else if (inReview.includes(d.status_current)) {
      rVal.status_current = 'Plan Check/In Review'
    }
    return rVal;
  });
}

export const openedOnlineRule = inputDatum =>
  inputDatum.created_by.includes('PUBLICUSER')
    || inputDatum.created_by === 'TALLEY'
    || inputDatum.created_by === 'CSHORT';


export function getIncludedDates(timeSpan) {
  return whichD3TimeFunction(timeSpan).range(timeSpan[0], timeSpan[1])
}

export function stackedHistogramFromNodes(nodes, timeSpan) {
  const includedDates = getIncludedDates(timeSpan)
  const histFunc = histogram()
    .value(d => new Date(d.applied_date))
    .thresholds(includedDates)
    .domain(timeSpan);
  return [].concat(...nodes
    .map(node => histFunc(node.selectedActiveValues)
      .map(d => ({
        key: node.key,
        count: d.length,
        binStartDate: d.x0,
        values: d || [],
        color: node.color,
        othered: node.othered,
        heritage: node.heritage,
      }))
    )
  );
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

export const GET_PERMITS_FOR_COUNTING = gql`
  query getPermitsQuery($after: String) {
    permits(after: $after) {
        applied_date
        permit_category
        permit_group
    }
  }
`;

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
