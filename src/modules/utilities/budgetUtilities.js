import tree from 'data-tree';
const objectAssign = require('object-assign');

const last4Yrs = [
  2015,
  2016,
  2017,
  2018,
];

// levels for use in the Treemap
const levels = [
  'func_id',
  'dept_id',
  'div_id',
  'obj_id',
];

// level names for use in the Treemap
const levelNames = [
  'function_name',
  'department_name',
  'division_name',
  'account_name',
];

// this function calculates the delta percent that will be shown in the details Table
const calculateDeltaPercent = (proposed, oneYearAgo) => {
  if (oneYearAgo === 0 && proposed > 0) {
    return 'n/a';
  }
  if ((proposed > 0 && oneYearAgo < 0) || (proposed < 0 && oneYearAgo > 0)) {
    return 'n/a';
  }
  if (proposed === oneYearAgo) {
    return '0.00%';
  }
  const percentChange = proposed === 0 ? -1 : ((proposed - oneYearAgo) / proposed);
  if (percentChange < 0) {
    return [(percentChange * 100).toFixed(2), '%'].join('');
  }
  return ['+', (percentChange * 100).toFixed(2), '%'].join('');
};

// this function generates a delta value between 0 and 1 based on the factor so that the
// area that received the lion's share of the total increase/decrease at that level will
// be colored accordingly
const convertDelta = (flattenedTree) => {
  for (let i = 0; i < flattenedTree.children.length; i += 1) {
    const maxDelta = Math.max.apply(Math, flattenedTree.children.map(child => Math.abs(child.delta))); // eslint-disable-line
    let factor = maxDelta === 0 ? 0 : 1 / maxDelta;
    factor = flattenedTree.children[i].account_type === 'R' ? factor * -1 : factor;
    flattenedTree.children[i].delta *= factor; // eslint-disable-line no-param-reassign
    convertDelta(flattenedTree.children[i]);
  }
};

// flatten the tree and export for use by the budget Treemap
const exportForDetails = (aTree) => {
  const flattened = aTree.export(data => (objectAssign({}, data, { delta: data.proposed - data.oneYearAgo }, { deltaPercent: calculateDeltaPercent(data.proposed, data.oneYearAgo) })));
  convertDelta(flattened);
  return flattened;
};

const removeZerosFromFlattened = (flattenedTree) => {
  flattenedTree.children = flattenedTree.children.filter(child => (child.amount !== 0)); // eslint-disable-line no-param-reassign
  for (let i = 0; i < flattenedTree.children.length; i += 1) {
    removeZerosFromFlattened(flattenedTree.children[i]);
  }
};

// helper function to build the tree for the Treemap
const searchChildrenForKey = (aKey, aTreeNode) => {
  const children = aTreeNode.childNodes();
  for (let i = 0; i < children.length; i += 1) {
    if (children[i].data().key === aKey) {
      return children[i];
    }
  }
  return null;
};

// builds two trees, one for revenue and one for expense, based on the passed in data
export const buildTrees = (data, last4Years = last4Yrs) => {
  const exTree = tree.create();
  const revTree = tree.create();
  let theTree = revTree;
  exTree.insert({ key: 'root' });
  revTree.insert({ key: 'root' });
  for (let i = 0; i < data.length; i += 1) {
    const yearIndex = last4Years.indexOf(data[i].year);
    if (yearIndex > -1) {
      theTree = data[i].account_type === 'E' ? exTree : revTree;
      let curNode = theTree.rootNode();
      let curParent = theTree.rootNode();
      for (let j = 0; j < levels.length; j += 1) {
        curNode = searchChildrenForKey(data[i][levels[j]], curParent);
        let curPath = 'root';
        for (let k = 0; k <= j; k += 1) {
          curPath = [curPath, data[i][levels[k]]].join('-');
        }
        if (curNode === null) {
          curNode = theTree.insertToNode(curParent, { key: data[i][levels[j]], path: curPath, [levels[j]]: data[i][levels[j]], name: data[i][levelNames[j]], threeYearsAgo: 0, twoYearsAgo: 0, oneYearAgo: 0, proposed: 0, size: 0, amount: 0, account_type: data[i].account_type });
        }
        curParent = curNode;
        if (yearIndex === 3) {
          curNode.data(objectAssign({}, curNode.data(), { proposed: curNode.data().proposed + data[i].budget }, { size: curNode.data().size + data[i].budget }, { amount: curNode.data().amount + data[i].budget }));
        } else if (yearIndex === 2) {
          curNode.data(objectAssign({}, curNode.data(), { oneYearAgo: curNode.data().oneYearAgo + data[i].budget })); // but until the last year is actually complete...need budget (?)
        } else if (yearIndex === 1) {
          curNode.data(objectAssign({}, curNode.data(), { twoYearsAgo: curNode.data().twoYearsAgo + data[i].actual }));
        } else if (yearIndex === 0) {
          curNode.data(objectAssign({}, curNode.data(), { threeYearsAgo: curNode.data().threeYearsAgo + data[i].actual }));
        }
      }
    }
  }
  const exTreeForTreemap = exportForDetails(exTree);
  const revTreeForTreemap = exportForDetails(revTree);
  removeZerosFromFlattened(exTreeForTreemap);
  removeZerosFromFlattened(revTreeForTreemap);
  return {
    expenseTree: exportForDetails(exTree),
    revenueTree: exportForDetails(revTree),
    expenseTreeForTreemap: exTreeForTreemap,
    revenueTreeForTreemap: revTreeForTreemap,
  };
};

// helper function to create list of all potential summary keys found for summary data
const createSummaryKeys = (data) => {
  const keys = [];
  let keyAlreadyPresent;
  for (let i = 0; i < data.length; i += 1) {
    if (data[i].account_type === 'E') { // only care about 'E' for now
      keyAlreadyPresent = false;
      for (let j = 0; j < keys.length; j += 1) {
        if (keys[j] === data[i].category_name) {
          keyAlreadyPresent = true;
          break;
        }
      }
      if (!keyAlreadyPresent) {
        keys.push(data[i].category_name);
      }
    }
  }
  return keys;
};

// helper function to create list of all potential values for summary data
const createSummaryValues = (data) => {
  const values = [];
  let yearAlreadyPresent;
  for (let i = 0; i < data.length; i += 1) {
    if (data[i].account_type === 'E') { // only care about 'E' for now
      yearAlreadyPresent = false;
      for (let j = 0; j < values.length; j += 1) {
        if (values[j].year === data[i].year) {
          values[j][data[i].category_name] = [2, 3].indexOf(last4Yrs.indexOf(values[j].year)) > -1 ? data[i].total_budget : data[i].total_actual;
          yearAlreadyPresent = true;
          break;
        }
      }
      if (!yearAlreadyPresent) {
        values.push({ year: data[i].year, [data[i].category_name]: [2, 3].indexOf(last4Yrs.indexOf(data[i].year)) > -1 ? data[i].total_budget : data[i].total_actual, yearAxisNumeric: (1000 * last4Yrs.indexOf(data[i].year)) / 4 });
      }
    }
  }
  values.sort((a, b) => (
    ((a.year < b.year) ? -1 : ((a.year > b.year) ? 1 : 0)) // eslint-disable-line
  ));
  return values;
};

// this function converts the results of the query into the form that the recharts barchart can handle
// must have an object with dataKeys (list of string keys), and dataValues (object with one value for each key from dataKeys, and a year)
export const buildSummaryData = (data) => {
  const summaryData = { dataKeys: createSummaryKeys(data), dataValues: createSummaryValues(data) };
  return summaryData;
};
