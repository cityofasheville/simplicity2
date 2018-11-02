import React from 'react';
import PropTypes from 'prop-types';
import { stackedHistogramFromNodes } from './granularUtils';
import BooleanSplitMultiples from './BooleanSplitMultiples';
import LoadingAnimation from '../../../shared/LoadingAnimation';
import PermitVolCirclepack from './PermitVolCirclepack';
import VolumeHistogram from './VolumeHistogram';


const GranularDash = (props) => {
  const histData = props.selectedNodes ?
    stackedHistogramFromNodes(props.selectedNodes, props.timeSpan) :
    [];

  const totalCount = props.selectedData.length;
  const circlePackData = {
    key: 'root',
    color: 'none',
    heritage: [],
    values: props.selectedNodes ?
      props.selectedNodes.map(node =>
        ({
          color: node.color,
          heritage: node.heritage,
          key: node.key,
          selected: node.selected,
          value: node.selectedActiveValues.length,
        })) :
      [],
  };

  const subTitle = props.selectedHierarchyTitle ?
    `Volume by Record ${props.selectedHierarchyTitle}` :
    'Volume';

  return (<div>
    <div
      id="controls-n-summary"
      className="row col-md-12"
    >
      <h2>{subTitle}</h2>
      <div className="col-md-9">
        <h3>Daily</h3>
        <VolumeHistogram
          {...props}
          data={histData}
        />
      </div>
      <div className="col-md-3 granularVolCirclepack">
        <h3>{`Total: ${totalCount}`}</h3>
        {props.selectedNodes ?
          (<PermitVolCirclepack
            {...props}
            data={circlePackData}
            // onCircleClick={circleData => this.onModalOpen(circleData)}
          />) :
          <LoadingAnimation />
        }
      </div>
    </div>
    <div id="percentOnline" className="row">
      <h3>Online vs In Person</h3>
      {/* Make shared extent with FacetController after issue is fixed */}
      {props.selectedNodes ?
        (<BooleanSplitMultiples
          {...props}
          histogramData={histData}
          selectedNodes={props.selectedNodes.filter(node => !node.othered)}
        />) :
        <LoadingAnimation />
      }
    </div>
  </div>);
}

export default GranularDash;
