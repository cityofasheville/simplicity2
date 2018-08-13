import React from 'react';
import { browserHistory } from 'react-router';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { RadioGroup, Radio } from 'react-radio-group';
import Icon from '../../shared/Icon';
import { IM_ARROW_UP8 } from '../../shared/iconConstants';
import Treemap from '../../shared/visualization/Treemap';
import { getBudgetTrees } from './graphql/budgetQueries';
import { refreshLocation } from '../../utilities/generalUtilities';
import LoadingAnimation from '../../shared/LoadingAnimation';
import Error from '../../shared/Error';
import { withLanguage } from '../../utilities/lang/LanguageContext';
import { english } from './english';
import { spanish } from './spanish';

const getButtonClass = (categoryType, buttonName) => {
  if (
    (categoryType === 'use' && buttonName === 'use') ||
    (categoryType === 'department' && buttonName === 'department')) {
    return 'btn btn-primary btn-xs active';
  }
  return 'btn btn-primary btn-xs';
};

const goDeeper = (props, location, history) => {
  let curPath = props.path;
  if (props.path.split('_').length > 5) {
    curPath = props.path.split('_').slice(0, 5).join('_');
  }
  let newURL = [location.pathname, '?',
    Object.entries(location.query).map(([key, value]) => {
      if (key !== 'nodePath') {
        return [key, '=', value, '&'].join('');
      }
      return '';
    }).join('')].join('');
  newURL = [newURL, 'nodePath=', curPath].join('');
  history.replace(newURL);
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
    let curNodePathInfo = encodeURIComponent(curPath).split('_');
    let stepsUp = numLevels;
    if (numLevels === undefined) {
      stepsUp = 1;
    }
    curNodePathInfo = curNodePathInfo.slice(0, curNodePathInfo.length - stepsUp).join('_');
    newURL = [newURL, 'nodePath=', curNodePathInfo].join('');
  }
  browserHistory.replace(newURL);
};

const findTop = (data, path) => {
  const nodes = path.split('_');
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

const renderBreadcrumb = (tree, props, top) => {
  const path = props.location.query.nodePath || 'root';
  const nodes = path.split('_');
  if (nodes.length === 1) {
    return (<div className="pull-left treeMapBreadcrumb"><span>{top}</span></div>);
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
      <span
        className="treeMapBreadcrumbLink"
        onClick={props.jumpUp ? () => props.jumpUp(props, levels.length) : null}
      >{top}
      </span><span> &gt; </span>
      {levels.map((level, index) => {
        return (
          <div key={['breadcrumbLevel', index].join('_')} style={{ display: 'inline-block' }}>
            <span
              className={index < levels.length - 1 ? 'treeMapBreadcrumbLink' : ''}
              onClick={props.jumpUp ? () => props.jumpUp(props, levels.length - index - 1) : null}>{level}
            </span>
            {index < levels.length - 1 && <span> &gt;&nbsp;</span>}
          </div>
        );
      })}
    </div>
  );
};

const BudgetDetailsTreemap = props => (
  <Query
    query={getBudgetTrees}
  >
    {({ loading, error, data }) => {
      if (loading) return <LoadingAnimation />;
      if (error) return <Error message={error.message} />;

      // set language
      let content;
      switch (props.language.language) {
        case 'Spanish':
          content = spanish;
          break;
        default:
          content = english;
      }

      const myTree = props.location.query.mode === 'expenditures' ||
        props.location.query.mode === undefined ?
        data.budgetTrees.expenseTree : data.budgetTrees.revenueTree;

      const getNewUrlParams = mode => (
        {
          mode,
          nodePath: 'root',
        }
      );

      const translateMode = (mode) => {
        if (!mode) {
          return content.expenditures;
        }
        switch (mode.toLowerCase()) {
          case 'revenue':
            return content.revenue;
          default:
            return content.expenditures;
        }
      };

      return (
        <div>
          <div className="row">
            <div className="col-sm-12">
              <h2>
                {content.treemap_of} {translateMode(props.location.query.mode).toLowerCase()}
              </h2>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <div style={{ marginBottom: '15px' }}>
                {content.treemap_instructions_1} {`${parseInt(props.data.budgetParameters.end_year, 10) - 1}-${props.data.budgetParameters.end_year}`} {content.treemap_instructions_2}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <div
                className="btn-group pull-left"
                style={{ marginRight: '3px', marginBottom: '3px' }}
              >
                <button
                  className="btn btn-primary btn-xs"
                  onClick={props.jumpUp ? () => props.jumpUp(props) : null}
                  disabled={props.location.query.nodePath === 'root' ||
                    props.location.query.nodePath === undefined}
                ><Icon path={IM_ARROW_UP8} size={16} />
                </button>
              </div>
              {renderBreadcrumb(myTree, props, content.top)}
              <div className="btn-group pull-left" style={{ display: 'none' }} >
                <button
                  className={getButtonClass(props.categoryType, 'use')}
                >{content.use}
                </button>
                <button
                  className={getButtonClass(props.categoryType, 'department')}
                >{content.departments}
                </button>
              </div>
              <div className="radioGroup pull-right" style={{ marginLeft: '10px' }}>
                <RadioGroup
                  name="treemapRadios"
                  selectedValue={props.location.query.mode || 'expenditures'}
                  onChange={value => refreshLocation(getNewUrlParams(value), props.location)}
                >
                  <label>
                    <Radio value="expenditures" />{content.expenditures}
                  </label>
                  <label>
                    <Radio value="revenue" />{content.revenue}
                  </label>
                </RadioGroup>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <Treemap
                data={findTop(myTree, props.location.query.nodePath || 'root')}
                altText={`${content.treemap_of} ${translateMode(props.location.query.mode).toLowerCase()}`}
                diveDeeper={props.diveDeeper}
                differenceColors
                history={browserHistory}
                location={props.location}
              />
            </div>
          </div>
        </div>
      );
    }}
  </Query>
);

BudgetDetailsTreemap.propTypes = {
  categoryType: PropTypes.string,
  location: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  diveDeeper: PropTypes.func,
  jumpUp: PropTypes.func,
};

BudgetDetailsTreemap.defaultProps = {
  categoryType: 'department',
  diveDeeper: goDeeper,
  jumpUp: goUp,
};

export default withLanguage(BudgetDetailsTreemap);
