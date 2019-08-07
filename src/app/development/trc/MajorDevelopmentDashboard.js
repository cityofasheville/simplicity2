import React from 'react';
import SectionNav from './SectionNav';
import Accordion from '../../../shared/Accordion';
import ErrorBoundary from '../../../shared/ErrorBoundary';
import { devDashSections } from './textContent';

const introductoryContent = (
  <React.Fragment>
    <h1>Large-Scale Development in Asheville</h1>
    <p>There is a lot of private land development happening in Asheville.  This tool can help you:</p>
    <ul>
      <li>
        Understand the development process from the first permit application to breaking ground
      </li>
      <li>
        Understand your role in the process and how your voice can be heard
      </li>
      <li>
        <a href="https://notifications.ashevillenc.gov" target="_blank" rel="noopener noreferrer">Sign up to be notified</a> when someone applies for a permit to build something near you
      </li>
    </ul>
    <p>This is a brand new tool.  Like all digital products created by the City of Asheville, it will be updated and refined iteratively in response to public input.  Please <a href="https://forms.gle/kSRTZidJUtNdZ8Rz7" target="_blank" rel="noopener noreferrer">give us feedback</a> so that we may better understand your needs.</p>
    <br />
    <br />
  </React.Fragment>
);

class MajorDevelopmentDashboard extends React.Component {
  constructor() {
    super();

    // Should re-render when screen size is changed to allow it to conditionally render
    this.state = {
      width: window.innerWidth,
    };
    this.updateWindowWidth = this.updateWindowWidth.bind(this);

    // Assign each a ref so that we can know the size
    this.sections = devDashSections.map((d) => {
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
    // Iterate over sections, make the selected one whichever one is in the URL
    const thisLocation = location.hash.replace('#', '');
    this.sections = this.sections.map(d => Object.assign(
      d,
      { selected: d.linkId === thisLocation }
    ));

    // Make it less overwhelming/scrolly for smaller screens
    if (this.state.width < 800) {
      return (
        <main id="majorDevDash">
          {introductoryContent}
          <Accordion
            data={this.sections}
            componentId="top-level"
            classes="top-level-accordion"
            onPanelHeaderClick={(sectionData, opening) => {
              // When someone opens a panel header, change the URL
              if (opening) {
                history.replaceState(
                  {},
                  sectionData.linkId,
                  `${location.pathname}${location.search}#${sectionData.linkId}`
                );
              }
            }}
          />
        </main>
      );
    }

    return (
      <div id="majorDevDash">
        <SectionNav
          links={this.sections}
        />
        <main>
          {introductoryContent}
          {this.sections.map(section => (
            <section id={section.linkId} ref={section.ref} key={section.linkId} style={{ overflow: 'auto' }}>
              <h2>{section.header}</h2>
              <ErrorBoundary>
                {section.body}
              </ErrorBoundary>
            </section>
          ))}
        </main>
      </div>
    );
  }
}

export default MajorDevelopmentDashboard;
