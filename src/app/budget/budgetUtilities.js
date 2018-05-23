import tree from 'data-tree';
const objectAssign = require('object-assign');

// levels for use in the Treemap
const expenseLevels = ['budget_section_id', 'dept_id', 'div_id', 'obj_id'];

// level names for use in the Treemap
const expenseLevelNames = [
  'budget_section_name',
  'department_name',
  'division_name',
  'account_name',
];

// levels for use in the Treemap
const revenueLevels = ['category_id', 'dept_id', 'div_id', 'obj_id'];

// level names for use in the Treemap
const revenueLevelNames = ['category_name', 'department_name', 'division_name', 'account_name'];

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
  const percentChange = proposed === 0 ? -1 : (proposed - oneYearAgo) / proposed;
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
    const maxDelta = Math.max(...flattenedTree.children.map(child => Math.abs(child.delta))); // eslint-disable-line
    const factor = maxDelta === 0 ? 0 : 1 / maxDelta;
    flattenedTree.children[i].delta *= factor; // eslint-disable-line no-param-reassign
    convertDelta(flattenedTree.children[i]);
  }
};

// flatten the tree and export for use by the budget Treemap
const exportForDetails = (aTree) => {
  const flattened = aTree.export(data =>
    objectAssign(
      {},
      data,
      {
        delta:
          data.yearAmounts[data.yearAmounts.length - 1].amount -
          data.yearAmounts[data.yearAmounts.length - 2].amount,
      },
      {
        deltaPercent: calculateDeltaPercent(
          data.yearAmounts[data.yearAmounts.length - 1].amount,
          data.yearAmounts[data.yearAmounts.length - 2].amount
        ),
      }
    ));
  convertDelta(flattened);
  return flattened;
};

const removeZerosFromFlattened = (flattenedTree) => {
  flattenedTree.children = flattenedTree.children.filter(child => child.amount !== 0); // eslint-disable-line no-param-reassign
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

// helper function to insert copies of leaf nodes below themselves (in the flattened tree)
const insertLeafCopies = (flattenedTree) => {
  if (flattenedTree.children.length === 0) {
    const splitBreadcrumbPath = flattenedTree.breadcrumbPath.split('>');
    const splitPath = flattenedTree.path.split('_');
    flattenedTree.children = [
      objectAssign(
        {},
        flattenedTree,
        {
          breadcrumbPath: [
            flattenedTree.breadcrumbPath,
            splitBreadcrumbPath[splitBreadcrumbPath.length - 1],
          ].join('>'),
        },
        { path: [flattenedTree.path, splitPath[splitPath.length - 1]].join('_') }
      ),
    ]; // eslint-disable-linesplitBreadcrumbPath
  } else {
    for (let i = 0; i < flattenedTree.children.length; i += 1) {
      insertLeafCopies(flattenedTree.children[i]);
    }
  }
};

// builds two trees, one for revenue and one for expense, based on the passed in data
export const buildTrees = (data, budgetParameters) => {
  const budgetYears = getBudgetYears(budgetParameters);
  const exTree = tree.create();
  const revTree = tree.create();
  let theTree = revTree;
  let theLevels = expenseLevels;
  let theLevelNames = expenseLevelNames;
  exTree.insert({ key: 'root' });
  revTree.insert({ key: 'root' });
  for (let i = 0; i < data.length; i += 1) {
    const yearIndex = budgetYears.indexOf(data[i].year);
    if (yearIndex > -1) {
      theTree = data[i].account_type === 'E' ? exTree : revTree;
      theLevels = data[i].account_type === 'E' ? expenseLevels : revenueLevels;
      theLevelNames = data[i].account_type === 'E' ? expenseLevelNames : revenueLevelNames;
      let curNode = theTree.rootNode();
      let curParent = theTree.rootNode();
      for (let j = 0; j < theLevels.length; j += 1) {
        curNode = searchChildrenForKey(data[i][theLevels[j]], curParent);
        let curPath = 'root';
        let breadCrumbPath = 'root';
        for (let k = 0; k <= j; k += 1) {
          curPath = [curPath, encodeURIComponent(data[i][theLevels[k]])].join('_');
          breadCrumbPath = [breadCrumbPath, data[i][theLevelNames[k]]].join('>');
        }
        if (curNode === null) {
          curNode = theTree.insertToNode(curParent, {
            key: data[i][theLevels[j]],
            path: curPath,
            breadcrumbPath: breadCrumbPath,
            [theLevels[j]]: data[i][theLevels[j]],
            name: data[i][theLevelNames[j]],
            yearAmounts: budgetYears.map(year => ({
              year,
              amount: 0,
            })),
            size: 0,
            amount: 0,
            account_type: data[i].account_type,
          });
        }
        curParent = curNode;
        curNode.data(objectAssign({}, curNode.data(), {
          yearAmounts: curNode.data().yearAmounts.map((year, idx) => {
            if (idx === yearIndex) {
              return data[i].use_actual === 'true'
                ? { year: year.year, amount: year.amount + data[i].actual }
                : { year: year.year, amount: year.amount + data[i].budget };
            }
            return year;
          }),
        }));
        if (yearIndex === budgetYears.length - 1) {
          curNode.data(objectAssign(
            {},
            curNode.data(),
            {
              amount:
                  data[i].use_actual === 'true'
                    ? curNode.data().amount + data[i].actual
                    : curNode.data().amount + data[i].budget,
            },
            {
              size:
                  data[i].use_actual === 'true'
                    ? curNode.data().size + data[i].actual
                    : curNode.data().size + data[i].budget,
            }
          ));
        }
      }
    }
  }
  roundTree(exTree.rootNode());
  roundTree(revTree.rootNode());
  const exTreeForTreemap = exportForDetails(exTree);
  const revTreeForTreemap = exportForDetails(revTree);
  insertLeafCopies(exTreeForTreemap);
  insertLeafCopies(revTreeForTreemap);
  removeZerosFromFlattened(exTreeForTreemap);
  removeZerosFromFlattened(revTreeForTreemap);
  return {
    expenseTree: exportForDetails(exTree),
    revenueTree: exportForDetails(revTree),
    expenseTreeForTreemap: exTreeForTreemap,
    revenueTreeForTreemap: revTreeForTreemap,
  };
};

const roundTree = (node) => {
  node.data(objectAssign(
    {},
    node.data(),
    { size: Math.round(node.data().size) },
    { amount: Math.round(node.data().amount) },
    {
      yearAmounts: node.data().yearAmounts
        ? node
          .data()
          .yearAmounts.map(yearAmount => ({
            year: yearAmount.year,
            amount: Math.round(yearAmount.amount),
          }))
        : [{ year: 1234, amount: 0 }, { year: 1234, amount: 0 }],
    } // not great just to get dummy value for root
  ));
  node.childNodes().forEach(c => roundTree(c));
};

// helper function to create list of all potential summary keys found for summary data
const createSummaryKeys = (data) => {
  const keys = [];
  let keyAlreadyPresent;
  for (let i = 0; i < data.length; i += 1) {
    if (data[i].account_type === 'E') {
      // only care about 'E' for now
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
const createSummaryValues = (data, budgetParameters) =>
  data.map(item => ({
    display_year: `${parseInt(item.year, 10) - 1}-${parseInt(item.year, 10)
      .toString()
      .slice(2, 4)}`,
    label: item.category_name,
    value:
      budgetParameters.end_year === item.year
        ? Math.round(item.total_budget)
        : Math.round(item.total_actual),
  }));

// this function converts the results of the query into the form that the recharts barchart can handle
// must have an object with dataKeys (list of string keys), and dataValues (object with one value for each key from dataKeys, and a year)
export const buildSummaryData = (data, budgetParameters) => {
  const summaryData = {
    dataKeys: createSummaryKeys(data),
    dataValues: createSummaryValues(data, budgetParameters),
  };
  return summaryData;
};

// this function converts the results of the cash flow query into the form that the Sankey.js component can handle
export const buildCashFlowData = (data) => {
  const fundNames = [];
  const fundNodes = [];
  let sankeyNodes = [];
  const sankeyLinks = [];
  const categoryNames = [];
  const departmentNames = [];
  const revenueNodes = [];
  const expenseNodes = [];
  let allExpenseRevenueRows = data.glBudgetCashFlowExpenses.concat(data.glBudgetCashFlowRevenues);
  let linkAlreadyExists = false;
  const fundsToInclude = ['1100', '6100', '6200', '6260', '6240', '6220', '6500'];
  const fundDisplayNames = [
    'General Fund',
    'Water Resources',
    'Parking Services',
    'US Cellular Center',
    'Stormwater',
    'Street Cut',
    'Transit Services',
  ];
  const managementAndSupportDepts = [
    'Legal Department',
    'Community & Public Engagement',
    'Human Resources Department',
    'Information Technology Dept.',
    'Administration Services Dept',
    'Finance Department',
    'General Services Department',
  ];
  const communityAndResidentDepts = [
    'Development Services Dept.',
    'Community & Economic Dev. Dept',
    'Equity & Inclusion',
    'Planning & Development Dept',
    'Capital Project Management Dep',
  ];
  const convertFundNameToDisplayName = (fundId) => {
    const fundIndex = fundsToInclude.indexOf(fundId);
    return fundIndex === -1 ? 'Other' : fundDisplayNames[fundIndex];
  };
  const convertDeptNameToDisplayName = (deptName) => {
    switch (deptName) {
      case 'Non-Departmental Department':
        return 'Nondepartmental/Capital Program';
      default:
        return deptName;
    }
  };
  allExpenseRevenueRows = allExpenseRevenueRows
    .filter(item => fundsToInclude.indexOf(item.fund_id) > -1)
    .map((item) => {
      if (item.account_type === 'E') {
        return objectAssign({}, item, {
          name:
            managementAndSupportDepts.indexOf(item.department_name) > -1
              ? 'Management & Support Services'
              : communityAndResidentDepts.indexOf(item.department_name) > -1
                ? 'Other Community & Resident Services'
                : convertDeptNameToDisplayName(item.department_name),
          fund_name: convertFundNameToDisplayName(item.fund_id),
        }); // eslint-disable-line
      }
      return objectAssign({}, item, {
        name: item.category_name,
        fund_name: convertFundNameToDisplayName(item.fund_id),
      });
    });
  // group expenses, revenues, and funds into their department, category, and funds - because the nodes are only one per
  // fund_name, category, and fund
  for (let i = 0; i < allExpenseRevenueRows.length; i += 1) {
    if (fundNames.indexOf(allExpenseRevenueRows[i].fund_name) < 0) {
      fundNames.push(allExpenseRevenueRows[i].fund_name);
      fundNodes.push({ name: allExpenseRevenueRows[i].fund_name });
    }
    if (allExpenseRevenueRows[i].account_type === 'R') {
      if (categoryNames.indexOf(allExpenseRevenueRows[i].name) < 0) {
        categoryNames.push(allExpenseRevenueRows[i].name);
        revenueNodes.push({ name: allExpenseRevenueRows[i].name });
      }
    } else if (departmentNames.indexOf(allExpenseRevenueRows[i].name) < 0) {
      departmentNames.push(allExpenseRevenueRows[i].name);
      expenseNodes.push({ name: allExpenseRevenueRows[i].name });
    }
  }
  // now go through and create links -- which assumes in the end there will only be one array of nodes, consisting of the revenues, expenses
  // and fund nodes combined. therefore to calculate the indices we have to add an offset since we haven't combined them yet
  const revenueOffset = 0;
  const fundsOffset = revenueNodes.length;
  const expensesOffset = revenueNodes.length + fundNodes.length;
  for (let i = 0; i < allExpenseRevenueRows.length; i += 1) {
    linkAlreadyExists = false;
    if (allExpenseRevenueRows[i].account_type === 'R') {
      // link is source index, target index, and value
      // must find if there is already a link from the source to the target, and if so, then just add the value to the sum instead of pushing
      for (let j = 0; j < sankeyLinks.length; j += 1) {
        if (
          sankeyLinks[j].source ===
            categoryNames.indexOf(allExpenseRevenueRows[i].name) + revenueOffset &&
          sankeyLinks[j].target ===
            fundNames.indexOf(allExpenseRevenueRows[i].fund_name) + fundsOffset
        ) {
          sankeyLinks[j].value += allExpenseRevenueRows[i].budget;
          linkAlreadyExists = true;
          break;
        }
      }
      if (!linkAlreadyExists) {
        sankeyLinks.push({
          source: categoryNames.indexOf(allExpenseRevenueRows[i].name) + revenueOffset,
          target: fundNames.indexOf(allExpenseRevenueRows[i].fund_name) + fundsOffset,
          value: allExpenseRevenueRows[i].budget,
        });
      }
    } else {
      for (let j = 0; j < sankeyLinks.length; j += 1) {
        if (
          sankeyLinks[j].source ===
            fundNames.indexOf(allExpenseRevenueRows[i].fund_name) + fundsOffset &&
          sankeyLinks[j].target ===
            departmentNames.indexOf(allExpenseRevenueRows[i].name) + expensesOffset
        ) {
          sankeyLinks[j].value += allExpenseRevenueRows[i].budget;
          linkAlreadyExists = true;
          break;
        }
      }
      if (!linkAlreadyExists) {
        sankeyLinks.push({
          source: fundNames.indexOf(allExpenseRevenueRows[i].fund_name) + fundsOffset,
          target: departmentNames.indexOf(allExpenseRevenueRows[i].name) + expensesOffset,
          value: allExpenseRevenueRows[i].budget,
        });
      }
    }
  }
  // combine the revenues, funds, expenses nodes into one array
  sankeyNodes = revenueNodes.concat(fundNodes).concat(expenseNodes);
  sankeyNodes = sankeyNodes.map(node => objectAssign({}, node, { value: Math.round(node.value) }));
  return { sankeyNodes, sankeyLinks };
};

export const getBudgetYears = (budgetParameters) => {
  const numYears =
    parseInt(budgetParameters.end_year, 10) - parseInt(budgetParameters.start_year, 10);
  const years = [];
  for (let i = 0; i < numYears + 1; i += 1) {
    years.push(parseInt(budgetParameters.start_year, 10) + i);
  }
  return years;
};

export const createAnnotations = (budgetParameters) => {
  const numYears =
    parseInt(budgetParameters.end_year, 10) - parseInt(budgetParameters.start_year, 10);
  const annotations = [];
  for (let i = 0; i < numYears + 1; i += 1) {
    annotations.push({
      type: 'or',
      display_year: `${parseInt(budgetParameters.start_year, 10) + (i - 1)}-${(
        parseInt(budgetParameters.start_year, 10) + i
      )
        .toString()
        .slice(2, 4)}`,
      label:
        i < numYears ? 'Actual Spent' : budgetParameters.in_budget_season ? 'Proposed' : 'Adopted',
      budgetAnnotation: true,
    });
  }
  return annotations;
};
