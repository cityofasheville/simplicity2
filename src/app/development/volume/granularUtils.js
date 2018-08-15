import gql from 'graphql-tag';
import { histogram } from 'd3-array';


export const colorScheme = [
  '#B66DFF',
  '#DB6D00',
  '#006DDB',
  '#FF6DB6',
  '#920000',
  '#01b0b0',
  '#2fe12f',
  '#004949',
  '#6DB6FF',
  '#490092',
  '#FFBDDB',
];



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
  const dateComparisonOpts = {
    // weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

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
