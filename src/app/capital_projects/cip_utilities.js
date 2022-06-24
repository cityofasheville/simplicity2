export const getCategoryBarChartData = (projectData, categories, mode) => {
  const categoryBarData = {};
  for (let cat of categories) {
    categoryBarData[cat] = 0;
  }

  for (let project of projectData) {
    if (categories.includes(project.category)) {
      if (mode !== 'bond' ||
        (mode === 'bond' && project.type.toLowerCase() === 'bond')
      ) {
        categoryBarData[project.category] += 1;
      }
    }
  }

  return [categoryBarData];
};

export const getPhaseBarChartData = (projectData, categories, mode) => {
  let numInPlanning = 0;
  let numInDesign = 0;
  let numInConstruction = 0;
  let numCompleted = 0;
  let numOngoing = 0;

  for (let project of projectData) {
    if (categories.includes(project.category)) {
      if (mode !== 'bond' ||
        (mode === 'bond' && project.type.toLowerCase() === 'bond')
      ) {
        switch (project.status) {
          case 'Planning':
            numInPlanning += 1;
            break;
          case 'Design':
            numInDesign += 1;
            break;
          case 'Construction':
            numInConstruction += 1;
            break;
          case 'Completed':
            numCompleted += 1;
            break;
          default:
            numOngoing += 1;
        }
      }
    }
  }

  const barData = [{
    Ongoing: numOngoing,
    Design: numInDesign,
    Planning: numInPlanning,
    Constuction: numInConstruction,
    Completed: numCompleted,
  }];

  return barData;
};

export const getPhasePieChartData = (projectData, categories, mode) => {
  let numInPlanning = 0;
  let numInDesign = 0;
  let numInConstruction = 0;
  let numCompleted = 0;
  let numOngoing = 0;

  for (let project of projectData) {
    if (categories.includes(project.category)) {
      if (mode !== 'bond' ||
        (mode === 'bond' && project.type.toLowerCase() === 'bond')
      ) {
        switch (project.status) {
          case 'Planning':
            numInPlanning += 1;
            break;
          case 'Design':
            numInDesign += 1;
            break;
          case 'Construction':
            numInConstruction += 1;
            break;
          case 'Completed':
            numCompleted += 1;
            break;
          default:
            numOngoing += 1;
        }
      }
    }
  }

  const pieData = [];
  if (numOngoing > 0) {
    pieData.push({ name: 'Ongoing', value: numOngoing });
  }
  pieData.push({ name: 'Completed', value: numCompleted });
  pieData.push({ name: 'Construction', value: numInConstruction });
  pieData.push({ name: 'Design', value: numInDesign });
  pieData.push({ name: 'Planning', value: numInPlanning });

  return pieData;
};

export const getFundsAllocatedAndExpended = (projectData, categories, mode) => {
  let totalExpended = 0;
  let totalAllocated = 0;
  let totalEncumbered = 0;

  for (let project of projectData) {
    if (categories.includes(project.category)) {
      if (mode !== 'bond' ||
        (mode === 'bond' && project.type.toLowerCase() === 'bond')
      ) {
        totalExpended += parseFloat(project.total_spent);
        totalEncumbered += parseFloat(project.encumbered);
        if (project.total_project_funding_budget_document !== null && project.total_project_funding_budget_document.trim() !== '') {
          let cleanBudgetAmount = project.total_project_funding_budget_document.replace(/ /g, "");
          let allocated = cleanBudgetAmount.indexOf('$') === 0 ? cleanBudgetAmount.slice(1).split(',').join('') : cleanBudgetAmount.split(',').join('');
          // console.log(cleanBudgetAmount, allocated, isNaN(allocated));
          if (!isNaN(allocated)) {
            totalAllocated += parseFloat(allocated);
          }
        }
      }
    }
  }

  return [{
    allocated: parseInt(totalAllocated, 10),
    'Expended funds': parseInt(totalExpended, 10),
    'Remaining funds': parseInt(totalAllocated, 10) - parseInt(totalExpended, 10),
    'Under contract': parseInt(totalEncumbered, 10),
  }];
};

export const filterProjects = (projects, categories, mode) => {
  const filteredProjects = [];
  for (let project of projects) {
    if (categories.includes(project.category)) {
      if (mode === 'bond') {
        if (project.type.toLowerCase() === 'bond') {
          filteredProjects.push(project);
        }
      } else {
        filteredProjects.push(project);
      }
    }
  }
  return filteredProjects;
};

export const urlCategory = category => (
  encodeURIComponent(category)
);
