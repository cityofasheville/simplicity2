import React from 'react';
import PropTypes from 'prop-types';
import { color, hsl } from 'd3-color';


class SectionNav extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return (<ul className="sectionNav" >
      {this.props.links.map(linkItem => {
        const textColor = hsl('gray');
        if (!linkItem.selected) {
          textColor.opacity = 0.9;
        }
        return (<li><a
          key={linkItem.linkId}
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
