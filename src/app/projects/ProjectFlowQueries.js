import gql from 'graphql-tag';

export const query = gql`
  query projects {
    projects(after: "2017-11-20", reqtype: "Service Request", 
    status: ["Open", "In Progress", "Pending - IT Resolution", "Pending - Vendor", "Waiting On Requestor"]) {
      ID
      Summary
      RequestedDate
      CurrentStatus
    }
  }
`;
