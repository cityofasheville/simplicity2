import gql from 'graphql-tag';

export const query = gql`
  query firstReviewSLA($tasks: [String]) {
    firstReviewSLASummary(tasks: $tasks) {
      task
      met_sla
      met_sla_percent
      past_sla
      month
      year
    }
  }
`;
