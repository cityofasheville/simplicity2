import React from 'react';
import PropTypes from 'prop-types';
import { color, hsl } from 'd3-color';


class SectionNav extends React.Component {
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
        backgroundColor: 'white',
        borderBottom: '1px solid gray',
      }}
      className="anchorNav"
    >
      {this.props.links.map(linkItem => {
        const textColor = hsl('gray');
        if (!linkItem.selected) {
          textColor.opacity = 0.9;
        }
        return (<a
          key={linkItem.linkId}
          href={`#${linkItem.linkId}`}
          className={`linkItem-${linkItem.selected ? 'selected' : 'not-selected'}`}
          style={{
            display: 'inline-block',
            borderRadius: '4px',
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

export default SectionNav;
