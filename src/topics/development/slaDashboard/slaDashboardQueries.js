import gql from 'graphql-tag';

export const query = gql`
  query {
    permits {
      permit_id
      type
      subtype
      category
      app_date
      app_status
      app_status_date
      ntrips
      violation
      violation_count
      violation_days
      sla
      building
      fire
      zoning
      addressing
      trips {
        trip
        start_date
        end_date
        due_date
        trip_violation_days
        trip_sla
        division
      }
    }
  }
`;
