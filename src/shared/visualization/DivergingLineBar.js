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
    super(props);
    this.state = { showingLongDesc: this.showLongDesc };
  }

  toggleLongDesc() {
    this.setState({
      showingLongDesc: !this.state.showingLongDesc,
    });
  }


  render() {
    console.log(this.props.data)
    const formattedData = formatDataForStackedBar(
      this.props.data,
      this.props.dataKeys,
      this.props.mainAxisDataKey,
      this.props.colorScheme,
    );

    const axes = [
      {
        key: 'xAxis',
        orient: 'bottom',
      },
      {
        key: 'yAxis',
        orient: 'left',
      },
    ];
    const size = [450, 450];
    const margin = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 30,
    }

          // <HorizontalLegend
          // />
            // <XYFrame
            //   margin={margin}
            //   axes={axes}
            //   size={size}
            //   lines={[this.props.data]}
            //   lineStyle={{ stroke: 'black' }}
            //   xAccessor={d => this.props.xAccessor(d)}
            //   yAccessor={d => d['Net change']}
            // />
    return (
      <div>
        <div>
          <div style={{ position: 'absolute' }}>
          </div>
          <div style={{ position: 'absolute' }}>
            <OrdinalFrame
              margin={margin}
              axes={axes}
              size={size}
              data={formattedData}
              type='bar'
              projection='vertcal'
              oAccessor={d => this.props.xAccessor(d)}
              rAccessor='value'
              style={d => ({ fill: d.color })}
              oLabel={(d, column, i) => {
                return d.label;
              }}
              oPadding={10}
              axis={{
                orient: 'top',
                tickValues: [],
              }}
            />
          </div>
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
  colorScheme: PropTypes.string,
  data: PropTypes.array,
  dataKeys: PropTypes.arrayOf(PropTypes.string),
  xAccessor: PropTypes.func,
  mainAxisDataKey: PropTypes.string,
}

DivergingLineBar.defaultProps = {
  colorScheme: 'pink_green_diverging',
  data: [],
  dataKeys: [],
  xAccessor: d => d,
  mainAxisDataKey: null,
}

export default DivergingLineBar;