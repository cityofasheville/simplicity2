import gql from 'graphql-tag';
import { sankeyData } from './budgetObjectTypes';

export const updateSankeyData = gql`
  mutation updateSankeyData($sankeyData: sankeyData, ) {
    updateSankeyData(sankeyData: $sankeyData) @client {
      sankeyData
    }
  }
`;
