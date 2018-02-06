import { GraphQLObjectType, GraphQLList, GraphQLString, GraphQLInt } from 'graphql';

export const sankeyNode = new GraphQLObjectType({
  name: 'sankeyNode',
  fields: {
    name: { type: GraphQLString },
    value: { type: GraphQLInt },
  },
});

export const sankeyLink = new GraphQLObjectType({
  name: 'sankeyLink',
  fields: {
    source: { type: GraphQLInt },
    target: { type: GraphQLInt },
    value: { type: GraphQLInt },
  },
});

export const sankeyData = new GraphQLObjectType({
  name: 'sankeyData',
  fields: {
    nodes: { type: new GraphQLList(sankeyNode) },
    links: { type: new GraphQLList(sankeyLink) },
  },
});
