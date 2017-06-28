import React from 'react';
import PropTypes from 'prop-types';

const ProjectDetails = (props) => (
  <div>
    <p>
      <span>Description:</span>
      <br />
      {props.description}
    </p>
  </div>
);

ProjectDetails.propTypes = {
  description: PropTypes.string,
};

ProjectDetails.defaultProps = {
  description: "This is a project description for a project. Placeholder text. Placeholder text. Placeholder text. Placeholder text. Placeholder text.",
};

export default ProjectDetails;