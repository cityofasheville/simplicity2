import tree from 'data-tree';
const objectAssign = require('object-assign');

const levels = [
  'dept_id',
  'div_id',
  'cardholder',
  'statement_id',
];

// level names
const levelNames = [
  'department',
  'division',
  'cardholder',
  'statement_id',
];

// flatten the tree and export for use by the budget Treemap
const exportForDetails = (aTree) => {
  const flattened = aTree.export(data => (objectAssign({}, data)));
  return flattened;
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

// helper function to insert copies of leaf nodes below themselves (in the flattened tree)
const insertLeafCopies = (flattenedTree) => {
  if (flattenedTree.children.length === 0) {
    const splitBreadcrumbPath = flattenedTree.breadcrumbPath.split('>');
    const splitPath = flattenedTree.path.split('_');
    flattenedTree.children = [objectAssign({}, flattenedTree, { breadcrumbPath: [flattenedTree.breadcrumbPath, splitBreadcrumbPath[splitBreadcrumbPath.length - 1]].join('>') }, { path: [flattenedTree.path, splitPath[splitPath.length - 1]].join('_') })]; // eslint-disable-linesplitBreadcrumbPath
  } else {
    for (let i = 0; i < flattenedTree.children.length; i += 1) {
      insertLeafCopies(flattenedTree.children[i]);
    }
  }
};

// builds the tree
export const buildTree = (data) => {
  const theTree = tree.create();
  theTree.insert({ key: 'root' });
  for (let i = 0; i < data.length; i += 1) {
    let curNode = theTree.rootNode();
    let curParent = theTree.rootNode();
    for (let j = 0; j < levels.length; j += 1) {
      curNode = searchChildrenForKey(data[i][levels[j]], curParent);
      let curPath = 'root';
      let breadCrumbPath = 'root';
      for (let k = 0; k <= j; k += 1) {
        curPath = [curPath, encodeURIComponent(data[i][levels[k]])].join('_');
        breadCrumbPath = [breadCrumbPath, data[i][levelNames[k]]].join('>');
      }
      if (curNode === null) {
        curNode = theTree.insertToNode(curParent, {
          key: data[i][levels[j]],
          path: curPath,
          breadcrumbPath: breadCrumbPath,
          [levels[j]]: data[i][levels[j]],
          name: data[i][levelNames[j]],
          under_30: 0,
          under_60: 0,
          under_90: 0,
          over_90: 0,
          total_count: 0,
        });
      }
      curParent = curNode;
      curNode.data(
        objectAssign(
          {},
          curNode.data(),
          {
            under_30: data[i].days_invoiced_to_reconciled <= 30 ? curNode.data().under_30 + 1 : curNode.data().under_30,
          },
          {
            under_60: data[i].days_invoiced_to_reconciled > 30 && data[i].days_invoiced_to_reconciled <= 60 ? curNode.data().under_60 + 1 : curNode.data().under_60,
          },
          {
            under_90: data[i].days_invoiced_to_reconciled > 60 && data[i].days_invoiced_to_reconciled <= 90 ? curNode.data().under_90 + 1 : curNode.data().under_90,
          },
          {
            over_90: data[i].days_invoiced_to_reconciled > 90 ? curNode.data().over_90 + 1 : curNode.data().over_90,
          },
          {
            total_count: curNode.data().total_count + 1,
          }
        ));
    }
  }
  const exTree = exportForDetails(theTree);
  insertLeafCopies(exTree);
  return exTree;
};
