import React from 'react';
import PropTypes from 'prop-types';
import ProjectsTable from './ProjectsTable';
import BarChartContainer from '../../shared/visualization/BarChartContainer';
import ButtonGroup from '../../shared/ButtonGroup';
import LinkButton from '../../shared/LinkButton';
import { testProjectData, getPhaseBarChartData, getCategoryBarChartData, getFundsAllocatedAndExpended, filterProjects } from './cip_utilities';
import Icon from '../../shared/Icon';
import { IM_SHIELD3, IM_TREE3, IM_HOME2, IM_BUS, LI_BOLD } from '../../shared/iconConstants';

const getBondText = (type, mode) => {
  switch (type) {
    case 'Transportation':
      return (<div><p><Icon path={IM_BUS} size={25} color="#4077a5" /><span className="text-primary">&nbsp;<b>Transportation:&nbsp;</b></span>Transportation projects within the the City’s General CIP are funded with a combination of general tax revenue, municipal debt and external grants or partnerships.</p><p><Icon path={IM_BUS} size={25} color="#4077a5" /><Icon path={LI_BOLD} size={16} color="#4077a5" viewBox="0 0 24 24" /><span className="text-primary">&nbsp;<b>Transportation Bond:&nbsp;</b></span><span>Transportation Bond projects are additional projects that support the completion of road resurfacing and sidewalk improvements; new sidewalk and greenway projects; and pedestrian safety projects such as bus shelters, accessible crossings, signals, and traffic calming.</span></p></div>);
    case 'Parks':
      return (<div><p><Icon path={IM_TREE3} size={25} color="#4077a5" /><span className="text-primary">&nbsp;<b>Parks:&nbsp;</b></span>Parks projects within the City’s general CIP are funded with a combination of general tax revenue, municipal debt and external grants or partnerships.</p><p><Icon path={IM_TREE3} size={25} color="#4077a5" /><Icon path={LI_BOLD} size={16} color="#4077a5" viewBox="0 0 24 24" /><span className="text-primary">&nbsp;<b>Parks Bond:&nbsp;</b></span><span>Parks Bond projects are additional projects that support the completion of major improvements to five parks and recreation facilities; acquiring land for parks; and improving outdoor courts, playgrounds and ball field lighting throughout the city.</span></p></div>);
    case 'Housing':
      return (<div><p><Icon path={IM_HOME2} size={25} color="#4077a5" /><span className="text-primary">&nbsp;<b>Housing:&nbsp;</b></span>projects relating to affordable housing within the City’s General CIP are funded with a combination of general tax revenue, municipal debt and external grants or partnerships.</p><p><Icon path={IM_HOME2} size={25} color="#4077a5" /><Icon path={LI_BOLD} size={16} color="#4077a5" viewBox="0 0 24 24" /><span className="text-primary">&nbsp;<b>Housing Bond:&nbsp;</b></span><span>Housing Bond projects for housing affordability provide additional support for the Housing Trust Fund and other programs that assist in creating diverse and affordable housing choices. The projects also include support in the development of affordable housing on key City-owned sites.</span></p></div>);
    case 'Public Safety':
      return (<div><p><Icon path={IM_SHIELD3} size={25} color="#4077a5" /><span className="text-primary">&nbsp;<b>Public Safety:</b></span>&nbsp;Public Safety projects within the City’s general CIP are funded with a combination of general tax revenue, municipal debt and external grants or partnerships.</p></div>);
    case 'Other':
      return (<div><p><svg xmlns="http://www.w3.org/2000/svg" height="25px" transform="translate(0,4)" version="1.1" viewBox="0 0 16 16" width="25px"><g fill="none" fillRule="evenodd" id="Icons with numbers" stroke="none" strokeWidth="1"><g fill="#4077a5" id="Group" transform="translate(-528.000000, -576.000000)"><path d="M536,592 C531.581722,592 528,588.418278 528,584 C528,579.581722 531.581722,576 536,576 C540.418278,576 544,579.581722 544,584 C544,588.418278 540.418278,592 536,592 Z M541,586 C542.10457,586 543,585.10457 543,584 C543,582.89543 542.10457,582 541,582 C539.89543,582 539,582.89543 539,584 C539,585.10457 539.89543,586 541,586 Z M531,586 C532.10457,586 533,585.10457 533,584 C533,582.89543 532.10457,582 531,582 C529.89543,582 529,582.89543 529,584 C529,585.10457 529.89543,586 531,586 Z M536,586 C537.10457,586 538,585.10457 538,584 C538,582.89543 537.10457,582 536,582 C534.89543,582 534,582.89543 534,584 C534,585.10457 534.89543,586 536,586 Z M536,586" id="Oval 12 copy" /></g></g></svg><span className="text-primary">&nbsp;<b>Other</b></span>&nbsp;Projects categorized as “Other” are projects within the City’s general CIP, which are funded with a combination of general tax revenue, municipal debt and external grants or partnerships, that support facility upgrades and economic development.</p></div>);
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
                      <p key={['category text', category].join('_')}>{getBondText(category, props.location.query.mode)}</p>
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
