import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveOrdinalFrame, ResponsiveXYFrame } from 'semiotic';
import HorizontalLegend from './HorizontalLegend';
import Tooltip from './Tooltip';
import { formatDataForStackedBar } from './visUtilities';


// const getLongDesc = (data, dataKeys, mainAxisKey) => (
//   <div>
//     {data.map((value, index) => (
//       <div key={[value[mainAxisKey], index].join('_')}>
//         <p>{value[mainAxisKey]}<br />
//           {dataKeys.map(key => (
//             <span key={[value[mainAxisKey], key].join('_')}>{key}: {value[key]}<br /></span>
//           ))}
//         </p>
//       </div>
//     ))}
//   </div>
// );

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
    const formattedData = formatDataForStackedBar(
      this.props.data,
      this.props.dataKeys,
      this.props.mainAxisDataKey,
      this.props.colorScheme,
    );

    const size = [450, 450];

    const margin = {
      top: 20,
      right: 20,
      bottom: 30,
      left: 30,
    };

    const rawData = formattedData.map(d => d.value)

    const dataDomain = [
      Math.min(...rawData),
      Math.max(...rawData),
    ];

    return (
      <div>
        <div>
          <div style={{ position: 'absolute', width: '100%' }}>
            <ResponsiveOrdinalFrame
              responsiveWidth
              margin={margin}
              domain={dataDomain}
              size={size}
              data={formattedData}
              type='bar'
              projection='vertical'
              oAccessor={d => this.props.xAccessor(d)}
              oLabel={d => `${d.getMonth()}/${d.getFullYear()}`}
              rAccessor='value'
              style={d => ({ fill: d.color })}
              oPadding={15}
              axis={{orient: 'left'}}
            />
          </div>
          <div style={{ position: 'absolute', width: '100%' }}>
            <ResponsiveXYFrame
              yExtent={dataDomain}
              responsiveWidth
              margin={margin}
              size={size}
              lines={[this.props.data]}
              lineStyle={{ stroke: 'black', strokeWidth: '3px' }}
              xAccessor={d => this.props.xAccessor(d)}
              yAccessor={d => d['Net change']}
            />
          </div>
        </div>
        {/* <HorizontalLegend */}
        {/* /> */}
        {/* <div className="row"> */}
        {/*   <div className="col-xs-10 col-xs-offset-2"> */}
        {/*     <br /> */}
        {/*     <a */}
        {/*       href="" */}
        {/*       className="text-center inText" */}
        {/*       onClick={(e) => { e.preventDefault(); this.toggleLongDesc() }} */}
        {/*     > */}
        {/*       {this.state.showingLongDesc ? 'Hide' : 'Show'} Veteran homelessness Incoming and Outgoing bar chart summary */}
        {/*     </a> */}
        {/*     <div hidden={!this.state.showingLongDesc}> */}
        {/*       {getLongDesc(this.props.data, this.props.dataKeys, 'month')} */}
        {/*     </div> */}
        {/*   </div> */}
        {/* </div> */}
      </div>
    );
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