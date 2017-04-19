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
]

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
    // TODO: as we go add up the amounts...
    if (last4Years.indexOf(data[i].year) > -1) {
      theTree = data[i].account_type === 'E' ? expenseTree : revenueTree;
      // Make function node or add the amount for this line item to the relevant function node
      let functionIDNode = searchChildrenForKey(data[i]['func_id'], theTree.rootNode());
      if (functionIDNode === null) {
        functionIDNode = theTree.insertToNode(theTree.rootNode(), { key: data[i].func_id, path: data[i].func_id, function_name: data[i].function_name, lastYearAmount: 0, proposedAmount: 0 });
      }
      if (data[i].year === 2017) {
        functionIDNode.data(Object.assign({}, functionIDNode.data(), { lastYearAmount: functionIDNode.data().lastYearAmount + (data[i].actual || data[i].budget) }));
      } else {
        functionIDNode.data(Object.assign({}, functionIDNode.data(), { proposedAmount: functionIDNode.data().proposedAmount + data[i].budget }));
      }
      // Make department node or add the amount for this line item to the relevant department node
      let deptIDNode = searchChildrenForKey(data[i].dept_id, functionIDNode);
      if (deptIDNode === null) {
        deptIDNode = theTree.insertToNode(functionIDNode, { key: data[i].dept_id, path: [data[i].func_id, data[i].dept_id].join('-'), department_name: data[i].department_name, lastYearAmount: 0, proposedAmount: 0 });
      }
      if (data[i].year === 2017) {
        deptIDNode.data(Object.assign({}, deptIDNode.data(), { lastYearAmount: deptIDNode.data().lastYearAmount + (data[i].actual || data[i].budget) }));
      } else {
        deptIDNode.data(Object.assign({}, deptIDNode.data(), { proposedAmount: deptIDNode.data().proposedAmount + data[i].budget }));
      }
      // Make division node or add the amount for this line item to the relevant division node
      let divisionIDNode = searchChildrenForKey(data[i].div_id, deptIDNode);
      if (divisionIDNode === null) {
        divisionIDNode = theTree.insertToNode(deptIDNode, { key: data[i].div_id, path: [data[i].func_id, data[i].dept_id, data[i].div_id].join('-'), division_name: data[i].division_name, lastYearAmount: 0, proposedAmount: 0 });
      }
      if (data[i].year === 2017) {
        divisionIDNode.data(Object.assign({}, divisionIDNode.data(), { lastYearAmount: divisionIDNode.data().lastYearAmount + (data[i].actual || data[i].budget) }));
      } else {
        divisionIDNode.data(Object.assign({}, divisionIDNode.data(), { proposedAmount: divisionIDNode.data().proposedAmount + data[i].budget }));
      }
      // TODO -- here do we need to go by project and organization as well to get unique???
      let objectIDNode = searchChildrenForKey(data[i].obj_id, divisionIDNode);
      if (objectIDNode === null) {
        objectIDNode = theTree.insertToNode(divisionIDNode, { key: data[i].obj_id, path: [data[i].func_id, data[i].dept_id, data[i].div_id, data[i].obj_id].join('-'), object_name: data[i].object_name, lastYearAmount: 0, proposedAmount: 0 });
      }
      if (data[i].year === 2017) {
        objectIDNode.data(Object.assign({}, objectIDNode.data(), { lastYearAmount: objectIDNode.data().lastYearAmount + (data[i].actual || data[i].budget) }));
      } else {
        objectIDNode.data(Object.assign({}, objectIDNode.data(), { proposedAmount: objectIDNode.data().proposedAmount + data[i].budget }));
      }
    }
  }
  printTree(expenseTree, revenueTree);
};
