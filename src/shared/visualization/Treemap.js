import React from 'react';
import PropTypes from 'prop-types';
// import { ResponsiveContainer, Treemap as RechartsTreemap } from 'recharts';
import { ResponsiveNetworkFrame } from 'semiotic';
import { scaleSequential } from 'd3-scale';
import { interpolateLab } from 'd3-interpolate';


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

    console.log(this.props)

    return (
      <div style={{ height: this.props.height }} onClick={this.toggleLabels} alt={this.altText}>
        <ResponsiveNetworkFrame
          responsiveWidth
          edges={{ key: 'parent', children: filteredData }}
          nodeStyle={(d) => {
            if (!d.floatDeltaPercent) {
              return {
                cursor: 'pointer',
                fill: 'white',
                stroke: 'black',
                strokeWidth: '0.5px',
              };
            }
            return {
              cursor: 'pointer',
              fill: d.floatDeltaPercent > 0 ? positiveColor(d.floatDeltaPercent) : negativeColor(d.floatDeltaPercent),
              stroke: 'black',
              strokeWidth: '0.5px',
            };
          }}
          nodeIDAccessor="key"
          networkType={{
            type: 'treemap',
            projection: 'vertical',
            hierarchySum: d => d.size,
          }}
          hoverAnnotation
          customClickBehavior={this.props.diveDeeper !== undefined ? (d) => this.props.diveDeeper(d, this.props.location, this.props.history) : null}
        />
        <button className="btn btn-primary btn-xs pull-right" style={{ marginTop: '3px' }} id="toggleLabels">{this.state.showingLabels === true ? 'Hide labels' : 'Show labels'}</button>
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
