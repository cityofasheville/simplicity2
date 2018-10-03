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

  return (<div>
    <div
      id="controls-n-summary"
      className="row col-md-12"
    >
      <div className="col-md-9">
        <h2>Daily</h2>
        <VolumeHistogram
          data={histData}
        />
      </div>
      <div className="col-md-3 granularVolCirclepack">
        <h2>{`Total: ${totalCount}`}</h2>
        {props.selectedNodes ?
          (<PermitVolCirclepack
            data={circlePackData}
            // onCircleClick={circleData => this.onModalOpen(circleData)}
          />) :
          <LoadingAnimation />
        }
      </div>
    </div>
    <div id="percentOnline" className="row">
      <h2>Online vs In Person</h2>
      {/* Make shared extent with FacetController after issue is fixed */}
      {props.selectedNodes ?
        (<BooleanSplitMultiples
          histogramData={histData}
          selectedNodes={props.selectedNodes.filter(node => !node.othered)}
        />) :
        <LoadingAnimation />
      }
    </div>
  </div>);
}

export default GranularDash;
