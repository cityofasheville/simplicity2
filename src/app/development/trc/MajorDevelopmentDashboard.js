import React from 'react';
import PropTypes from 'prop-types';
import SectionNav from './SectionNav';
import AnnotatedDagre from './AnnotatedDagre';
import TRCDataTable from './TRCDataTable';
import Accordion from '../../../shared/visualization/Accordion';
import PermitTypeCards from './PermitTypeCards';

class MajorDevelopmentDashboard extends React.Component {
  constructor() {
    super();

    this.state = {
      width: window.innerWidth,
    };
    this.updateWindowWidth = this.updateWindowWidth.bind(this);

    this.sections = [
      {
        linkId: 'types',
        linkName: 'Project Types',
        selected: true,
        header: 'Types of large-scale development',
        body: <React.Fragment><p>The types of large-scale development are defined by <a href="https://library.municode.com/nc/asheville/codes/code_of_ordinances?nodeId=PTIICOOR_CH7DE_ARTVDEREPR_S7-5-9SIPLREDEPREXTHPAZOCEBUDILODODEREOVDICBDD" target="_blank" rel="noopener noreferrer">the City of Asheville's Unified Development Ordinance.</a>  Projects located downtown are <a href="https://library.municode.com/nc/asheville/codes/code_of_ordinances?nodeId=PTIICOOR_CH7DE_ARTVDEREPR_S7-5-9.1DEAPPRPAZOCEBUDILODODEREOVDICBDD" target="_blank" rel="noopener noreferrer">defined slightly differently in the ordinance.</a></p><PermitTypeCards/></React.Fragment>,
      },
      {
        linkId: 'process',
        linkName: 'Process',
        header: 'The development process',
        body: (<div>
          <p>After the developer submits an application, it goes through a decision-making process that includes city staff, city council, developers, and residents.  Who is involved at what step depends on the type of project.</p>
          <AnnotatedDagre />
        </div>),
      },
      {
        linkId: 'notifications',
        linkName: 'Get Notifications',
        header: 'Sign up for notifications',
        body: <p>The City of Asheville will be piloting a new notification system that allows people to sign up for non-emergency alerts based on city data.  Stay tuned for the launch of this tool!</p>,
      },
      {
        linkId: 'data',
        linkName: 'Project Details',
        header: 'Development details',
        body: (
          <div>
            <p>The map and table below contain proposed, large-scale, private development projects for which a permit application has been submitted.  You can also see a <a href="/permits">table of all permit applications</a> or <a href="/">search an address</a> to find nearby development.</p>
            <TRCDataTable />
          </div>
        ),
      },
      {
        linkId: 'calendar',
        linkName: 'Neighborhood Meetings',
        header: 'Upcoming neighborhood meetings',
        body: (
          <div>
            <p>Developers planning to submit applications for development that must go through the Technical Review Committee must hold a public meeting before submitting the application.</p>
            <p>Currently, developers are not required to notify the City of Asheville when those meetings take place.  Thus, the first record the city has of a proposed development is when the application is submitted, after the meeting.</p>
            <p>However, some developers choose to voluntarily notify the city.  After those developers fill out an online form, those meeting dates are automatically added to <a target="_blank" rel="noopener noreferrer" href="https://calendar.google.com/calendar/embed?src=ashevillenc.gov_gk5l650n9mopts9m7sfemhcpd8%40group.calendar.google.com&ctz=America%2FNew_York">this calendar</a>.</p>
          </div>
        )
      },
      {
        linkId: 'faq',
        linkName: 'Frequently Asked Questions',
        header: 'Frequently asked questions',
        body: <Accordion
          data={[
            {
              header: 'How current is this data?',
              body: 'Data in SimpliCity is updated nightly.',
            },
            {
              header: 'Where is the Development Services Department?',
              body: '161 South Charlotte Street, down the hill from City Hall.',
            },
            {
              header: 'Where is City Hall?',
              body: '70 Court Plaza, off of College Street.',
            },
            {
              header: 'Who builds these projects?',
              body: 'Small business owners, land owners, developers, and other private investors submit applications for permission to develop property in the city.  Once approved, they work with private contractors.',
            },
            {
              header: 'Who should I talk to if I have questions about one of these projects?',
              body: 'Give our Planner of the Day a call at 828-259-5450 or email them at pod@ashevillenc.gov.  They will direct you to the city planner who is reviewing the application.',
            },
            {
              header: 'How can I tell if a project includes affordable housing?',
              body: 'If the developer has indicated that they are planning to include affordable housing, it will be indicated on the project page with an icon.  Throughout the process, a developer could alter their plans, and this may not be reflected on the project page immediately.',
            },
            {
              header: 'How can I join one of the commissions that reviews projects?',
              body: <React.Fragment>Visit <a href="https://ashevillenc.gov/department/city-clerk/boards-and-commissions/" target="_blank" rel="noopener noreferrer">the Boards and Commissions web page</a> to view current vacancies and learn about application steps.</React.Fragment>,
            },
            // {
            //   header: 'How much control does the City have over the look and feel of a project?',
            //   body: 'Some review levels or zoning districts allow the City to review architectural design and some do not.  For instance, projects downtown, in historic districts, or in the river design area are subject to certain architectural requirements.  Conditional zoning projects allow Council the authority and flexibility to mandate some design elements.  Most projects outside of these cases do not allow for much flexibility in regulating architectural design.',
            // },
          ]}
        />,
      },
    ].map((d) => {
      const rObj = Object.assign({}, d);
      rObj.ref = React.createRef();
      return rObj;
    });
  }

  componentDidMount() {
    this.updateWindowWidth();
    window.addEventListener('resize', this.updateWindowWidth);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowWidth);
  }

  updateWindowWidth() {
    this.setState({ width: window.innerWidth });
  }

  render() {
    if (this.state.width < 800) {
      return (
        <div id="majorDevDash">
          <h1>Major Development in Asheville</h1>
          <Accordion
            data={this.sections}
          />
        </div>
      );
    }

    return (<div id="majorDevDash">
      <SectionNav
        links={this.sections}
      />
      <main>
        <h1>Large-Scale Development in Asheville</h1>
        <h1><small>Get notifications, attend meetings, and have your voice heard.</small></h1>
        <p>There is a lot of private land development happening in Asheville.  This tool can help you:</p>
        <ul>
          <li>
            Understand the development process from the first permit application to breaking ground
          </li>
          <li>
            Understand your role in the process and how your voice can be heard
          </li>
          <li>
            Coming soon: be notified when someone applies for a permit to build something near you
          </li>
        </ul>
        <br/>
        <br/>
        {this.sections.map(section => (
          <section id={section.linkId} ref={section.ref} key={section.linkId} style={{ overflow: 'auto' }}>
            <h2>{section.header}</h2>
            {section.body}
          </section>
        ))}
      </main>
    </div>)
  }

}

export default MajorDevelopmentDashboard;
