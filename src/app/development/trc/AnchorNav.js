import React from 'react';
import PropTypes from 'prop-types';
import { color, hsl } from 'd3-color';


class AnchorNav extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return (<div
      style={{
        margin: '0 auto',
        left: 0,
        right: 0,
        textAlign: 'center',
        zIndex: 99,
        position: 'fixed',
      }}
      className="anchorNav"
    >
      {this.props.links.map(linkItem => {
        const hslColor = hsl(linkItem.color);
        const textColor = hsl('white');
        if (!linkItem.selected) {
          hslColor.opacity = 0.95;
          hslColor.s = 0.5;
          textColor.l = 0.95;
        }
        return (<a
          key={linkItem.linkId}
          href={`#${linkItem.linkId}`}
          className={`linkItem-${linkItem.selected ? 'selected' : 'not-selected'}`}
          style={{
            display: 'inline-block',
            backgroundColor: hslColor,
            border: `0.5px solid white`,
            borderRadius: '2px',
            color: textColor,
            letterSpacing: '0.05em',
          }}
        >
          {linkItem.linkName}
        </a>)
      })}
    </div>);
  }

}

export default AnchorNav;
