import tree from 'data-tree';

const last4Years = [
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
  'object_name',
];

const printTree = (aTree) => {
  aTree.traverser().traverseBFS(node => (
    console.log(node.data())
  ));
};

const searchChildrenForKey = (aKey, aTreeNode) => {
  const children = aTreeNode.childNodes();
  for (let i = 0; i < children.length; i += 1) {
    if (children[i].data().key === aKey) {
      return children[i];
    }
  }
  return null;
};

export const buildTrees = (data) => {
  const expenseTree = tree.create();
  const revenueTree = tree.create();
  let theTree = revenueTree;
  expenseTree.insert({ key: 'root' });
  revenueTree.insert({ key: 'root' });
  for (let i = 0; i < data.length; i += 1) {
    const yearIndex = last4Years.indexOf(data[i].year);
    if (yearIndex > -1) {
      theTree = data[i].account_type === 'E' ? expenseTree : revenueTree;
      let curNode = theTree.rootNode();
      let curParent = theTree.rootNode();
      for (let j = 0; j < levels.length; j += 1) {
        curNode = searchChildrenForKey(data[i][levels[j]], curParent);
        let curPath = '';
        for (let k = 0; k <= j; k += 1) {
          curPath = [curPath, data[i][levels[k]]].join('-');
        }
        curPath = curPath.slice(1);
        if (curNode === null) {
          curNode = theTree.insertToNode(curParent, { key: data[i][levels[j]], path: curPath, [levels[j]]: data[i][levels[j]], [levelNames[j]]: data[i][levelNames[j]], threeYearsAgo: 0, twoYearsAgo: 0, oneYearAgo: 0, proposed: 0 });
        }
        curParent = curNode;
        if (yearIndex === 3) {
          curNode.data(Object.assign({}, curNode.data(), { proposed: curNode.data().proposed + data[i].budget }));
        } else if (yearIndex === 2) {
          curNode.data(Object.assign({}, curNode.data(), { oneYearAgo: curNode.data().oneYearAgo + (data[i].actual || data[i].budget) }));
        } else if (yearIndex === 1) {
          curNode.data(Object.assign({}, curNode.data(), { twoYearsAgo: curNode.data().twoYearsAgo + (data[i].actual || data[i].budget) }));
        } else {
          curNode.data(Object.assign({}, curNode.data(), { threeYearsAgo: curNode.data().threeYearsAgo + (data[i].actual || data[i].budget) }));
        }
      }
    }
  }
  printTree(expenseTree, revenueTree);
};
