export const getCategoryBarChartData = (projectData, categories, mode) => {
  const categoryBarData = {};
  for (let cat of categories) {
    categoryBarData[cat] = 0;
  }

  for (let project of projectData) {
    if (categories.includes(mapProjectToCategory(project))) {
      if (mode !== 'bond' ||
        (mode === 'bond' && project.type === 'Bond')
      ) {
        categoryBarData[mapProjectToCategory(project)] += 1;
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
    if (categories.includes(mapProjectToCategory(project))) {
      if (mode !== 'bond' ||
        (mode === 'bond' && project.type === 'Bond')
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
    if (categories.includes(mapProjectToCategory(project))) {
      if (mode !== 'bond' ||
        (mode === 'bond' && project.type === 'Bond')
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

export const mapProjectToCategory = (projectData) => {
  switch (projectData.category) {
    case 'Parks Program':
      return 'Parks';
    case 'Transportation Program':
      return 'Transportation';
    case 'Housing Program':
      return 'Housing';
    case 'Transportation & Infrastructure':
      return 'Transportation';
    case 'Affordable Housing':
      return 'Housing';
    case 'Public Safety':
      return 'Public Safety';
    case 'Parks & Recreation':
      return 'Parks';
    default:
      return 'Other';
  }
};

export const getFundsAllocatedAndExpended = (projectData, categories, mode) => {
  let totalExpended = 0;
  let totalAllocated = 0;
  let totalEncumbered = 0;

  for (let project of projectData) {
    if (categories.includes(mapProjectToCategory(project))) {
      if (mode !== 'bond' ||
      (mode === 'bond' && project.type === 'Bond')
      ) {
        totalExpended += parseFloat(project.total_spent);
        totalEncumbered += parseFloat(project.encumbered);
        if (project.total_project_funding_budget_document !== null && project.total_project_funding_budget_document.trim() !== '') {
          let allocated = project.total_project_funding_budget_document.indexOf('$') === 0 ? project.total_project_funding_budget_document.slice(1).split(',').join('') : project.total_project_funding_budget_document.split(',').join('');
          totalAllocated += parseFloat(allocated);
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
    if (categories.includes(mapProjectToCategory(project))) {
      if (mode === 'bond') {
        if (project.type === 'Bond') {
          filteredProjects.push(project);
        }
      } else {
        filteredProjects.push(project);
      }
    }
  }
  return filteredProjects;
};

export const urlCategory = (category) => {
  switch (category) {
    case 'Transportation':
      return 'transportation';
    case 'Parks':
      return 'parks';
    case 'Housing':
      return 'housing';
    case 'Public Safety':
      return 'public_safety';
    default:
      return 'other';
  }
};

export const longCategory = (category) => {
  switch (category.toLowerCase()) {
    case 'transportation':
      return 'Transportation';
    case 'parks':
      return 'Parks';
    case 'housing':
      return 'Housing';
    case 'public_safety':
      return 'Public Safety';
    default:
      return 'Other';
  }
};

export const longCategories = (categories) => {
  const longCats = [];
  for (let cat of categories) {
    const lowerCat = cat.toLowerCase();
    if (lowerCat === 'housing') {
      longCats.push('Affordable Housing');
      longCats.push('Housing Program');
    } else if (lowerCat === 'transportation') {
      longCats.push('Transportation & Infrastructure');
      longCats.push('Transportation Program');
    } else if (lowerCat === 'parks') {
      longCats.push('Parks & Recreation');
      longCats.push('Parks Program');
    } else if (lowerCat === 'public safety') {
      longCats.push('Public Safety');
    } else {
      longCats.push('Economic Development');
      longCats.push('General Government');
    }
  }
  return longCats;
};
