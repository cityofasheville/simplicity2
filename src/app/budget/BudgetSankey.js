import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { getSankeyData } from './graphql/budgetQueries';
import Sankey from '../../shared/visualization/Sankey';

const BudgetSankey = props => (
  <Sankey
    nodes={props.nodes}
    links={props.links}
    altText={props.altText}
    valueFormatter={(value) => {
      if (!value || value === 0) {
        return '$0';
      }
      return [value < 0 ? '-$' : '$', Math.abs(value).toLocaleString()].join('');
    }}
  />
);

const nameShape = {
  name: PropTypes.string,
};

const linkShape = {
  source: PropTypes.number,
  target: PropTypes.number,
  value: PropTypes.number,
};

BudgetSankey.propTypes = {
  nodes: PropTypes.arrayOf(PropTypes.shape(nameShape)),
  links: PropTypes.arrayOf(PropTypes.shape(linkShape)),
  altText: PropTypes.string,
};

BudgetSankey.defaultProps = {
  altText: 'Flow diagram',
};

export default graphql(getSankeyData, {
  props: ({ data: { sankeyData } }) => ({
    nodes: sankeyData.nodes,
    links: sankeyData.links,
  }),
})(BudgetSankey);
