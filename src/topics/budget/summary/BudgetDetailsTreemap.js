import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import Treemap from '../../../components/Treemap';
// import { updateNodePath } from '../../../containers/budgetActions';

const getExplanatoryText = (categoryType) => {
  switch (categoryType) {
    case 'use':
      return 'Some explanatory text here describing the use treemap';
    case 'department':
      return 'Some explanatory text here describing the department treemap';
    default:
      return 'Some explanatory text goes here';
  }
};

const getButtonClass = (categoryType, buttonName) => {
  if (
    (categoryType === 'use' && buttonName === 'use') ||
    (categoryType === 'department' && buttonName === 'department')) {
    return 'btn btn-primary btn-xs active';
  }
  return 'btn btn-primary btn-xs';
};

const goDeeper = (props) => {
  let curPath = props.path;
  if (props.path.split('-').length > 4) {
    curPath = props.path.split('-').slice(0, 4).join('-');
  }
  let newURL = [props.location.pathname, '?',
    Object.entries(props.location.query).map(([key, value]) => {
      if (key !== 'nodePath') {
        return [key, '=', value, '&'].join('');
      }
      return '';
    }).join('')].join('');
  newURL = [newURL, 'nodePath=', curPath].join('');
  props.history.push(newURL);
};

const goUp = (props) => {
  const curPath = props.location.query.nodePath || 'root';
  let newURL = [props.location.pathname, '?',
    Object.entries(props.location.query).map(([key, value]) => {
      if (key !== 'nodePath') {
        return [key, '=', value, '&'].join('');
      }
      return '';
    }).join('')].join('');
  if (curPath === 'root') {
    newURL = [newURL, 'nodePath=root'].join('');
  } else {
    let curNodePathInfo = curPath.split('-');
    curNodePathInfo = curNodePathInfo.slice(0, curNodePathInfo.length - 1).join('-');
    newURL = [newURL, 'nodePath=', curNodePathInfo].join('');
  }
  browserHistory.push(newURL);
};

const findTop = (data, path) => {
  const nodes = path.split('-');
  if (nodes.length === 1) {
    return data.children;
  }
  let curNode = data;
  let prevNode = null;
  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = 0; j < curNode.children.length; j += 1) {
      if (curNode.children[j].key === nodes[i]) {
        prevNode = curNode;
        curNode = curNode.children[j];
        break;
      }
    }
  }
  return ((curNode.children === undefined || curNode.children.length === 0) ? prevNode.children : curNode.children);
};

const BudgetDetailsTreemap = props => (
  <div className="row">
    <div className="col-sm-12">
      <h3>Treemap of {props.expenditureOrRevenue}</h3>
      <div style={{ marginBottom: '15px' }}>
        {getExplanatoryText(props.categoryType)}<br />
        Click a rectangle in the treemap to go to a deeper level
      </div>
      <div className="btn-group pull-left" style={{ marginBottom: '3px' }}>
        <button className={getButtonClass(props.categoryType, 'use')}>Use</button>
        <button className={getButtonClass(props.categoryType, 'department')}>Departments</button>
      </div>
      <div className="btn-group pull-left" style={{ marginLeft: '3px' }}>
        <button className="btn btn-primary btn-xs" onClick={props.jumpUp ? () => props.jumpUp(props) : null}><i className="fa fa-arrow-up"></i></button>
      </div>
      <Treemap data={props.location.query.mode === 'expenditures' ? findTop(props.expenseTree, props.location.query.nodePath || 'root') : findTop(props.revenueTree, props.location.query.nodePath || 'root')} diveDeeper={props.diveDeeper} differenceColors history={browserHistory} location={props.location} />
    </div>
  </div>
);

BudgetDetailsTreemap.propTypes = {
  categoryType: React.PropTypes.string,
  expenditureOrRevenue: React.PropTypes.string,
  expenseTree: React.PropTypes.object, // eslint-disable-line react/forbid-prop-types
  revenueTree: React.PropTypes.object, // eslint-disable-line react/forbid-prop-types
  diveDeeper: React.PropTypes.func,
  jumpUp: React.PropTypes.func,
  // expensePath: React.PropTypes.string,
  // revenuePath: React.PropTypes.string,
};

BudgetDetailsTreemap.defaultProps = {
  categoryType: 'use',
  expenditureOrRevenue: 'expenditures',
  expenseTree: { amount: 0, size: 0, name: 'no data', children: [] },
  revenueTree: { amount: 0, size: 0, name: 'no data', children: [] },
  diveDeeper: goDeeper,
  jumpUp: goUp,
  // expensePath: 'root',
  // revenuePath: 'root',
};

const mapStateToProps = state => (
  {
    expenseTree: state.budget.expenseTree,
    revenueTree: state.budget.revenueTree,
    // expensePath: state.budget.expensePath,
    // revenuePath: state.budget.revenuePath,
  }
);

// const mapDispatchToProps = dispatch => (
//   {
//     diveDeeper: rectangle => (
//       dispatch(updateNodePath(rectangle))
//     ),
//   }
// );


export default connect(mapStateToProps)(BudgetDetailsTreemap);

