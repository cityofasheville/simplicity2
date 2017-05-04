import React from 'react';
import { connect } from 'react-redux';
import { Link, hashHistory } from 'react-router';
import Treemap from '../../../components/Treemap';
// import { updateNodePath } from '../../../containers/budgetActions';
const browser = require('detect-browser');

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
  hashHistory.push(newURL);
};

const findTop = (data, path) => {
  console.log(data);
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
  <div>
    <div className="row">
      <div className="col-sm-12">
        <h3>
          Treemap of {props.location.query.mode || 'expenditures'}
        </h3>
      </div>
    </div>
    <div className="row">
      <div className="col-sm-12">
        <div style={{ marginBottom: '15px' }}>
          {getExplanatoryText(props.categoryType)}<br />
          Click a rectangle in the treemap to go to a deeper level
        </div>
      </div>
    </div>
    <div className="row">
      <div className="col-sm-12">
        <div className="btn-group pull-left">
          <Link to={{ pathname: props.location.pathname, query: { entity: props.location.query.entity, id: props.location.query.id, label: props.location.query.label, mode: 'expenditures', hideNavbar: props.location.query.hideNavbar } }}>
            <button className={props.location.query.mode !== 'revenue' ? 'btn btn-primary btn-xs active' : 'btn btn-primary btn-xs'} style={{ borderTopRightRadius: '0px', borderBottomRightRadius: '0px' }}>Expenditures</button>
          </Link>
          <Link to={{ pathname: props.location.pathname, query: { entity: props.location.query.entity, id: props.location.query.id, label: props.location.query.label, mode: 'revenue', hideNavbar: props.location.query.hideNavbar } }}>
            <button className={props.location.query.mode === 'revenue' ? 'btn btn-primary btn-xs active' : 'btn btn-primary btn-xs'} style={{ borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px' }}>Revenue</button>
          </Link>
        </div>
        <div className="btn-group pull-left" style={{ display: 'none' }} >
          <button className={getButtonClass(props.categoryType, 'use')}>Use</button>
          <button className={getButtonClass(props.categoryType, 'department')}>Departments</button>
        </div>
        <div className="btn-group pull-right" style={{ marginLeft: '3px', marginBottom: '3px' }}>
          <button className="btn btn-primary btn-xs" onClick={props.jumpUp ? () => props.jumpUp(props) : null}><i className="fa fa-arrow-up"></i></button>
        </div>
        {browser.name === 'ie' && <div className="col-sm-12 alert-danger">Internet Explorer does not support the TREE MAP visualization. Please explore the budget details via the Details Table, or view this page in Chrome or Firefox.</div>}
        {browser.name !== 'ie' &&
          <Treemap data={props.location.query.mode === 'expenditures' || props.location.query.mode === undefined ? findTop(props.expenseTree, props.location.query.nodePath || 'root') : findTop(props.revenueTree, props.location.query.nodePath || 'root')} diveDeeper={props.diveDeeper} differenceColors history={hashHistory} location={props.location} />
        }
      </div>
    </div>
  </div>
);

BudgetDetailsTreemap.propTypes = {
  categoryType: React.PropTypes.string,
  expenseTree: React.PropTypes.object, // eslint-disable-line react/forbid-prop-types
  revenueTree: React.PropTypes.object, // eslint-disable-line react/forbid-prop-types
  location: React.PropTypes.object, // eslint-disable-line react/forbid-prop-types
  diveDeeper: React.PropTypes.func,
  jumpUp: React.PropTypes.func,
  // expensePath: React.PropTypes.string,
  // revenuePath: React.PropTypes.string,
};

BudgetDetailsTreemap.defaultProps = {
  categoryType: 'department',
  expenseTree: { amount: 0, size: 0, name: 'no data', children: [] },
  revenueTree: { amount: 0, size: 0, name: 'no data', children: [] },
  diveDeeper: goDeeper,
  jumpUp: goUp,
  // expensePath: 'root',
  // revenuePath: 'root',
};

const mapStateToProps = state => (
  {
    expenseTree: state.budget.expenseTreeForTreemap,
    revenueTree: state.budget.revenueTreeForTreemap,
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

