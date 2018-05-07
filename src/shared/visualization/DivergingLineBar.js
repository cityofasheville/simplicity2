import React from 'react';
import PropTypes from 'prop-types';
import { OrdinalFrame, XYFrame } from 'semiotic';
import HorizontalLegend from './HorizontalLegend';
import Tooltip from './Tooltip';
import { formatDataForStackedBar } from './visUtilities';



const getLongDesc = (data, dataKeys, mainAxisKey) => (
  <div>
    {data.map((value, index) => (
      <div key={[value[mainAxisKey], index].join('_')}>
        <p>{value[mainAxisKey]}<br />
          {dataKeys.map(key => (
            <span key={[value[mainAxisKey], key].join('_')}>{key}: {value[key]}<br /></span>
          ))}
        </p>
      </div>
    ))}
  </div>
);

class DivergingLineBar extends React.Component {

  constructor(props) {
    super(props)
    this.state = { showingLongDesc: this.showLongDesc };
  }

  toggleLongDesc() {
    this.setState({
      showingLongDesc: !this.state.showingLongDesc,
    });
  }


  render() {
    const formattedData = formatDataForStackedBar(
      this.props.data,
      this.props.dataKeys,
      this.props.mainAxisDataKey,
      this.props.colorScheme,
    );

          // <XYFrame
          // />
    return (
      <div>
        <div style={{ height: 450}} >
          <OrdinalFrame
            data={}
            type='bar'
            oAccessor={}
            rAccessor={}
            style={d => 'red'}
            oLabel={(d, column, i) => {
              return 'foo'
            }}
            oPadding={10}
            axis={{
              orient: 'top',
              tickValues: [],
            }}
          />
          <HorizontalLegend
          />
        </div>
        <div className="row">
          <div className="col-xs-10 col-xs-offset-2">
            <br />
            <a
              href=""
              className="text-center inText"
              onClick={(e) => { e.preventDefault(); this.toggleLongDesc() }}
            >
              {this.state.showingLongDesc ? 'Hide' : 'Show'} Veteran homelessness Incoming and Outgoing bar chart summary
            </a>
            <div hidden={!this.state.showingLongDesc}>
              {getLongDesc(this.props.data, this.props.dataKeys, 'month')}
            </div>
          </div>
        </div>
      </div>
    )
  }

}

DivergingLineBar.propTypes = {

}

DivergingLineBar.defaultProps = {

}

export default DivergingLineBar;