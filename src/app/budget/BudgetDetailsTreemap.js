import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { RadioGroup, Radio } from 'react-radio-group';
import Icon from '../../shared/Icon';
import { IM_ARROW_UP8 } from '../../shared/iconConstants';
import Treemap from '../../shared/visualization/Treemap';
// import { updateNodePath } from '../../../containers/budgetActions';

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
  if (props.path.split('-').length > 5) {
    curPath = props.path.split('-').slice(0, 5).join('-');
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

const goUp = (props, numLevels) => {
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
    let stepsUp = numLevels;
    if (numLevels === undefined) {
      stepsUp = 1;
    }
    curNodePathInfo = curNodePathInfo.slice(0, curNodePathInfo.length - stepsUp).join('-');
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

const renderBreadcrumb = (tree, props) => {
  const path = props.location.query.nodePath || 'root';
  const nodes = path.split('-');
  if (nodes.length === 1) {
    return (<div className="pull-left treeMapBreadcrumb"><span>Top</span></div>);
  }
  let curNode = tree;
  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = 0; j < curNode.children.length; j += 1) {
      if (curNode.children[j].key === nodes[i]) {
        curNode = curNode.children[j];
        break;
      }
    }
  }
  const levels = curNode.breadcrumbPath.slice(5).split('>');
  return (
    <div className="pull-left treeMapBreadcrumb">
      <span className="treeMapBreadcrumbLink" onClick={props.jumpUp ? () => props.jumpUp(props, levels.length) : null}>Top</span><span> &gt; </span>
      {levels.map((level, index) => {
        return (
          <div key={['breadcrumbLevel', index].join('_')} style={{ display: 'inline-block' }}>
            <span className={index < levels.length - 1 ? 'treeMapBreadcrumbLink' : ''} onClick={props.jumpUp ? () => props.jumpUp(props, levels.length - index - 1) : null}>{level}</span>
            {index < levels.length - 1 && <span> &gt;&nbsp;</span>}
          </div>
        );
      })}
    </div>
  );
};


const BudgetDetailsTreemap = (props) => {
  const myTree = props.location.query.mode === 'expenditures' || props.location.query.mode === undefined ? props.expenseTree : props.revenueTree;

  const refreshLocation = (value) => {
    browserHistory.push([props.location.pathname, '?entity=', props.location.query.entity, '&id=', props.location.query.id, '&label=', props.location.query.label, '&mode=', value, '&hideNavbar=', props.location.query.hideNavbar].join(''));
  };

  return (
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
            In the treemap below, the size and color of the rectangles represent important information about the 2017-2018 budget. The size of each rectangle is proportional to the amount of money budgeted for that category. The color of the rectangle shows the change from last year’s budget. Increases are shown in blue, decreases are orange, and white shows no change. The deeper the color, the larger the change. Click a rectangle to see a detailed breakdown for that category, or mouse over it to see the description and total amount.
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12">
          <div className="btn-group pull-left" style={{ marginRight: '3px', marginBottom: '3px' }}>
            <button className="btn btn-primary btn-xs" onClick={props.jumpUp ? () => props.jumpUp(props) : null} disabled={props.location.query.nodePath === 'root' || props.location.query.nodePath === undefined}><Icon path={IM_ARROW_UP8} size={16} /></button>
          </div>
          {renderBreadcrumb(myTree, props)}
          <div className="btn-group pull-left" style={{ display: 'none' }} >
            <button className={getButtonClass(props.categoryType, 'use')}>Use</button>
            <button className={getButtonClass(props.categoryType, 'department')}>Departments</button>
          </div>
          <div className="radioGroup pull-right" style={{ marginLeft: '10px' }}>
            <RadioGroup name="treemapRadios" selectedValue={props.location.query.mode || 'expenditures'} onChange={refreshLocation}>
              <label>
                <Radio value="expenditures" />Expenditures
              </label>
              <label>
                <Radio value="revenue" />Revenue
              </label>
            </RadioGroup>
          </div>
          <Treemap data={findTop(myTree, props.location.query.nodePath || 'root')} altText={['Treemap of', (props.location.query.mode || 'expenditures')].join(' ')} diveDeeper={props.diveDeeper} differenceColors history={browserHistory} location={props.location} />
        </div>
      </div>
    </div>
  );
};

BudgetDetailsTreemap.propTypes = {
  categoryType: PropTypes.string,
  expenseTree: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  revenueTree: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  location: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  diveDeeper: PropTypes.func,
  jumpUp: PropTypes.func,
  // expensePath: PropTypes.string,
  // revenuePath: PropTypes.string,
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

