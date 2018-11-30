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
        position: 'fixed',
        margin: '0 auto',
        left: 0,
        right: 0,
        textAlign: 'center',
        zIndex: 99,
      }}
      className="anchorNav"
    >
      {this.props.links.map(linkItem => {
        const hslColor = hsl(linkItem.color);
        const textColor = hsl('white');
        let fontWeight = 'bold';
        if (!linkItem.selected) {
          hslColor.opacity = 0.95;
          hslColor.s = 0.5;
          textColor.l = 0.95;
          fontWeight = 'light';
        }
        return (<a
          key={linkItem.linkId}
          href={`#${linkItem.linkId}`}
          style={{
            display: 'inline-block',
            backgroundColor: hslColor,
            border: `0.5px solid white`,
            borderRadius: '2px',
            color: textColor,
            fontWeight: fontWeight,
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
