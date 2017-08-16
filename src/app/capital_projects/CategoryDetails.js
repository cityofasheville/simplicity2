import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import ProjectsTable from './ProjectsTable';
import HousingTimeline from './HousingTimeline';
import BarChartContainer from '../../shared/visualization/BarChartContainer';
import PieChart from '../../shared/visualization/PieChart';
import ProjectExpendedBarChart from './ProjectExpendedBarChart';
import PageHeader from '../../shared/PageHeader';
import ButtonGroup from '../../shared/ButtonGroup';
import LinkButton from '../../shared/LinkButton';
import { testProjectData, getPhasePieChartData, getFundsAllocatedAndExpended, shortCategory, filterProjects } from './cip_utilities';

const getBondText = (type) => {
  switch (type) {
    case 'Bond - Transportation Program':
      return 'The $32 million for transportation projects supports the completion of road resurfacing and sidewalk improvements; new sidewalk and greenway projects; and pedestrian safety projects such as bus shelters, accessible crossings, signals, and traffic calming.';
    case 'Bond - Parks Program':
      return 'The $17 million for parks projects supports the completion of major improvements to five parks and recreation facilities; acquiring land for parks; and improving outdoor courts, playgrounds and ball field lighting throughout the city.';
    case 'Bond - Housing Program':
      return 'The $25 million for housing affordability provides additional support for the Housing Trust Fund and other programs that assist in creating diverse and affordable housing choices. The funding will also be used for the development of affordable housing on key City-owned sites.';
    case 'General Capital Improvement Program':
      return 'The City’s General CIP includes capital projects in affordable housing, parks & recreation, public safety, transportation & infrastructure, and general government. Projects are funded with a combination of general tax revenue, municipal debt and external grants or partnerships. Ongoing programs and regular maintenance projects may not be represented in this dashboard. For a complete list of general CIP projects, please view the adopted budget document.';
    default:
      return 'No categories are selected.'
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

const CategoryDetails = (props) => {
  const filteredProjects = filterProjects(testProjectData, props.categories);
  const pieData = getPhasePieChartData(filteredProjects, props.categories);
  const fundingDetails = getFundsAllocatedAndExpended(filteredProjects, props.categories);
  const getTitle = () => {
    let title = '';
    for (let category of props.categories) {
      title = [title, ' ', shortCategory(category), ','].join('');
    }
    if (title.endsWith(',')) {
      title = title.slice(0, -1);
    }
    return title;
  }

  return (
    <div>
      <div className="row">
        <div className="col-sm-12">
          <div className="row">
            <div className="col-sm-12 text-primary">
              <h3>Selected project categories:
                <ButtonGroup>
                  <LinkButton pathname="/capital_projects" query={Object.assign({}, props.location.query, {view: 'summary'})} positionInGroup="left" active={props.location.query.view !== 'table'}>Summary</LinkButton>
                  <LinkButton pathname="/capital_projects" query={Object.assign({}, props.location.query, {view: 'table'})} active={props.location.query.view === 'table'} positionInGroup="right">Projects</LinkButton>
                </ButtonGroup>
                <br />
                <span style={{ fontSize: '18px' }}>{getTitle()}</span>
              </h3>
            </div>
          </div>
          {props.location.query.view === 'table' ?
            <ProjectsTable data={filteredProjects} />
          :
            <div>
              <div className="row">
                <div className="col-sm-6">
                  <h4><span style={{ fontSize: '24px' }}>Total funding: {getDollars(fundingDetails[0].allocated)}</span></h4>
                  <h4><span style={{ fontSize: '24px' }}>Spent: {getDollars(fundingDetails[0]['Expended funds'])}</span></h4>        
                </div>
                <div className="col-sm-6" style={{ marginBottom: '15px'}}>
                  <PieChart data={pieData} height={130} label={false} defaultLegend endAngle={180} innerRadius={40} outerRadius={80} cy="70%" toolTipFormatter={(value) => ([value, 'projects'].join(' '))} colorScheme="project_phases"/>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12">
                  {props.categories.map((category, index) => (
                    <p key={['category text', category].join('_')}><span style={{ fontWeight: 'bold' }}>{shortCategory(category)}: </span> {getBondText(category)}</p>
                  ))}
                  {props.categories.includes('General') &&
                    <p><span style={{ fontStyle: 'italic' }}>Please note: Current project budgets include prior year funding and may change throughout the life of the project.</span></p>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

CategoryDetails.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string),
  location: PropTypes.object, // eslint-disable-line
};

CategoryDetails.defaultProps = {
  categories: ['Bond - Transportation Program', 'Bond - Parks Program', 'Bond - Housing Program', 'General Capital Improvement Program']
};

export default CategoryDetails;


