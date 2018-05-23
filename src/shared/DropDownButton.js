import React from 'react';
import PropTypes from 'prop-types';

const ButtonDropdown = props => (
	<div className="dropdown">
	  <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
	    Dropdown
	    <span className="caret"></span>
	  </button>
	  <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
	    <li><a href="#">Action</a></li>
	    <li><a href="#">Another action</a></li>
	    <li><a href="#">Something else here</a></li>
	    <li role="separator" className="divider"></li>
	    <li><a href="#">Separated link</a></li>
	  </ul>
	</div>
);

ButtonDropdown.propTypes = {
  // children: PropTypes.node,
  // alignment: PropTypes.string,
  // style: PropTypes.object, // eslint-disable-line
};

ButtonDropdown.defaultProps = {
  // alignment: 'right',
};

export default ButtonGroup;
