import React from 'react';
import SectionNav from './SectionNav';
import Accordion from '../../../shared/visualization/Accordion';
import ErrorBoundary from '../../ErrorBoundary';
import { devDashSections } from './textContent';

class MajorDevelopmentDashboard extends React.Component {
  constructor() {
    super();

    // Should re-render when screen size is changed to allow it to conditionally render
    this.state = {
      width: window.innerWidth,
    };
    this.updateWindowWidth = this.updateWindowWidth.bind(this);

    this.sections = devDashSections.map((d) => {
      // Assign each a ref so that we can know the size
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
    // iterate over sections, make the selected one whichever one is in the URL
    // otherwise make it the first one
    const thisLocation = location.hash.replace('#', '');
    this.sections = this.sections.map(d =>
      Object.assign(d, { selected: d.linkId === thisLocation })
    );

    if (this.state.width < 800) {
      return (
        <div id="majorDevDash">
          <h1>Major Development in Asheville</h1>
          <Accordion
            data={this.sections}
            componentId="top-level"
            classes="top-level-accordion"
            onPanelHeaderClick={(sectionData, opening) => {
              if (opening) {
                history.replaceState(
                  {},
                  sectionData.linkId,
                  `${location.pathname}${location.search}#${sectionData.linkId}`
                );
              }
            }}
          />
        </div>
      );
    }

    return (
      <div id="majorDevDash">
        <SectionNav
          links={this.sections}
        />
        <main>
          <h1>Large-Scale Development in Asheville</h1>
          {/*<h1><small>Get notifications, attend meetings, and have your voice heard.</small></h1>*/}
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
          <br />
          <br />
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
