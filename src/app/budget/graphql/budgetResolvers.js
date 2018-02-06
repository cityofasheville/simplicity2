import { getSankeyData } from './budgetQueries';

export const budgetResolvers = {
  Mutation: {
    updateSankeyData: (_, { sankeyData }, { cache }) => {
      console.log('data?', sankeyData);
      const query = getSankeyData;
      const data = {
        sankeyData,
      };
      cache.writeQuery({ query, data });
    },
  },
};
