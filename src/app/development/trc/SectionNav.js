import React from 'react';
import PropTypes from 'prop-types';
import { debounce } from '../../../shared/visualization/visUtilities';


class SectionNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      links: props.links,
    };
    this.handleScroll = debounce(this.handleScroll.bind(this), 200);
    this.handleAnchorClick = this.handleAnchorClick.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll() {
    const changePoint = document.documentElement.clientHeight / 4;
    let closestDistanceToChange = null;
    let closestNavLinkId = '';

    this.state.links.forEach((navLink) => {
      const thisRef = navLink.ref.current.getBoundingClientRect();

      if (thisRef.top < changePoint && (!closestDistanceToChange || thisRef.top > closestDistanceToChange)) {
        // If the top of this ref is above the bottom of the screen
        // AND
        // If there isn't already a closest distance assigned
        // OR
        // If it's above below the current closest ref, make it the selected one
        closestNavLinkId = navLink.linkId;
        closestDistanceToChange = thisRef.top;
      }
    });

    if (closestNavLinkId === location.hash.replace('#', '')) {
      return;
    }

    // https://caniuse.com/#search=pushstate
    history.replaceState(
      {},
      closestNavLinkId,
      `${location.pathname}${location.search}#${closestNavLinkId}`
    );
    this.setSelectedNavLink(closestNavLinkId)
  }

  handleAnchorClick(event) {
    event.preventDefault();
    const anchorToId = event.target.getAttribute('href').replace('#', '');

    // Change the URL
    history.replaceState({}, anchorToId, `${location.pathname}${location.search}#${anchorToId}`);

    // Scroll to that element
    document.getElementById(anchorToId).scrollIntoView();
    this.setSelectedNavLink(anchorToId);
  }

  setSelectedNavLink(selectedLinkId) {
    const newSectionNavLinks = this.state.links.map((navLink) => {
      const rObj = Object.assign({}, navLink);
      if (navLink.linkId !== selectedLinkId) {
        rObj.selected = false;
        return rObj;
      }
      rObj.selected = true;
      return rObj;
    });

    this.setState({
      links: newSectionNavLinks,
    });
  }

  render() {
    return (
      <nav>
        <ul className="sectionNav" >
          {this.state.links.map(linkItem => (<li key={linkItem.linkId}>
            <a
              href={`#${linkItem.linkId}`}
              className={`linkItem-${linkItem.selected ? 'selected' : 'not-selected'}`}
              onClick={this.handleAnchorClick}
            >
              {linkItem.linkName}
            </a>
          </li>))}
        </ul>
      </nav>
    );
  }
}

export default SectionNav;
