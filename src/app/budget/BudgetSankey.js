import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Sankey from '../../shared/visualization/Sankey';

const BudgetSankey = props => (
  <Sankey nodes={props.nodes} links={props.links} altText={props.altText} />
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

const mapStateToProps = state => (
  {
    nodes: state.budget.cashFlowData.nodes,
    links: state.budget.cashFlowData.links,
  }
);

export default connect(mapStateToProps)(BudgetSankey);
