import gql from 'graphql-tag';
import { sankeyData } from './budgetObjectTypes';

export const getSankeyData = gql`
  query getSankeyData {
    getSankeyData @client {
      sankeyData
    }
  }
`;
