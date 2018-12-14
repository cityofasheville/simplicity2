import React from 'react';
import PropTypes from 'prop-types';
import { color, hsl } from 'd3-color';

function debounce(func, wait, immediate) {
  // from lodash... should probably just use lodash
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

class SectionNav extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      links: props.links,
    }
    this.handleScroll = debounce(this.handleScroll.bind(this), 200)
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('hashchange', e => e.preventDefault());
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('hashchange', e => e.preventDefault());
  }

  handleScroll(event) {
    const changePoint = document.documentElement.clientHeight - 250;
    let closestDistanceToChange = null;
    let closestNavLinkId = null;

    this.state.links.forEach(navLink => {
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
    })

    if (closestNavLinkId === location.hash.replace('#', '')) {
      return;
    }

    const newSectionNavLinks = this.state.links.map(navLink => {
      const rObj = Object.assign({}, navLink)
      if (navLink.linkId !== closestNavLinkId) {
        rObj.selected = false;
        return rObj;
      }
      rObj.selected = true;
      // https://caniuse.com/#search=pushstate
      history.pushState({}, '', `${location.pathname}#${navLink.linkId}`)
      return rObj;
    })

    this.setState({
      links: newSectionNavLinks,
    });
  }

handleHashChange

  render() {
    return (<ul className="sectionNav" >
      {this.state.links.map(linkItem => {
        const textColor = hsl('gray');
        if (!linkItem.selected) {
          textColor.opacity = 0.9;
        }
        return (<li key={linkItem.linkId}><a
          href={`#${linkItem.linkId}`}
          className={`linkItem-${linkItem.selected ? 'selected' : 'not-selected'}`}
          style={{
            color: textColor,
          }}
        >
          {linkItem.linkName}
        </a></li>)
      })}
    </ul>);
  }

}

export default SectionNav;
