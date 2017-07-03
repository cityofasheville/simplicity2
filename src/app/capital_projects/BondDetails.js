import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import BondDetailsTable from './BondDetailsTable';
import HousingTimeline from './HousingTimeline';
import BarChartContainer from '../../shared/visualization/BarChartContainer';
import PieChart from '../../shared/visualization/PieChart';
import ProjectExpendedBarChart from './ProjectExpendedBarChart';
import PageHeader from '../../shared/PageHeader';
import ButtonGroup from '../../shared/ButtonGroup';
import LinkButton from '../../shared/LinkButton';

const getIconPath = (type) => {
  switch (type) {
    case 'Transportation':
      return require('./transportationBondIcon.png'); // eslint-disable-line
    case 'Parks':
      return require('./parksBondIcon.png'); // eslint-disable-line
    default:
      return require('./housingBondIcon.png'); // eslint-disable-line
  }
};

const getBondText = (type) => {
  switch (type) {
    case 'Transportation':
      return 'The $32 million for transportation projects supports the completion of road resurfacing and sidewalk improvements; new sidewalk and greenway projects; and pedestrian safety projects such as bus shelters, accessible crossings, signals, and traffic calming.';
    case 'Parks':
      return 'The $17 million for parks projects supports the completion of major improvements to five parks and recreation facilities; acquiring land for parks; and improving outdoor courts, playgrounds and ball field lighting throughout the city.';
    default:
      return 'The $25 million for housing affordability provides additional support for the Housing Trust Fund and other programs that assist in creating diverse and affordable housing choices. It also enables the City to re-purpose city-owned land for development that supports housing affordability.';
  }
};

const getDollars = (value) => {
  if (Math.abs(value) > 1000000) {
    return [value < 0 ? '-$' : '$', (Math.abs(value) / 1000000).toFixed(0).toLocaleString(), ' M'].join('');
  } else if (Math.abs(value) > 1000) {
    return [value < 0 ? '-$' : '$', (Math.abs(value) / 1000).toFixed(0).toLocaleString(), ' k'].join('');
  }
  return [value < 0 ? '-$' : '$', Math.abs(value).toFixed(0).toLocaleString()].join('');
};

const getDollarsLong = value => (
  [value < 0 ? '-$' : '$', Math.abs(value).toLocaleString()].join('')
);

const testData = {
  Transportation: [
    { phase: 'Design', 'Number of projects': 5 },
    { phase: 'Planning', 'Number of projects': 26 },
    { phase: 'Construction', 'Number of projects': 0 },
    { phase: 'Completed', 'Number of projects': 0 },
  ],
  Parks: [
    { phase: 'Design', 'Number of projects': 2 },
    { phase: 'Planning', 'Number of projects': 7 },
    { phase: 'Construction', 'Number of projects': 0 },
    { phase: 'Completed', 'Number of projects': 0 },
  ],
  Housing: [
    { phase: 'Planning', 'Number of projects': 1 },
    { phase: 'Ongoing', 'Number of projects': 1 },
  ],
};

const testPieData = {
  Transportation: [
    { name: 'Planning', value: 26 },
    { name: 'Design', value: 5 },
    { name: 'Construction', value: 0 },
    { name: 'Completed', value: 0 },
  ],
  Parks: [
    { name: 'Planning', value: 7 },
    { name: 'Design', value: 2 },
    { name: 'Construction', value: 0 },
    { name: 'Completed', value: 0 },
  ],
  Housing: [
    { name: 'Planning', value: 1 },
    { name: 'Ongoing', value: 1 },
  ],
};

const testExpenditureData = {
  Transportation: [{ name: 'Transportation bonds funding', allocated: 32000000, 'Expended funds': 0, 'Remaining funds': 32000000 }],
  Parks: [{ name: 'Parks bonds funding', allocated: 17000000, 'Expended funds': 5000000, 'Remaining funds': 17000000 }],
  Housing: [{ name: 'Housing bonds funding', allocated: 25000000, 'Expended funds': 0, 'Remaining funds': 25000000 }],
};

const testHousingData = [
  {
    name: 'Repurposing of CO Land',
    zip: '28801',
    phase: 'Planning',
    total: 15000000,
    'Expended funds': 0,
    'Remaining funds': 15000000,
  },
  {
    name: 'Affordable Housing',
    zip: 'Citywide',
    phase: 'Ongoing',
    total: 10000000,
    'Expended funds': 0,
    'Remaining funds': 10000000,
  },
];

const testParksData = [
  {
    name: 'Bill Fields & Lighting',
    zip: 'Citywide',
    phase: 'Planning',
    construction_start: 'Summer 18',
    total: '$1,200,000',
    description: 'This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.',
    'Expended funds': 0,
    'Remaining funds': 12000000,
  },
  {
    name: 'Jake Rusher Park',
    zip: '28704',
    phase: 'Planning',
    construction_start: 'Fall 18',
    total: '$825,000',
    description: 'This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.',
    'Expended funds': 0,
    'Remaining funds': 825000,
  },
  {
    name: 'Memorial Stadium',
    zip: '28801',
    phase: 'Planning',
    construction_start: 'Summer 20',
    total: '$4,075,000',
    description: 'This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.',
    'Expended funds': 0,
    'Remaining funds': 4075000,
  },
  {
    name: 'Montford Complex',
    zip: '28801',
    phase: 'Design',
    construction_start: 'Spring 18',
    total: '$1,700,000',
    description: 'This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.',
    'Expended funds': 0,
    'Remaining funds': 1700000,
  },
  {
    name: 'Outdoor Courts',
    zip: 'Citywide',
    phase: 'Completed',
    construction_start: 'Spring 18',
    total: '$1,015,000',
    description: 'This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.',
    'Expended funds': 0,
    'Remaining funds': 1015000,
  },
  {
    name: 'Playgrounds',
    zip: 'Citywide',
    phase: 'Design',
    construction_start: 'Spring 18',
    total: '$1,015,000',
    description: 'This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.',
    'Expended funds': 0,
    'Remaining funds': 1015000,
  },
  {
    name: 'Richmond Hill Park',
    zip: '28806',
    phase: 'Construction',
    construction_start: 'Spring 19',
    total: '$520,000',
    description: 'This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.',
    'Expended funds': 0,
    'Remaining funds': 520000,
  },
  {
    name: 'Wesley Grant Center',
    zip: '28801',
    phase: 'Planning',
    construction_start: 'Summer 20',
    total: '$4,650,000',
    description: 'This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.',
    'Expended funds': 0,
    'Remaining funds': 4650000,
  },
];

const testTransportationData = {
  'Road Resurfacing and Sidewalk Improvements': [
    {
      name: 'Vermont Ave Improvements',
      zip: '28806',
      phase: 'Planning',
      construction_start: 'Summer 19',
      total: '$748,000',
      description: 'This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.',
      'Expended funds': 0,
      'Remaining funds': 748000,
    },
    {
      name: 'Haywood St Improvements',
      zip: '28801',
      phase: 'Planning',
      construction_start: 'Spring 19',
      total: '$815,000',
      description: 'This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.',
      'Expended funds': 0,
      'Remaining funds': 815000,
    },
    {
      name: 'Fulton St Improvements',
      zip: '28801',
      phase: 'Planning',
      construction_start: 'Spring 19',
      total: '$252,000',
      description: 'This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.',
      'Expended funds': 0,
      'Remaining funds': 252000,
    },
    {
      name: 'Road Improvements 2019',
      zip: 'Citywide',
      phase: 'Planning',
      construction_start: 'Summer 19',
      total: '$5,610,000',
      description: 'This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.',
      'Expended funds': 0,
      'Remaining funds': 5610000,
    },
    {
      name: 'Road Improvements 2018',
      zip: 'Citywide',
      phase: 'Planning',
      construction_start: 'Summer 18',
      total: '$4,929,000',
      description: 'This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.',
      'Expended funds': 0,
      'Remaining funds': 4929000,
    },
    {
      name: 'Road Improvements 2017',
      zip: 'Citywide',
      phase: 'Planning',
      construction_start: 'Summer 17',
      total: '$4,273,000',
      description: 'This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.',
      'Expended funds': 0,
      'Remaining funds': 4273000,
    },
  ],
  'New Sidewalks and Greenways': [
    {
      name: 'Greenway Neighborhood Connectors',
      zip: 'Citywide',
      phase: 'Planning',
      construction_start: 'Spring 19',
      total: '$1,000,000',
      description: 'This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.',
      'Expended funds': 0,
      'Remaining funds': 1000000,
    },
    {
      name: 'Airport Rd Sidewalk',
      zip: '28704',
      phase: 'Planning',
      construction_start: 'Spring 18',
      total: '$572,500',
      description: 'This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.',
      'Expended funds': 0,
      'Remaining funds': 572500,
    },
    {
      name: 'Gerber Rd Sidewalk',
      zip: '28803',
      phase: 'Planning',
      construction_start: 'Summer 20',
      total: '$357,000',
      description: 'This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.',
      'Expended funds': 0,
      'Remaining funds': 357000,
    },
    {
      name: 'Hill St Sidewalk',
      zip: '28801',
      phase: 'Planning',
      construction_start: 'Spring 18',
      total: '$468,000',
      description: 'This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.',
      'Expended funds': 0,
      'Remaining funds': 468000,
    },
    {
      name: 'Johnston Blvd Sidewalk',
      zip: '28806',
      phase: 'Planning',
      construction_start: 'Summer 19',
      total: '$1,372,000',
      description: 'This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.',
      'Expended funds': 0,
      'Remaining funds': 1372000,
    },
    {
      name: 'Mills Gap Sidewalk',
      zip: '28803',
      phase: 'Planning',
      construction_start: 'Summer 20',
      total: '$128,000',
      description: 'This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.',
      'Expended funds': 0,
      'Remaining funds': 128000,
    },
    {
      name: 'New Haw Creek Rd Sidewalk',
      zip: '28805',
      phase: 'Planning',
      construction_start: 'Summer 19',
      total: '$1,120,000',
      description: 'This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.',
      'Expended funds': 0,
      'Remaining funds': 1120000,
    },
    {
      name: 'Onteora Rd Sidewalk',
      zip: '28803',
      phase: 'Planning',
      construction_start: 'Summer 19',
      total: '$588,000',
      description: 'This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.',
      'Expended funds': 0,
      'Remaining funds': 588000,
    },
    {
      name: 'Overlook Rd Sidewalk',
      zip: '28803',
      phase: 'Planning',
      construction_start: 'Summer 19',
      total: '$213,000.00',
      description: 'This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.',
      'Expended funds': 0,
      'Remaining funds': 213000,
    },
    {
      name: 'Patton Ave Sidewalks',
      zip: '28806',
      phase: 'Planning',
      construction_start: 'Summer 21',
      total: '$616,000',
      description: 'This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.',
      'Expended funds': 0,
      'Remaining funds': 616000,
    },
    {
      name: 'Swannanoa River Rd Sidewalk',
      zip: '28805',
      phase: 'Planning',
      construction_start: 'Summer 19',
      total: '$756,000',
      description: 'This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.',
      'Expended funds': 0,
      'Remaining funds': 765000,
    },
    {
      name: 'Brooklyn Rd Improvements',
      zip: '28803',
      phase: 'Planning',
      construction_start: 'Summer 19',
      total: '$940,000',
      description: 'This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.',
      'Expended funds': 0,
      'Remaining funds': 940000,
    },
    {
      name: 'Swannanoa River Greenway',
      zip: '28803',
      phase: 'Planning',
      construction_start: 'Spring 19',
      total: '$3,600,000',
      description: 'This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.',
      'Expended funds': 0,
      'Remaining funds': 3600000,
    },
  ],
  'Pedestrian Safety': [
    {
      name: 'Bus Shelters 2017',
      zip: 'Citywide',
      phase: 'Design',
      construction_start: 'Summer 17',
      total: '$180,000',
      description: 'This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.',
      'Expended funds': 0,
      'Remaining funds': 180000,
    },
    {
      name: 'Bus Shelters 2017/18',
      zip: 'Citywide',
      phase: 'Planning',
      construction_start: 'Winter 17',
      total: '$185,000',
      description: 'This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.',
      'Expended funds': 0,
      'Remaining funds': 185000,
    },
    {
      name: 'Bus Shelters 2018',
      zip: 'Citywide',
      phase: 'Planning',
      construction_start: 'Summer 18',
      total: '$135,000',
      description: 'This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.',
      'Expended funds': 0,
      'Remaining funds': 135000,
    },
    {
      name: 'Patton Ave at Haywood Rd Crossing',
      zip: '28806',
      phase: 'Planning',
      construction_start: 'TBD',
      total: '$62,500',
      description: 'This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.',
      'Expended funds': 0,
      'Remaining funds': 62500,
    },
    {
      name: 'Patton & Florida Crossing',
      zip: '28806',
      phase: 'Planning',
      construction_start: 'TBD',
      total: '$62,500',
      description: 'This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.',
      'Expended funds': 0,
      'Remaining funds': 62500,
    },
    {
      name: 'Sweeten Cr Rd Crossing',
      zip: '28803',
      phase: 'Planning',
      construction_start: 'TBD',
      total: '$62,500',
      description: 'This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.',
      'Expended funds': 0,
      'Remaining funds': 62500,
    },
    {
      name: 'Patton & Asheland Signal',
      zip: '28801',
      phase: 'Design',
      construction_start: 'Summer 17',
      total: '$187,500',
      description: 'This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.',
      'Expended funds': 0,
      'Remaining funds': 187500,
    },
    {
      name: 'Patton at Lexington Signal',
      zip: '28801',
      phase: 'Design',
      construction_start: 'Summer 17',
      total: '$187,500',
      description: 'This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.',
      'Expended funds': 0,
      'Remaining funds': 187500,
    },
    {
      name: 'Patton at N/S French Broad Signal',
      zip: '28801',
      phase: 'Design',
      construction_start: 'Summer 17',
      total: '$187,500',
      description: 'This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.',
      'Expended funds': 0,
      'Remaining funds': 187500,
    },
    {
      name: 'Patton at Otis Signal',
      zip: '28801',
      phase: 'Design',
      construction_start: 'Summer 17',
      total: '$187,500',
      description: 'This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.',
      'Expended funds': 0,
      'Remaining funds': 187500,
    },
    {
      name: 'Traffic Calming 2017',
      zip: 'Citywide',
      phase: 'Planning',
      construction_start: 'Fall 17',
      total: '$200,000',
      description: 'This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.',
      'Expended funds': 0,
      'Remaining funds': 200000,
    },
    {
      name: 'Traffic Calming 2018',
      zip: 'Citywide',
      phase: 'Planning',
      construction_start: 'Spring 18',
      total: '$200,000',
      description: 'This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.',
      'Expended funds': 0,
      'Remaining funds': 200000,
    },
  ],
};

const BondDetails = (props) => {
  const refreshLocation = (value) => {
    browserHistory.push([props.location.pathname, '?type=Transportation&subType=', value].join(''));
  };

  return (
    <div>
      <PageHeader h1={[props.location.query.type, 'bonds'].join(' ')} image={getIconPath(props.location.query.type)} dataPathLink="/capital_projects/data" dataLinkPath="/capital_projects/bondsData">
        <ButtonGroup>
          <LinkButton pathname="/capital_projects">Back to Capital Projects</LinkButton>
        </ButtonGroup>
      </PageHeader>
      <div className="row">
        <div className="col-sm-12">
          <div className="row">
            <div className="col-sm-6 text-primary">
              <div style={{ fontSize: '30px' }}>Total Bond Funding: $--M</div>
              <div style={{ fontSize: '30px' }}>Spent: $--M</div>
              {/*<BarChartContainer data={testExpenditureData[props.location.query.type]} layout="vertical" secondaryTickFormatter={getDollars} toolTipFormatter={getDollarsLong} mainAxisDataKey="name" dataKeys={['Remaining funds', 'Expended funds']} colorScheme="bright_colors_2" altText={[props.location.query.type, 'bond project funds expended'].join(' ')} hidePrimaryAxis domain={['dataMin', 32000000]} stacked height={80} hideSummary hideLegend/>*/}
            </div>
            <div className="col-sm-6">
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6">
              <p style={{ paddingTop: '30px' }}>{getBondText(props.location.query.type)}</p>
            </div>
            <div className="col-sm-6">
              <PieChart data={testPieData[props.location.query.type]} height={130} label={false} defaultLegend endAngle={180} innerRadius={40} outerRadius={80} cy="70%" toolTipFormatter={(value) => ([value, 'projects'].join(' '))}/>
              {/*<BarChartContainer data={testData[props.location.query.type]} mainAxisDataKey="phase" dataKeys={['Number of projects']} colorScheme="bright_colors" altText={[props.location.query.type, 'bond project phases bar chart'].join(' ')} height={100} />*/}
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-sm-12">
          <h3>{props.location.query.type} Project details {props.location.query.type === 'Transportation' && <span>by category</span>}</h3>
          {props.location.query.type === 'Transportation' &&
            <BondDetailsTable data={testTransportationData[props.location.query.subType || 'Road Resurfacing and Sidewalk Improvements']} type={props.location.query.type} subType={props.location.query.subType || 'Road Resurfacing and Sidewalk Improvements'} radioCallback={refreshLocation} />}
          {props.location.query.type === 'Parks' &&
            <BondDetailsTable data={testParksData} type={props.location.query.type} subType="" radioCallback={refreshLocation} />}
          {props.location.query.type === 'Housing' &&
            <HousingTimeline />
          }
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-sm-12">
          <h3>How much has been spent on each project?</h3>
          {props.location.query.type === 'Transportation' &&
            <ProjectExpendedBarChart type={props.location.query.type} subType={props.location.query.subType || 'Road Resurfacing and Sidewalk Improvements'} radioCallback={refreshLocation} data={testTransportationData[props.location.query.subType || 'Road Resurfacing and Sidewalk Improvements']} />}
          {props.location.query.type === 'Parks' &&
            <ProjectExpendedBarChart type={props.location.query.type} subType="" data={testParksData} />
          }
          {props.location.query.type === 'Housing' &&
            <ProjectExpendedBarChart type={props.location.query.type} subType="" data={testHousingData} />
          }
        </div>
      </div>
    </div>
  )
};

BondDetails.propTypes = {
  type: PropTypes.string,
  location: PropTypes.object, // eslint-disable-line
};

export default BondDetails;


