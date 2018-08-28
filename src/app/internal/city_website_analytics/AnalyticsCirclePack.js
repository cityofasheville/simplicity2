import React from 'react';
import { NetworkFrame } from 'semiotic';
import { data } from './analytics';
import { buildTree } from './analytics';
import { scaleLinear } from 'd3-scale';
import { interpolateHcl } from 'd3-interpolate';

const colors = scaleLinear()
.domain([-30000,250000])
.range(['white', 'green'])
.interpolate(interpolateHcl);

const AnalyticsCirclePack = () => {
  const formattedData = buildTree(data)
  return (
    <div>
      <h1>ashevillenc.gov page views July 2016 - July 2017</h1>
      <div style={{ marginLeft: '-50px', marginBottom: '100px' }}>
        <NetworkFrame
          size={[1200, 700]}
          edges={formattedData}
          nodeStyle={(d, i) => ({
            fill: d.pageViews === 0 ? 'white' : colors(d.pageViews),
            stroke: 'black',
            opacity: 0.75,
          })}
          nodeIDAccessor="key"
          hoverAnnotation
          networkType={{
            type: 'circlepack',
            projection: 'vertical',
            nodePadding: 1,
            hierarchySum: d => {
              return d.pageViews;
            },
          }}
          tooltipContent={d => (
            <div
              style={{
                background: 'white',
              }}
            >
              <p>
                {
                  d.data.key
                }
              </p>
              {
                d.data.pageViews > 0 &&
                <p>
                  {
                    d.data.pageViews
                  }
                </p>

              }
            </div>
          )}
          margin={10}
        />
      </div>
      <div style={{ marginLeft: '-50px', marginBottom: '100px' }}>
        <NetworkFrame
          size={[1200, 700]}
          edges={formattedData}
          nodeStyle={(d, i) => ({
            fill: d.pageViews === 0 ? 'white' : colors(d.pageViews),
            stroke: 'black',
            opacity: 0.75,
          })}
          nodeIDAccessor="key"
          hoverAnnotation
          networkType={{
            type: 'partition',
            projection: 'vertical',
            nodePadding: 1,
            hierarchySum: d => {
              return d.pageViews;
            },
          }}
          tooltipContent={d => (
            <div
              style={{
                background: 'white',
              }}
            >
              <p>
                {
                  d.data.key
                }
              </p>
              {
                d.data.pageViews > 0 &&
                <p>
                  {
                    d.data.pageViews
                  }
                </p>

              }
            </div>
          )}
          margin={10}
        />
      </div>
    </div>
  );
};

export default AnalyticsCirclePack;
