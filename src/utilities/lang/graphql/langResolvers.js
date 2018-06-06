import { getLanguage } from './langQueries';

export const langResolvers = {
  Mutation: {
    updateLanguage: (_, { lang, dropdownOpen }, { cache }) => {
      const data = {
        language: {
          __typename: 'language',
          lang,
          dropdownOpen,
        },
      };
      cache.writeQuery({ query: getLanguage, data });
      return data.language;
    },
  },
};
