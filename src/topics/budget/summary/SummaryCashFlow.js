import React from 'react';
import Sankey from '../../../components/Sankey';

const SummaryCashFlow = props => (
  <div className="row">
    <div className="col-sm-12">
      <h3>Cash flow diagram: Revenues to expenditures</h3>
      <div style={{ marginBottom: '15px' }}>
        Some explanatory text here describing something important to the users that is relevant to know, that we want to communicate to them about this particular chart.
      </div>
      <Sankey />
    </div>
  </div>
);

const nameShape = {
  name: React.PropTypes.string,
};

const linkShape = {
  source: React.PropTypes.number,
  target: React.PropTypes.number,
  value: React.PropTypes.number,
};

SummaryCashFlow.propTypes = {
  nodes: React.PropTypes.arrayOf(React.PropTypes.shape(nameShape)),
  links: React.PropTypes.arrayOf(React.PropTypes.shape(linkShape)),
};

export default SummaryCashFlow;
