import gql from 'graphql-tag';

export const query = gql`
  query projects {
    projects(
      after: "2015-01-01"
      status: [
        "Open"
        "In Progress"
        "Pending - IT Resolution"
        "Pending - Vendor"
        "Waiting On Requestor"
      ]
    ) {
      ID
      Summary
      AssignedTechnician
      RequestedDate
      Requestor
      CurrentStatus
      Priority
      Notes
    }
  }
`;
