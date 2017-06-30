import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

const PageHeader = props => (
  <div className="row">
    <div className="col-sm-12">
      {props.image &&
        <img alt={props.imageAlt} src={props.image} style={{ width: '100px', float: 'left', marginRight: '10px' }} />
      }
      <h1>
        {props.icon &&
          <span style={{ marginRight: '5px' }}>{props.icon}</span>
        }
        {props.children}
        {props.h1}
      </h1>
      {props.externalLink &&
        <div className="pull-left">
          <a className="inText" href={props.externalLink} target="_blank">{props.externalLinkText}</a>
        </div>
      }
      {props.dataLinkPath &&
        <div className="pull-right">
          <Link className="inText" to={{ pathname: props.dataLinkPath }}>Understand this data</Link>
        </div>
      }
      {props.h2 !== null &&
        <h2>{props.h2}</h2>
      }
      {props.h3 !== null &&
        <h3>{props.h3}</h3>
      }
    </div>
  </div>
);

PageHeader.propTypes = {
  children: PropTypes.node,
  h1: PropTypes.string,
  h2: PropTypes.string,
  h3: PropTypes.string,
  externalLink: PropTypes.string,
  externalLinkText: PropTypes.string,
  dataLinkPath: PropTypes.string,
  image: PropTypes.string,
  imageAlt: PropTypes.string,
  icon: PropTypes.node,
};

PageHeader.defaultProps = {
  h2: null,
  h3: null,
};

export default PageHeader;
