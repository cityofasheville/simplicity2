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
    >
      {this.props.links.map(linkItem => (
        <a
          key={linkItem.linkId}
          href={`#${linkItem.linkId}`}
          style={{
            display: 'inline-block',
            padding: '0.25em 2em',
            backgroundColor: color(linkItem.color).brighter(0.25),
            border: `1px solid ${linkItem.color}`,
            borderRadius: '2px',
            color: 'white',
            fontWeight: 0.75,
          }}
        >
          {linkItem.linkName}
        </a>
      ))}
    </div>);
  }

}

export default AnchorNav;
