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
import { testProjectData, getPhasePieChartData, getFundsAllocatedAndExpended, filterProjects } from './cip_utilities';

const getBondText = (type, mode) => {
  switch (type) {
    case 'Transportation':
      return 'Transportation projects are funded with a combination of general tax revenue, municipal debt and external grants or partnerships. The $32 million from the 2016 Bond referendum for transportation projects supports the completion of road resurfacing and sidewalk improvements; new sidewalk and greenway projects; and pedestrian safety projects such as bus shelters, accessible crossings, signals, and traffic calming.';
    case 'Parks':
      return 'Parks & recreation projects are funded with a combination of general tax revenue, municipal debt and external grants or partnerships. The $17 million from the 2016 Bond referendum for parks projects supports the completion of major improvements to five parks and recreation facilities; acquiring land for parks; and improving outdoor courts, playgrounds and ball field lighting throughout the city.';
    case 'Housing':
      return 'Projects relating to affordable housing are funded with a combination of general tax revenue, municipal debt and external grants or partnerships. The $25 million from the 2016 Bond referendum for housing affordability projects provides additional support for the Housing Trust Fund and other programs that assist in creating diverse and affordable housing choices. The funding will also be used for the development of affordable housing on key City-owned sites.';
    case 'Public Safety':
      return 'Public Safety summary';
    case 'Other':
      return 'Other summary';
    default:
      return 'The City’s General CIP includes capital projects in affordable housing, parks & recreation, public safety, transportation & infrastructure, and general government. Projects are funded with a combination of general tax revenue, municipal debt and external grants or partnerships. Ongoing programs and regular maintenance projects may not be represented in this dashboard. For a complete list of general CIP projects, please view the adopted budget document.'
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
  let actualCategories = Array.from(props.categories);
  if (props.location.query.mode === 'bond') {
    actualCategories = actualCategories.filter((cat) => (['Transportation', 'Parks', 'Housing'].includes(cat)));
  }
  const sortedCats = ['Transportation', 'Housing', 'Parks', 'Public Safety', 'Other'];
  actualCategories.sort((a,b) => sortedCats.indexOf(a) > sortedCats.indexOf(b));

  const filteredProjects = filterProjects(testProjectData, actualCategories, props.location.query.mode);
  const pieData = getPhasePieChartData(filteredProjects, actualCategories, props.location.query.mode);
  const fundingDetails = getFundsAllocatedAndExpended(filteredProjects, actualCategories, props.location.query.mode);
  const getTitle = () => {
    let title = '';
    for (let category of actualCategories) {
      title = [title, ' ', category, ','].join('');
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
                  {actualCategories.map((category, index) => (
                    <p key={['category text', category].join('_')}><span style={{ fontWeight: 'bold' }}>{category}: </span> {getBondText(category, props.location.query.mode)}</p>
                  ))}
                  {props.location.query.mode !== 'bond' &&
                    <div>
                      <p><span style={{ fontStyle: 'italic' }}>Please note: Current project budgets include prior year funding and may change throughout the life of the project.</span></p>
                      <p><span style={{ fontStyle: 'italic' }}>Ongoing programs and regular maintenance projects may not be represented in this dashboard. For a complete list including ongoing and maintenance projects within the City's General CIP, please view the adopted <a className="inText" href="http://www.ashevillenc.gov/civicax/filebank/blobdload.aspx?blobid=28348#page=146%20" target="_blank">FY 17-18 Annual Budget</a>.</span></p>
                    </div>
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
  categories: ['Housing', 'Transportation', 'Parks', 'Public Safety', 'Other'],
};

export default CategoryDetails;


