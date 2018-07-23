import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveNetworkFrame } from 'semiotic';
import { scaleSequential } from 'd3-scale';
import { interpolateLab } from 'd3-interpolate';
import Tooltip from './Tooltip';


const getDollars = (value) => {
  if (value > 1000000) {
    return ['$', (value / 1000000).toLocaleString(), ' M'].join('');
  } else if (value > 1000) {
    return ['$', (value / 1000).toLocaleString(), ' k'].join('');
  }
  return ['$', value.toLocaleString()].join('');
};

const getDollarsForTooltips = value => (
  [value < 0 ? '-$' : '$', Math.abs(value).toLocaleString()].join('')
);

const getTopLevelOnly = data => (
  data.map(item => (Object.assign({}, item, { children: null })))
);

const positiveColor = scaleSequential(interpolateLab('#ffffff', '#0099ff')).domain([0, 100]);
const negativeColor = scaleSequential(interpolateLab('#ffffff', '#ff9933')).domain([0, -100]);
const percentToFloat = percent => parseFloat(percent.replace('%', '')) / 100.0


class Treemap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showingLabels: props.showingLabels,
    };
    this.toggleLabels = this.toggleLabels.bind(this);
    this.altText = props.altText;
  }

  toggleLabels(event) {
    if (event.target.id === 'toggleLabels') {
      this.setState({
        showingLabels: !this.state.showingLabels,
      });
    }
  }

  render() {
    const filteredData = getTopLevelOnly(this.props.data).map((d) => {
      d.floatDeltaPercent = percentToFloat(d.deltaPercent);
      return d;
    });
    const deltaDomain = filteredData.map(d => d.floatDeltaPercent);
    const positiveMax = deltaDomain.filter(d => d > 0).sort((a, b) => b - a);
    const negativeMin = deltaDomain.filter(d => d <= 0).sort((a, b) => a - b);
    positiveMax.length > 0 && positiveColor.domain([0, positiveMax[0]]);
    negativeMin.length > 0 && negativeColor.domain([0, negativeMin[0]]);

    return (
      <div
        style={{ height: this.props.height }}
        onClick={this.toggleLabels}
        alt={this.altText}
      >
        <ResponsiveNetworkFrame
          responsiveWidth
          annotations={filteredData.map(d => Object.assign({ type: 'treemap-label' }, d))}
          edges={{ key: 'parent', children: filteredData }}
          nodeStyle={(d) => {
            if (!d.floatDeltaPercent) {
              return {
                cursor: 'pointer',
                fill: 'white',
                stroke: 'gray',
                strokeWidth: '0.3px',
              };
            }
            return {
              cursor: 'pointer',
              fill: d.floatDeltaPercent > 0 ? positiveColor(d.floatDeltaPercent) : negativeColor(d.floatDeltaPercent),
              stroke: 'gray',
              strokeWidth: '0.3px',
            };
          }}
          nodeIDAccessor="key"
          networkType={{
            type: 'treemap',
            projection: 'vertical',
            hierarchySum: d => d.size,
          }}
          hoverAnnotation
          htmlAnnotationRules={(d) => {
            if (d.d.type !== 'treemap-label') {
              return null;
            }

            const node = d.nodes.filter(n => n.data && n.data.name === d.d.name)[0];
            const nodeName = d.d.name.trim();
            const fontSize = 12;

            const nodeWidth = node.x1 - node.x0;
            const nodeNameArray = nodeName.split(' ').sort((a, b) => b.length - a.length);
            const maxWordChars = nodeNameArray[0].length;
            const horizontalFit = maxWordChars * (fontSize - 2) <= nodeWidth;

            if (!horizontalFit) {
              return '';
            }

            const nodeHeight = node.y1 - node.y0;
            const numLines = Math.ceil((nodeName.length * (fontSize - 1)) / nodeWidth);
            const verticalFit = nodeHeight / fontSize >= numLines;

            if (!verticalFit) {
              return '';
            }

            const style = {
              position: 'absolute',
              left: node.x0,
              top: node.y0,
              width: nodeWidth,
              height: nodeHeight,
              padding: '3px 3px',
              fontSize: `${fontSize}px`,
              overflow: 'hidden',
            };
            return <div style={style} key={nodeName}>{nodeName}</div>;
          }}
          customClickBehavior={d => this.props.diveDeeper !== undefined && this.props.diveDeeper(
            d,
            this.props.location,
            this.props.history
          )}
          tooltipContent={(d) => {
            if (!d.name) { return; } // TAKE THIS OUT WHEN IT'S FIXED

            // TODO: POSITION THIS WITH MOUSE, NOT WEIRDLY IN CENTER

            const textLines = [
              {
                text: `Total: ${getDollarsForTooltips(d.amount)}`,
              },
              {
                text: `${d.delta > 0 ? 'Increase' : 'Decrease'} by ${d.deltaPercent}`,
              },
            ];
            return (<Tooltip
              title={d.name.trim()}
              textLines={textLines}
            />);
          }}
        />
        <button
          className="btn btn-primary btn-xs pull-right"
          style={{ marginTop: '3px' }}
          id="toggleLabels"
        >
          {this.state.showingLabels === true ? 'Hide labels' : 'Show labels'}
        </button>
      </div>
    );
  }
}

Treemap.propTypes = {
  height: PropTypes.number,
  data: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  showingLabels: PropTypes.bool,
  differenceColors: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
  diveDeeper: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
  altText: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
};

Treemap.defaultProps = {
  height: 450,
  data: [],
  diveDeeper: undefined,
  differenceColors: false,
  showingLabels: true,
  altText: 'Treemap',
};

export default Treemap;
