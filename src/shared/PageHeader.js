import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

const PageHeader = props => (
  <div className="row template-header">
    <div className="col-sm-12 template-header__inner">
      {props.image &&
        <img alt={props.imageAlt} src={props.image} style={{ width: '100px', float: 'left', marginRight: '10px' }} />
      }
      <div className="template-header__title">
        <h1>
          {props.icon &&
            <span className="title__icon">{props.icon}</span>
          }
          <span className="title__text">
            {props.h1}
          </span>
        </h1>
      </div>      
      <div className="template-header__actions">
        {props.children}
      </div>
      {props.externalLink && props.dataLinkPath &&
        <div className="template-header__subnav">
          {props.externalLink &&
            <div>
              <a href={props.externalLink} target="_blank">{props.externalLinkText}</a>
            </div>
          }
          {props.dataLinkPath &&
            <div>
              <Link to={{ pathname: props.dataLinkPath }}>Understand this data</Link>
            </div>
          }
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
