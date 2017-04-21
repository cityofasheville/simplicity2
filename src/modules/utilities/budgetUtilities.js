import tree from 'data-tree';

const last4Yrs = [
  2015,
  2016,
  2017,
  2018,
];

const levels = [
  'func_id',
  'dept_id',
  'div_id',
  'obj_id',
];

const levelNames = [
  'function_name',
  'department_name',
  'division_name',
  'account_name',
];

const calculateDelta = (proposed, oneYearAgo, accountType) => {
  let multiplier = 1; // so flip colors if revenue (unless that is going to be confusing...?)
  if (accountType === 'R') {
    multiplier = -1;
  }
  if (proposed === 0) {
    if (oneYearAgo > 0) {
      return -1 * multiplier;
    }
    if (oneYearAgo < 0) {
      return 1 * multiplier;
    }
    return 0;
  }
  if (oneYearAgo === 0) {
    if (proposed > 0) {
      return 1 * multiplier;
    }
    if (proposed < 0) {
      return -1 * multiplier;
    }
    return 0;
  }
  return ((proposed - oneYearAgo) / proposed) * multiplier;
};

const exportForDetails = aTree => (
  aTree.export(data => (Object.assign({}, data, { delta: calculateDelta(data.proposed, data.oneYearAgo, data.account_type) })))
);

const searchChildrenForKey = (aKey, aTreeNode) => {
  const children = aTreeNode.childNodes();
  for (let i = 0; i < children.length; i += 1) {
    if (children[i].data().key === aKey) {
      return children[i];
    }
  }
  return null;
};

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
          curNode.data(Object.assign({}, curNode.data(), { proposed: curNode.data().proposed + data[i].budget }, { size: curNode.data().size + data[i].budget }, { amount: curNode.data().amount + data[i].budget }));
        } else if (yearIndex === 2) {
          curNode.data(Object.assign({}, curNode.data(), { oneYearAgo: curNode.data().oneYearAgo + data[i].actual })); // but until the last year is actually complete...need budget (?)
        } else if (yearIndex === 1) {
          curNode.data(Object.assign({}, curNode.data(), { twoYearsAgo: curNode.data().twoYearsAgo + data[i].actual }));
        } else if (yearIndex === 0) {
          curNode.data(Object.assign({}, curNode.data(), { threeYearsAgo: curNode.data().threeYearsAgo + data[i].actual }));
        }
      }
    }
  }
  return {
    expenseTree: exportForDetails(exTree),
    revenueTree: exportForDetails(revTree),
  };
};
