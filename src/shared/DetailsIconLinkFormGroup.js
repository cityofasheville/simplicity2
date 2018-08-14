import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

const DetailsIconLinkFormGroup = props => (
  <div className={props.icon ? 'form-group form-group--has-icon' : 'form-group'}>
    <div className="form-group__inner">
      {
        props.inWindow ?
          <Link className="btn btn-default" to={props.href} title={props.title}>
            <span>{props.icon}&nbsp;{props.label}</span>
          </Link>
        :
        <a className="btn btn-default" href={props.href} title={props.title} target="_blank">
          <span>{props.icon}&nbsp;{props.label}</span>
        </a>
      }
    </div>
  </div>
);

DetailsIconLinkFormGroup.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.node,
  href: PropTypes.string,
  title: PropTypes.string,
  inWindow: PropTypes.bool,
  colWidth: PropTypes.string,
};

DetailsIconLinkFormGroup.defaultProps = {
  label: '',
  icon: <span></span>,
  href: 'www.ashevillenc.gov',
  title: 'City of Asheville Website',
  inWindow: false,
  colWidth: '12',
};

export default DetailsIconLinkFormGroup;
