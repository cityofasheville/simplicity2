import React from 'react';
import PropTypes from 'prop-types';
import LoadingAnimation from '../../../shared/LoadingAnimation';
import StatusDistributionMultiples from './StatusDistributionMultiples';


const StatusDash = (props) => {
  const title = props.selectedHierarchyTitle ?
    `Record Status Distributions by ${props.selectedHierarchyTitle}` :
    'Record Status Distributions';

  return (<div className="dashRows">
    <div id="percentOnline" className="row">
      <h2>{title}</h2>
      {props.selectedNodes ?
        (<StatusDistributionMultiples
          {...props}
          dateField={props.dateField}
          includedDates={props.includedDates}
          selectedNodes={props.selectedNodes.filter(node => !node.othered)}
        />) :
        <LoadingAnimation />
      }
    </div>
  </div>);
}

export default StatusDash;
