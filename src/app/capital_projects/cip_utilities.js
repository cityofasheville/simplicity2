export const getCategoryBarChartData = (projectData, categories, mode) => {
  const categoryBarData = {};
  for (let cat of categories) {
    categoryBarData[cat] = 0;
  }

  for (let project of projectData) {
    if (categories.includes(mapProjectToCategory(project))) {
      if (mode !== 'bond' ||
        ( mode === 'bond' && ['Bond - Parks Program', 'Bond - Housing Program', 'Bond - Transportation Program'].includes(project.Category) )
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
        ( mode === 'bond' && ['Bond - Parks Program', 'Bond - Housing Program', 'Bond - Transportation Program'].includes(project.Category) )
      ) {
        switch(project.status) {
          case 'Status: Planning':
            numInPlanning += 1;
            break;
          case 'Status: Design':
            numInDesign += 1;
            break;
          case 'Status: Construction':
            numInConstruction += 1;
            break;
          case 'Status: Completed':
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
        ( mode === 'bond' && ['Bond - Parks Program', 'Bond - Housing Program', 'Bond - Transportation Program'].includes(project.category) )
      ) {
        switch(project.status) {
          case 'Status: Planning':
            numInPlanning += 1;
            break;
          case 'Status: Design':
            numInDesign += 1;
            break;
          case 'Status: Construction':
            numInConstruction += 1;
            break;
          case 'Status: Completed':
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
    case 'Bond - Parks Program':
      return 'Parks';
    case 'Bond - Transportation Program':
      return 'Transportation';
    case 'Bond - Housing Program':
      return 'Housing';
    case 'CIP - Transportation & Infrastructure':
      return 'Transportation';
    case 'CIP - Affordable Housing':
      return 'Housing';
    case 'CIP - Public Safety':
      return 'Public Safety';
    case 'CIP - Parks & Recreation':
      return 'Parks';
    default:
      return 'Other';
  }
};

export const getFundsAllocatedAndExpended = (projectData, categories, mode) => {
  let totalExpended = 0;
  let totalAllocated = 0;

  for (let project of projectData) {
    if (categories.includes(mapProjectToCategory(project))) {
      if (mode !== 'bond' ||
      ( mode === 'bond' && ['Bond - Parks Program', 'Bond - Housing Program', 'Bond - Transportation Program'].includes(project.category) )
    ) {
      totalExpended += parseFloat(project.total_spent);
      if (project.total_project_funding_budget_document.trim() !== '') {
        let allocated = project.total_project_funding_budget_document.indexOf('$') === 0 ? project.total_project_funding_budget_document.slice(1).split(',').join('') : project.total_project_funding_budget_document.split(',').join('');
        totalAllocated += parseFloat(allocated);
      }
    }
    }
  }

  return [{allocated: parseInt(totalAllocated), 'Expended funds': parseInt(totalExpended), 'Remaining funds': parseInt(totalAllocated) - parseInt(totalExpended)}];
};

export const filterProjects = (projects, categories, mode) => {
  const filteredProjects = [];
  for (let project of projects) {
    if (categories.includes(mapProjectToCategory(project))) {
      if (mode === 'bond') {
        if (['Bond - Parks Program', 'Bond - Housing Program', 'Bond - Transportation Program'].includes(project.category)) {
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
      longCats.push('CIP - Affordable Housing');
      longCats.push('Bond - Housing Program');
    }
    else if (lowerCat === 'transportation') {
      longCats.push('CIP - Transportation & Infrastructure');
      longCats.push('Bond - Transportation Program');
    }
    else if (lowerCat === 'parks') {
      longCats.push('CIP - Parks & Recreation');
      longCats.push('Bond - Parks Program');
    }
    else if (lowerCat === 'public safety') {
      longCats.push('CIP - Public Safety');
    }
    else {
      longCats.push('CIP - Economic Development');
      longCats.push('CIP - General Government');
    }
  }
  return longCats;
};
