import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveOrdinalFrame, ResponsiveXYFrame } from 'semiotic';
import HorizontalLegend from './HorizontalLegend';
import Tooltip from './Tooltip';
import { formatDataForStackedBar, labelOrder } from './visUtilities';


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
      bottom: 60,
      left: 35,
    };

    const rawData = formattedData.map(d => d.value);

    const yDomain = [
      Math.min(...rawData),
      Math.max(...rawData),
    ];

    // https://emeeks.github.io/semiotic/#/semiotic/creatingpcrosshighlight
    return (
      <div>
        <div className="row visualization-container">
          <div style={{ position: 'absolute', width: '100%' }}>
            <ResponsiveOrdinalFrame
              responsiveWidth
              margin={margin}
              domain={yDomain}
              size={size}
              data={formattedData}
              type="bar"
              projection="vertical"
              oAccessor={(d) => {
                const datum = d.data ? d.data : d;
                return this.props.xAccessor(datum);
              }}
              oLabel={d => (
                <text
                  textAnchor="middle"
                >
                  {`${d.getMonth() + 1}/${d.getFullYear()}`}
                </text>
              )}
              rAccessor="value"
              style={d => ({ fill: d.color })}
              oPadding={8}
              axis={{ orient: 'left' }}
              pieceHoverAnnotation={[
                {
                  type: 'highlight',
                  style: { fill: 'pink' },
                },
              ]}
            />
          </div>
          {/* <div style={{ position: 'absolute', width: '100%' }}> */}
          {/*   <ResponsiveXYFrame */}
          {/*     yExtent={yDomain} */}
          {/*     responsiveWidth */}
          {/*     margin={margin} */}
          {/*     size={size} */}
          {/*     lines={[this.props.data]} */}
          {/*     lineStyle={{ stroke: 'black', strokeWidth: '2px' }} */}
          {/*     xAccessor={d => this.props.xAccessor(d)} */}
          {/*     yAccessor={d => d['Net change']} */}
          {/*     showLinePoints */}
          {/*   /> */}
          {/* </div> */}
        </div>
        <div
          className="row"
          style={{ position: 'absolute', bottom: 0, width: '100%' }}
        >
          <div className="col-xs-10 col-xs-offset-1">
            <HorizontalLegend
              formattedData={formattedData}
              style={{ textAlign: 'center'}}
            />
          </div>
        </div>
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
};

DivergingLineBar.defaultProps = {
  colorScheme: 'pink_green_diverging',
  data: [],
  dataKeys: [],
  xAccessor: d => d,
  mainAxisDataKey: null,
};

export default DivergingLineBar;
