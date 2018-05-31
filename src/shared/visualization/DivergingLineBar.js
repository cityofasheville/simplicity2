import React from 'react';
import PropTypes from 'prop-types';
import { color } from 'd3-color';
import { ResponsiveOrdinalFrame } from 'semiotic';
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
      bottom: 60,
      left: 35,
    };

    const annotations = this.props.data.map((d) => {
      return {
        type: 'or',
        month: d.month,
        value: d['Net change'],
      };
    });

    // https://emeeks.github.io/semiotic/#/semiotic/creatingpcrosshighlight
    return (
      <div>
        <div className="row visualization-container">
          <div style={{ position: 'absolute', width: '100%' }}>
            <ResponsiveOrdinalFrame
              responsiveWidth
              annotations={annotations}
              margin={margin}
              size={size}
              data={formattedData}
              type="bar"
              projection="vertical"
              oAccessor={(d) => {
                if (d && !d.pieces) {
                  const datum = d.data ? d.data : d;
                  return this.props.xAccessor(datum);
                }
              }}
              oLabel={(d) => {
                const label = `${d.getMonth() + 1}/${d.getFullYear()}`;
                return (
                  <text
                    textAnchor="middle"
                    key={label}
                  >
                    {label}
                  </text>
                );
              }}
              rAccessor={(d) => {
                if (d) {
                  return d.value;
                }
              }}
              style={(d) => {
                return this.state.hover && this.state.hover.getTime() === this.props.xAccessor(d).getTime() ?
                // For the currently hovered bar, return a brighter fill and add a stroke
                  {
                    fill: color(d.color).brighter(0.6).toString(),
                    stroke: color(d.color).toString(),
                    strokeWidth: 3,
                  } :
                  { fill: d.color };
              }
              }
              oPadding={8}
              axis={{ orient: 'left' }}
              pieceHoverAnnotation
              customHoverBehavior={(d) => {
                if (d) {
                  this.setState({ hover: this.props.xAccessor(d) });
                } else {
                  this.setState({ hover: null });
                }
              }}
              svgAnnotationRules={(d) => {
                if (!d.type === 'or') {
                  return;
                }
                return (
                  <g key={`${d.i}${d.d.type}`}>
                    <circle
                      cx={d.screenCoordinates[0]}
                      cy={d.screenCoordinates[1]}
                      r={5}
                      style={{ fill: 'black' }}
                    />
                  </g>
                );
              }}
            />
          </div>
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
