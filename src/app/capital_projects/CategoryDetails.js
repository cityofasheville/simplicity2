import React from 'react';
import PropTypes from 'prop-types';
import ProjectsTable from './ProjectsTable';
import BarChartContainer from '../../shared/visualization/BarChartContainer';
import ButtonGroup from '../../shared/ButtonGroup';
import LinkButton from '../../shared/LinkButton';
import { testProjectData, getPhaseBarChartData, getCategoryBarChartData, getFundsAllocatedAndExpended, filterProjects } from './cip_utilities';

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
  const phaseBarData = getPhaseBarChartData(filteredProjects, actualCategories, props.location.query.mode);
  const categoryBarData = getCategoryBarChartData(filteredProjects, actualCategories, props.location.query.mode);
  const phaseDataMax = Math.max.apply(null, Object.keys(phaseBarData[0]).map(key => (phaseBarData[0][key])));
  const catDataMax = Math.max.apply(null, Object.keys(categoryBarData[0]).map(key => (categoryBarData[0][key])));
  const barDataMax = phaseDataMax > catDataMax ? phaseDataMax : catDataMax;
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
                  <span style={{ fontSize: '24px' }}>Total funding: {getDollars(fundingDetails[0].allocated)}</span>
                </div>
                <div className="col-sm-6">
                  <span style={{ fontSize: '24px' }}>Spent: {getDollars(fundingDetails[0]['Expended funds'])}</span>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <BarChartContainer chartTitle="Number of projects by category" mainAxisDataKey="name" legendHeight={25} dataKeys={actualCategories} colorScheme="bright_colors_2" data={categoryBarData} altText="Bar chart of Number of projects by category" height={250} domain={[0, barDataMax + 5]} />
                </div>
                <div className="col-sm-6" style={{ marginBottom: '15px'}}>
                  <BarChartContainer chartTitle="Number of projects by phase" mainAxisDataKey="name" legendHeight={25} dataKeys={['Planning', 'Design', 'Construction', 'Completed']} colorScheme="bright_colors" data={phaseBarData} altText="Bar chart of Number of projects by phase" height={250} domain={[0, barDataMax + 5]} />
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12">
                  <div style={{ marginTop: '15px' }}>
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
