import {
  IM_SHIELD3,
  IM_TREE,
  IM_HOME2,
  IM_BUS,
  LI_BOLD,
  IM_DROPLET,
  IM_HAMMER,
  IM_CITY,
  IM_USERS,
  IM_LIBRARY2,
  IM_SPHERE3
} from "../../shared/iconConstants";
import Icon from "../../shared/Icon";


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

export const filterProjects = (projects, categories, types, mode) => {
  const filteredProjects = [];
  for (let project of projects) {
    const isCategoryMatch = categories.includes(project.category);
    let isTypeMatch = types.includes(project.type); 

    if (project.type == 'Bond') {
      if (types.includes('Bond 2016')) {
        isTypeMatch = true
      } else {
        isTypeMatch = false
      }
    } 

    if (project.type == 'CIP') {
      if (types.includes('Operating Budget')) {
        isTypeMatch = true
      } else {
        isTypeMatch = false
      }
    } 

    if (isCategoryMatch && isTypeMatch) {
      filteredProjects.push(project);
    }
  }
  return filteredProjects;
};

export const urlCategory = category => (
  encodeURIComponent(category)
);

export function getIcon(type, bond) {
  switch (type) {
    case "Transportation & Infrastructure":
      if (bond) {
        return (
          <span>
            <Icon path={IM_BUS} size={25} color="#4077a5" />
            <Icon
              path={LI_BOLD}
              size={16}
              color="#4077a5"
              viewBox="0 0 24 24"
            />
          </span>
        );
      }
      return <Icon path={IM_BUS} size={25} color="#4077a5" />;
    case "Parks & Recreation":
      if (bond) {
        return (
          <span>
            <Icon path={IM_TREE} size={25} color="#4077a5" />
            <Icon
              path={LI_BOLD}
              size={16}
              color="#4077a5"
              viewBox="0 0 24 24"
            />
          </span>
        );
      }
      return <Icon path={IM_TREE} size={25} color="#4077a5" />;
    case "Housing Program":
      if (bond) {
        return (
          <span>
            <Icon path={IM_HOME2} size={25} color="#4077a5" />
            <Icon
              path={LI_BOLD}
              size={16}
              color="#4077a5"
              viewBox="0 0 24 24"
            />
          </span>
        );
      }
      return <Icon path={IM_HOME2} size={25} color="#4077a5" />;
    case "Public Safety":
      return <Icon path={IM_SHIELD3} size={25} color="#4077a5" />;
    case "Water":
      return <Icon path={IM_DROPLET} size={25} color="#4077a6" />;
    case "Building Construction":
      return <Icon path={IM_HAMMER} size={25} color="#4077a6" />;
    case "Entertainment Facilities":
      return <Icon path={IM_CITY} size={25} color="#4077a5" />;
    case "Sphere":
      return <Icon path={IM_SPHERE3} size={25} color="#4077a5" />;
    case "Other":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="25px"
          transform="translate(0,4)"
          version="1.1"
          viewBox="0 0 16 16"
          width="25px"
        >
          <g
            fill="none"
            fillRule="evenodd"
            id="Icons with numbers"
            stroke="none"
            strokeWidth="1"
          >
            <g
              fill="#4077a5"
              id="Group"
              transform="translate(-528.000000, -576.000000)"
            >
              <path
                d="M536,592 C531.581722,592 528,588.418278 528,584 C528,579.581722 531.581722,576 536,576 C540.418278,576 544,579.581722 544,584 C544,588.418278 540.418278,592 536,592 Z M541,586 C542.10457,586 543,585.10457 543,584 C543,582.89543 542.10457,582 541,582 C539.89543,582 539,582.89543 539,584 C539,585.10457 539.89543,586 541,586 Z M531,586 C532.10457,586 533,585.10457 533,584 C533,582.89543 532.10457,582 531,582 C529.89543,582 529,582.89543 529,584 C529,585.10457 529.89543,586 531,586 Z M536,586 C537.10457,586 538,585.10457 538,584 C538,582.89543 537.10457,582 536,582 C534.89543,582 534,582.89543 534,584 C534,585.10457 534.89543,586 536,586 Z M536,586"
                id="Oval 12 copy"
              />
            </g>
          </g>
        </svg>
      );
    default:
      return null;
  }
};
