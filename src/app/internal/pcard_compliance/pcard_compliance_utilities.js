import tree from 'data-tree';

const levels = [
  'dept_id',
  'div_id',
  'cardholder',
  // 'statement_id',
];

// level names
const levelNames = [
  'department',
  'division',
  'cardholder',
  // 'statement_id',
];

// flatten the tree and export for use by the budget Treemap
const exportForDetails = (aTree) => {
  const flattened = aTree.export(data => (Object.assign({}, data)));
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
    flattenedTree.children = [Object.assign({}, flattenedTree, { breadcrumbPath: [flattenedTree.breadcrumbPath, splitBreadcrumbPath[splitBreadcrumbPath.length - 1]].join('>') }, { path: [flattenedTree.path, splitPath[splitPath.length - 1]].join('_') })];
  } else {
    for (let i = 0; i < flattenedTree.children.length; i += 1) {
      insertLeafCopies(flattenedTree.children[i]);
    }
  }
};

export const buildReceiptsTree = (data) => {
  const theTree = tree.create();
  theTree.insert({ key: 'root' });
  for (let i = 0; i < data.length; i += 1) {
    let curNode = theTree.rootNode();
    let curParent = theTree.rootNode();
    for (let j = 0; j < levels.length; j += 1) {
      curNode = searchChildrenForKey(data[i][levels[j]] || 'Other', curParent);
      let curPath = 'root';
      let breadCrumbPath = 'root';
      for (let k = 0; k <= j; k += 1) {
        curPath = [curPath, encodeURIComponent(data[i][levels[k]] || 'Other')].join('_');
        breadCrumbPath = [breadCrumbPath, data[i][levelNames[k]] || 'Other'].join('>');
      }
      if (curNode === null) {
        curNode = theTree.insertToNode(curParent, {
          key: data[i][levels[j]] || 'Other',
          path: curPath,
          breadcrumbPath: breadCrumbPath,
          [levels[j]]: data[i][levels[j]] || 'Other',
          name: data[i][levelNames[j]] || 'Other',
          has_itemized_receipt: 0,
          missing_itemized_receipt: 0,
          total_receipts: 0,
        });
      }
      curParent = curNode;
      curNode.data(Object.assign(
        {},
        curNode.data(),
        {
          has_itemized_receipt: data[i].receipt === 'Y' ? curNode.data().has_itemized_receipt + 1 : curNode.data().has_itemized_receipt,
        },
        {
          missing_itemized_receipt: data[i].receipt !== 'Y' ? curNode.data().missing_itemized_receipt + 1 : curNode.data().missing_itemized_receipt,
        },
        {
          total_receipts: curNode.data().total_receipts + 1,
        }
      ));
    }
  }
  const exTree = exportForDetails(theTree);
  insertLeafCopies(exTree);
  exTree.children.sort((a, b) => {
    let compareA = null;
    let compareB = null;
    if (a === null || a.name === null) {
      compareA = '';
    }
    if (b === null || b.name === null) {
      compareB = '';
    }
    if (compareA !== '') {
      compareA = a.name.toLowerCase();
    }
    if (compareB !== '') {
      compareB = b.name.toLowerCase();
    }
    if (compareA < compareB) {
      return -1;
    }
    if (compareA > compareB) {
      return 1;
    }
    return 0;
  });

  return exTree;
};

// builds the tree
export const buildTree = (data) => {
  const theTree = tree.create();
  theTree.insert({ key: 'root' });
  for (let i = 0; i < data.length; i += 1) {
    let curNode = theTree.rootNode();
    let curParent = theTree.rootNode();
    for (let j = 0; j < levels.length; j += 1) {
      curNode = searchChildrenForKey(data[i][levels[j]] || 'Other', curParent);
      let curPath = 'root';
      let breadCrumbPath = 'root';
      for (let k = 0; k <= j; k += 1) {
        curPath = [curPath, encodeURIComponent(data[i][levels[k]] || 'Other')].join('_');
        breadCrumbPath = [breadCrumbPath, data[i][levelNames[k]] || 'Other'].join('>');
      }
      if (curNode === null) {
        curNode = theTree.insertToNode(curParent, {
          key: data[i][levels[j]] || 'Other',
          path: curPath,
          breadcrumbPath: breadCrumbPath,
          [levels[j]]: data[i][levels[j]] || 'Other',
          name: data[i][levelNames[j]] || 'Other',
          under30: 0,
          under60: 0,
          under90: 0,
          over90: 0,
          totalCount: 0,
          //statements: [],
        });
      }
      curParent = curNode;
      let daysOpen = 0;
      if (data[i].reconciled_date !== null) {
        daysOpen = data[i].days_invoiced_to_reconciled;
      } else {
        daysOpen = data[i].days_since_reconciled;
      }
      curNode.data(Object.assign(
        {},
        curNode.data(),
        {
          under30: daysOpen <= 30 ? curNode.data().under30 + 1 : curNode.data().under30,
        },
        {
          under60: daysOpen > 30 && daysOpen <= 60 ?
            curNode.data().under60 + 1 : curNode.data().under60,
        },
        {
          under90: daysOpen > 60 && daysOpen <= 90 ?
            curNode.data().under90 + 1 : curNode.data().under90,
        },
        {
          over90: daysOpen > 90 ? curNode.data().over90 + 1 : curNode.data().over90,
        },
        {
          totalCount: curNode.data().totalCount + 1,
        },
        // {
        //   statements: curNode.data().statements.concat([{
        //     statement_code: data[i].statement_code,
        //     statement_id: data[i].statement_id,
        //     statement_status: data[i].statement_status,
        //     fiscal_year: data[i].fiscal_year,
        //     fiscal_period: data[i].fiscal_period,
        //     invoiced_date: data[i].invoiced_date,
        //     reconciled_date: data[i].reconciled_date,
        //     days_invoiced_to_reconciled: data[i].days_invoiced_to_reconciled,
        //     approved_date: data[i].approved_date,
        //     days_reconciled_to_approved: data[i].days_reconciled_to_approved,
        //     days_since_invoiced: data[i].days_since_invoiced,
        //     days_since_reconciled: data[i].days_since_reconciled,
        //   }]),
        // }
      ));
    }
  }
  const exTree = exportForDetails(theTree);
  insertLeafCopies(exTree);
  exTree.children.sort((a, b) => {
    let compareA = null;
    let compareB = null;
    if (a === null || a.name === null) {
      compareA = '';
    }
    if (b === null || b.name === null) {
      compareB = '';
    }
    if (compareA !== '') {
      compareA = a.name.toLowerCase();
    }
    if (compareB !== '') {
      compareB = b.name.toLowerCase();
    }
    if (compareA < compareB) {
      return -1;
    }
    if (compareA > compareB) {
      return 1;
    }
    return 0;
  });

  return exTree;
};

export const findTop = (data, path) => {
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
  return ((curNode.children === undefined || curNode.children.length === 0) ?
    prevNode.children : curNode.children);
};
