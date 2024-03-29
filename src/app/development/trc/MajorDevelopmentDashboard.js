import React from 'react';
// import SectionNav from './SectionNav';
import { Link } from 'react-router';
import Accordion from '../../../shared/Accordion';
import ErrorBoundary from '../../../shared/ErrorBoundary';
import { devDashSections } from './textContent';

const introductoryContent = (
  <header style={{paddingBottom: "32px"}}>
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
        <a href="https://notifications.ashevillenc.gov" 
          target="_blank" 
          rel="noopener noreferrer"
        >Sign up to be notified</a> 
        when someone applies for a permit to build something near you
      </li>
    </ul>
    <p>Do you have ideas for how this tool could be updated or refined to better serve our community?   
      If so, please <a href="https://forms.gle/kSRTZidJUtNdZ8Rz7" target="_blank" rel="noopener noreferrer">send us your feedback</a>!</p>
  </header>
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
    // this.sections = devDashSections.map((d) => {
    //   const rObj = Object.assign({}, d);
    //   rObj.ref = React.createRef();
    //   return rObj;
    // });
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
    // const thisLocation = location.hash.replace('#', '');
    // this.sections = this.sections.map(d => Object.assign(
    //   d,
    //   { selected: d.linkId === thisLocation }
    // ));

    // Make it less overwhelming/scrolly for smaller screens
    // Breaking at 1120 after setting side nav to min-width of 200
    if (this.state.width < 1120) {
      return (
        <main id="majorDevDash">
          {introductoryContent}
          <Accordion
            data={devDashSections}
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

    // return (
    //   <div id="majorDevDash">
    //     <SectionNav
    //       links={this.sections}
    //     />
    //     <main>
    //       {introductoryContent}
    //       {this.sections.map(section => (
    //         <section id={section.linkId} ref={section.ref} key={section.linkId} style={{ overflow: 'auto' }}>
    //           <h2>{section.header}</h2>
    //           <ErrorBoundary>
    //             {section.body}
    //           </ErrorBoundary>
    //         </section>
    //       ))}
    //     </main>
    //   </div>
    // );

    return (
      <div id="majorDevDash" className="container-fluid h-100">
        <nav>
          <ul className="sectionNav" >
            <li><a href="#types" className="linkItem-not-selected">Project Types</a></li>
            <li><a href="#process" className="linkItem-not-selected">Process</a></li>
            <li>
              <Link to='/permits/search' className="linkItem-not-selected">Development &amp; Permit Search</Link>             
            </li>
            <li><a href="#notifications" className="linkItem-not-selected">Get Notifications</a></li>
            <li><a href="#data" className="linkItem-not-selected">Project Details</a></li>
            <li><a href="#participate" className="linkItem-not-selected">Get Involved</a></li>
            <li><a href="#faq" className="linkItem-not-selected">Frequently Asked Questions</a></li>
          </ul>
        </nav>
        <main>
          <div style={{margin: "0 auto"}}>
            {introductoryContent}
            {devDashSections.map(section => (
              <section id={section.linkId} key={section.linkId} style={{ overflow: 'auto' }}>
                <h2>{section.header}</h2>
                <ErrorBoundary>
                  {section.body}
                </ErrorBoundary>
              </section>
            ))}
          </div>
        </main>

      </div>
    );
  }
}

export default MajorDevelopmentDashboard;
