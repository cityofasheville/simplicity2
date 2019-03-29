import React from 'react';
import PropTypes from 'prop-types';
import SectionNav from './SectionNav';
import AnnotatedDagre from './AnnotatedDagre';
import TRCDataTable from './TRCDataTable';
import Accordion from '../../../shared/visualization/Accordion';

class MajorDevelopmentDashboard extends React.Component {
  constructor() {
    super();

    this.state = {
      width: window.innerWidth,
    };
    this.updateWindowWidth = this.updateWindowWidth.bind(this);

    this.sections = [
      {
        linkId: 'about',
        linkName: 'About',
        selected: true,
        header: 'About',
        body: (
          <div>
            <p>When someone wants to build or modify a building on private property in the City of Asheville, they must comply with federal, state, county, and city standards. Which standards apply depends on how large the building is or how much the building will be modified.</p>
            <p>After the developer submits an application, it goes through a decision-making process that includes city staff, city council, developers, and residents.  Who is involved at what step depends on the type of project.</p>
            <p>The Unified Development Ordinance defines six types of large scale development in Asheville.</p>
            <p>Depending on the type of project, there are three to eight steps.</p>
            <AnnotatedDagre />
          </div>
        ),
      },
      {
        linkId: 'notifications',
        linkName: 'Get Notifications',
        header: 'Sign up for Notifications',
        body: <p>The City of Asheville is piloting a new notification system that allows people to sign up for non-emergency alerts based on city data.  You can go to notifications.ashevillenc.gov to sign up for alerts about Level I and larger projects.</p>,
      },
      {
        linkId: 'data',
        linkName: 'Project Details',
        header: 'Development Details',
        body: (
          <div>
            <p>The table below contains proposed, large-scale, private development projects for which a permit application has been submitted.  You can also see a <a href="/permits">table of all permit applications</a> or <a href="/">search an address</a> to find nearby development.</p>
            <TRCDataTable />
          </div>
        ),
      },
      {
        linkId: 'calendar',
        linkName: 'Public Meetings',
        header: 'Upcoming Public Meetings',
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
        header: 'Frequently Asked Questions',
        body: <Accordion
          data={[
            {
              header: 'Why is the sky blue?',
              body: 'Something something light refracting',
            },
            {
              header: 'What day is it?',
              body: new Date().toLocaleDateString('en-us'),
            },
            {
              header: 'Why?',
              body: '42',
            },
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
    if (this.state.width < 768) {
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
        <h1>Large Scale Development in Asheville</h1>
        {this.sections.map(section => (
          <section id={section.linkId} ref={section.ref} key={section.linkId}>
            <h2>{section.header}</h2>
            {section.body}
          </section>
        ))}
      </main>
    </div>)
  }

}

export default MajorDevelopmentDashboard;
