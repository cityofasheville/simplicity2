import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { renderToString } from 'react-dom/server';
import { color } from 'd3-color';
import * as ease from 'd3-ease';
import { interpolateNumber } from 'd3-interpolate';
import { scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
import { arc, area } from 'd3-shape';
import { timer } from 'd3-timer';
import 'd3-transition';
import { generate } from './hashid';

const ucfirst = (s) => {
  return s && s[0].toUpperCase() + s.slice(1);
};

// using https://github.com/trendmicro-frontend/react-liquid-gauge as a starting/inspiration point

class InflowOutflowAnimation extends PureComponent {
  componentDidMount() {
    this.draw();
  }
  componentDidUpdate(prevProps, prevState) {
    this.draw();
  }
  draw() {
    const data = [];
    const samplePoints = 40;
    for (let i = 0; i <= samplePoints * this.props.waveFrequency; ++i) {
      data.push({
        x: i / (samplePoints * this.props.waveFrequency),
        y: i / samplePoints,
      });
    }

    this.wave = select(this.clipPath)
      .datum(data)
      .attr('T', '0');

    const waveHeightScale = scaleLinear()
      .range([0, this.props.waveAmplitude, 0])
      .domain([0, 50, 100]);

    const fillWidth = (this.props.width * (this.props.innerRadius - this.props.margin));
    const waveScaleX = scaleLinear()
      .range([-fillWidth, fillWidth])
      .domain([0, 1]);

    const fillHeight = (this.props.height * (this.props.innerRadius - this.props.margin));
    const waveScaleY = scaleLinear()
      .range([fillHeight / 2, -fillHeight / 2])
      .domain([0, 100]);

    if (this.props.waveAnimation) {
      this.animateWave();
    }

    if (this.props.riseAnimation) {
      const clipArea = area()
        .x((d, i) => waveScaleX(d.x))
        .y1(d => (this.props.height / 2));
      const timeScale = scaleLinear()
        .range([0, 1])
        .domain([0, this.props.riseAnimationTime]);
      // Use the old value if available
      const interpolate = interpolateNumber(this.wave.node().oldValue || 0, this.props.value);
      const easing = `ease${ucfirst(this.props.riseAnimationEasing)}`;
      const easingFn = ease[easing] ? ease[easing] : ease.easeCubicInOut;
      const riseAnimationTimer = timer((t) => {
        const value = interpolate(easingFn(timeScale(t)));
        clipArea.y0((d, i) => {
          const radians = Math.PI * 2 * (d.y * 2); // double width
          return waveScaleY(waveHeightScale(value) * Math.sin(radians) + value);
        });

        this.wave.attr('d', clipArea);

        const renderedElement = this.props.textRenderer(
          Object.assign({}, this.props, {value: value})
        );
        select(this.container)
          .selectAll('.text, .waveText')
          .html(renderToString(renderedElement));

        this.props.riseAnimationOnProgress({
          value: value,
          container: select(this.container),
        });

        if (t >= this.props.riseAnimationTime) {
          riseAnimationTimer.stop();

          const value = interpolate(1);
          clipArea.y0((d, i) => {
            const radians = Math.PI * 2 * (d.y * 2); // double width
            return waveScaleY(waveHeightScale(value) * Math.sin(radians) + value);
          });

          this.wave.attr('d', clipArea);

          const renderedElement = this.props.textRenderer(
            Object.assign({}, this.props, {value: value})
          );
          select(this.container)
            .selectAll('.text, .waveText')
            .html(renderToString(renderedElement));

          this.props.riseAnimationOnComplete({
            value: value,
            container: select(this.container),
          });
        }
      });

      // Store the old value that can be used for the next animation
      this.wave.node().oldValue = this.props.value;
    } else {
      const value = this.props.value;
      const clipArea = area()
        .x((d, i) => waveScaleX(d.x))
        .y0((d, i) => {
          const radians = Math.PI * 2 * (d.y * 2); // double width
          return waveScaleY(waveHeightScale(value) * Math.sin(radians) + value);
        })
        .y1(d => (this.props.height / 2));

      this.wave.attr('d', clipArea);
    }
  }

  animateWave() {
    const width = (this.props.width * (this.props.innerRadius - this.props.margin)) / 2;
    const waveAnimationScale = scaleLinear()
      .range([-width, width])
      .domain([0, 1]);
    const easing = `ease${ucfirst(this.props.waveAnimationEasing)}`;
    const easingFn = ease[easing] ? ease[easing] : ease.easeLinear;

    this.wave
      .attr('transform', 'translate(' + waveAnimationScale(this.wave.attr('T')) + ', 0)')
      .transition()
      .duration(this.props.waveAnimationTime * (1 - this.wave.attr('T')))
      .ease(easingFn)
      .attr('transform', 'translate(' + waveAnimationScale(1) + ', 0)')
      .attr('T', '1')
      .on('end', () => {
        this.wave.attr('T', '0');
        if (this.props.waveAnimation) {
          this.animateWave();
      }
    });
  }

  render() {
    const {
      id = generate(),
      style
    } = this.props;
    const radius = Math.min(this.props.height / 2, this.props.width / 2);
    const fillCircleRadius = radius * (this.props.innerRadius - this.props.margin);
    const circle = arc()
      .outerRadius(this.props.outerRadius * radius)
      .innerRadius(this.props.innerRadius * radius)
      .startAngle(0)
      .endAngle(Math.PI * 2);
    const cX = (this.props.width / 2);
    const cY = (this.props.height / 2);
    const fillColor = this.props.waveStyle.fill;

    return (
      <div
        style={Object.assign({}, style, { width: this.props.width, height: this.props.height })}
      >
        <svg width="100%" height="100%">
          <g
            ref={(c) => {
              this.container = c;
            }}
            transform={`translate(${cX},${cY})`}
          >
            <defs>
              <clipPath id={`clipWave-${id}`}>
                <path
                  ref={(c) => {
                    this.clipPath = c;
                  }}
                />
              </clipPath>
            </defs>
            <text
              className="text"
              style={{
                textAnchor: 'middle',
              }}
              transform={`translate(${this.props.textOffsetX},${this.props.textOffsetY})`}
              {...this.props.textStyle}
            >
              {this.props.textRenderer(this.props)}
            </text>
            <g clipPath={`url(#clipWave-${id})`}>
              <circle
                className="wave"
                r={fillCircleRadius}
                {...this.props.waveStyle}
                fill={this.props.waveStyle.fill}
              />
              <text
                className="waveText"
                style={{
                  textAnchor: 'middle',
                }}
                transform={`translate(${this.props.textOffsetX},${this.props.textOffsetY})`}
                {...this.props.waveTextStyle}
              >
                {this.props.textRenderer(this.props)}
              </text>
            </g>
            <path
              className="circle"
              d={circle()}
              {...this.props.circleStyle}
            />
            <circle
              r={radius}
              fill="rgba(0, 0, 0, 0)"
              stroke="rgba(0, 0, 0, 0)"
              style={{ pointerEvents: 'all' }}
              onClick={this.props.onClick}
            />
          </g>
        </svg>
      </div>
    );
  }
}

InflowOutflowAnimation.propTypes = {
  // A unique identifier (ID) to identify the element.
  id: PropTypes.string,
  // The width of the component.
  width: PropTypes.number,
  // The height of the component.
  height: PropTypes.number,

  // The percent value (0-100).
  value: PropTypes.number,
  // The percent string (%) or SVG text element.
  percent: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),

  // The relative height of the text to display in the wave circle. A value of 1 equals 50% of the radius of the outer circle.
  textSize: PropTypes.number,
  textOffsetX: PropTypes.number,
  textOffsetY: PropTypes.number,

  // Specifies a custom text renderer for rendering a percent value.
  textRenderer: PropTypes.func,

  // Controls if the wave should rise from 0 to it's full height, or start at it's full height.
  riseAnimation: PropTypes.bool,
  // The amount of time in milliseconds for the wave to rise from 0 to it's final height.
  riseAnimationTime: PropTypes.number,
  // [d3-ease](https://github.com/d3/d3-ease) options:
  // See the [easing explorer](http://bl.ocks.org/mbostock/248bac3b8e354a9103c4) for a visual demostration.
  riseAnimationEasing: PropTypes.string,
  // Progress callback function.
  riseAnimationOnProgress: PropTypes.func,
  // Complete callback function.
  riseAnimationOnComplete: PropTypes.func,

  // Controls if the wave scrolls or is static.
  waveAnimation: PropTypes.bool,
  // The amount of time in milliseconds for a full wave to enter the wave circle.
  waveAnimationTime: PropTypes.number,
  // [d3-ease](https://github.com/d3/d3-ease) options:
  // See the [easing explorer](http://bl.ocks.org/mbostock/248bac3b8e354a9103c4) for a visual demostration.
  waveAnimationEasing: PropTypes.string,

  // The wave amplitude.
  waveAmplitude: PropTypes.number,
  // The number of full waves per width of the wave circle.
  waveFrequency: PropTypes.number,

  // onClick event handler.
  onClick: PropTypes.func,

  // The radius of the inner circle.
  innerRadius: PropTypes.number,
  // The radius of the outer circle.
  outerRadius: PropTypes.number,
  // The size of the gap between the outer circle and wave circle as a percentage of the outer circle's radius.
  margin: PropTypes.number,

  // The fill and stroke of the outer circle.
  circleStyle: PropTypes.object, // eslint-disable-line
  // The fill and stroke of the fill wave.
  waveStyle: PropTypes.object, // eslint-disable-line
  // The fill and stroke of the value text when the wave does not overlap it.
  textStyle: PropTypes.object, // eslint-disable-line
  // The fill and stroke of the value text when the wave overlaps it.
  waveTextStyle: PropTypes.object, // eslint-disable-line
};

InflowOutflowAnimation.defaultProps = {
  width: 400,
  height: 400,
  value: 0,
  percent: '%',
  textSize: 1,
  textOffsetX: 0,
  textOffsetY: 0,
  textRenderer: (props) => {
    const value = Math.round(props.value);
    const radius = Math.min(props.height / 2, props.width / 2);
    const textPixels = (props.textSize * radius / 2);
    const valueStyle = {
      fontSize: textPixels
    };
    const percentStyle = {
      fontSize: textPixels * 0.6
    };

    return (
      <tspan>
        <tspan style={valueStyle}>{value}</tspan>
        {(typeof props.percent !== 'string') // eslint-disable-line
          ? props.percent // eslint-disable-line
          : <tspan style={percentStyle}>{props.percent}</tspan> // eslint-disable-line
        }
      </tspan>
    );
  },
  riseAnimation: false,
  riseAnimationTime: 2000,
  riseAnimationEasing: 'cubicInOut',
  riseAnimationOnProgress: () => {},
  riseAnimationOnComplete: () => {},
  waveAnimation: false,
  waveAnimationTime: 2000,
  waveAnimationEasing: 'linear',
  waveAmplitude: 0, // 1,
  waveFrequency: 1, // 2,
  onClick: () => {},
  innerRadius: 0.9,
  outerRadius: 1.0,
  margin: 0.025,
  circleStyle: {
    fill: 'rgb(23, 139, 202)',
  },
  waveStyle: {
    fill: 'rgb(23, 139, 202)',
  },
  textStyle: {
    fill: 'rgb(0, 0, 0)',
  },
  waveTextStyle: {
    fill: 'rgb(255, 255, 255)',
  },
};

export default InflowOutflowAnimation;
