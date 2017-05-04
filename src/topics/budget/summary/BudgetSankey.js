import React from 'react';
import { connect } from 'react-redux';
import Sankey from '../../../components/Sankey';

const BudgetSankey = props => (
  <Sankey nodes={props.nodes} links={props.links} height={750} />
);

const nameShape = {
  name: React.PropTypes.string,
};

const linkShape = {
  source: React.PropTypes.number,
  target: React.PropTypes.number,
  value: React.PropTypes.number,
};

BudgetSankey.propTypes = {
  nodes: React.PropTypes.arrayOf(React.PropTypes.shape(nameShape)),
  links: React.PropTypes.arrayOf(React.PropTypes.shape(linkShape)),
};

const mapStateToProps = state => (
  {
    nodes: state.budget.cashFlowData.nodes,
    links: state.budget.cashFlowData.links,
  }
);

export default connect(mapStateToProps)(BudgetSankey);
