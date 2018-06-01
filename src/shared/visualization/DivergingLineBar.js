import React from 'react';
import PropTypes from 'prop-types';
import { color } from 'd3-color';
import { ResponsiveOrdinalFrame } from 'semiotic';
import HorizontalLegend from './HorizontalLegend';
import Tooltip from './Tooltip';
import { formatDataForStackedBar } from './visUtilities';


// TODO: abstract out all the stuff that is specific to the HomelessnessVeteransExitTime chart

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
        linePoint: true,
      };
    });

    annotations.slice(0, annotations.length - 1).forEach((a, i) => {
      annotations.push({
        type: 'line',
        coordinates: [a, annotations[i + 1]],
      });
    });

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
                if (d && !d.piece) {
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
              // hoverAnnotation
              customHoverBehavior={(d) => {
                if (d) {
                  this.setState({ hover: this.props.xAccessor(d) });
                } else {
                  this.setState({ hover: null });
                }
              }}
              svgAnnotationRules={(d) => {
                if (d.d.type !== 'line' && !d.d.linePoint) {
                  return null;
                }

                if (d.d.type === 'line') {
                  return (
                    <line
                      key={`${d.d.type}-${d.i}`}
                      stroke="black"
                      strokeWidth={1.5}
                      x1={d.screenCoordinates[0][0]}
                      x2={d.screenCoordinates[1][0]}
                      y1={d.screenCoordinates[0][1]}
                      y2={d.screenCoordinates[1][1]}
                    />
                  );
                }

                const circleStyle = {
                  stroke: 'black',
                  strokeWidth: 1.5,
                  fill: 'none',
                };

                if (this.state.hover && this.state.hover.getTime() === this.props.xAccessor(d.d).getTime()) {
                  circleStyle.strokeWidth = 2;
                  circleStyle.fill = 'white';
                  circleStyle.fillOpacity = 0.5;
                }

                return (
                  <circle
                    key={d.i + d.d.month}
                    cx={d.screenCoordinates[0]}
                    cy={d.screenCoordinates[1]}
                    r={5}
                    style={circleStyle}
                  />
                );
              }}
              tooltipContent={(d) => {
                const datum = d.data ? d.data : d;

                const textLines = formattedData.filter(el => el.month === datum.month).map(inOut => ({
                  color: inOut.color,
                  text: `${inOut.label}: ${inOut.value}`,
                }));

                textLines.push({
                  color: 'black',
                  text: `Net Change: ${
                    this.props.data.find(el => el.month === datum.month)['Net change']
                  }`,
                });

                return (
                  <Tooltip
                    textLines={textLines}
                    title={datum.month}
                  />
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
  colorScheme: 'orange_purple_diverging',
  data: [],
  dataKeys: [],
  xAccessor: d => d,
  mainAxisDataKey: null,
};

export default DivergingLineBar;
