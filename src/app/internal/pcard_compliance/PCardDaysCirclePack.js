import React from 'react';
import { NetworkFrame, OrdinalFrame } from 'semiotic';

const colorHash = {
  '0-30 days': '#4575b4',
  '31-60 days': '#fdae61',
  '61-90 days': '#f46d43',
  '>90 days': '#d73027',
};

const getColor = (d) => {
  if (d.over_90 > 0) {
    return '#d73027';
  }
  if (d.under_90 > 0) {
    return '#f46d43';
  }
  if (d.under_60 > 0) {
    return '#fdae61';
  }
  return '#4575b4';
};
  //'#d73027', '#fdae61', '#abd939', ];

const PCardDaysCirclePack = props => (
  <div
    style={{ flexBasis: '35%' }}
  >
    <div style={{ marginLeft: '-50px' }}>
      <NetworkFrame
        size={[400, 400]}
        edges={props.data}
        nodeStyle={(d, i) => ({
          fill: getColor(d),
          stroke: "black",
          strokeOpacity: 0.25,
          fillOpacity: 0.25
        })}
        edgeStyle={(d, i) => ({
          fill: getColor(d),
          stroke: getColor(d),
          opacity: 0.5
        })}
        networkType={{
          type: "circlepack",
          projection: "vertical",
          padding: 0,
          hierarchySum: d => d.total_count,
        }}
        nodeIDAccessor="name"
        hoverAnnotation
        tooltipContent={d => (
          <div
            style={{
              position: 'absolute',
              left: window.innerWidth <= 989 ? -d.x : 330 - d.x,
              top: window.innerWidth <= 989 ? -d.y + 350 : -d.y - 50,
              height: '250px',
              background: '#f1f1f1',
              paddingLeft: '5px',
            }}
          >
            {d.parent ? <p>{d.parent.data.name}</p> : undefined}
            <p>{d.data.name}{console.log(d)}</p>
            <div
              style={{ width: '420px', height: '250px' }}
            >
              <div className="pull-left">
                <OrdinalFrame
                  size={[175, 175]}
                  data={[
                    { days: '0-30 days', count: d.data.under_30 },
                    { days: '31-60 days', count: d.data.under_60 },
                    { days: '61-90 days', count: d.data.under_90 },
                    { days: '>90 days', count: d.data.over_90 },
                  ]}
                  oAccessor={"days"}
                  dynamicColumnWidth={"count"}
                  style={pd => ({ fill: colorHash[pd.days], stroke: "white" })}
                  type={"bar"}
                  projection={"radial"}
                  oLabel={false}
                />
              </div>
              <div
                className="pull-right"
                style={{ fontWeight: 200, marginRight: '10px' }}
              >
                <div style={{ color: colorHash['0-30 days'] }}>0-30 days: {d.data.under_30}</div>
                <div style={{ color: colorHash['31-60 days'] }}>31-60 days: {d.data.under_60}</div>
                <div style={{ color: colorHash['61-90 days'] }}>61-90 days: {d.data.under_90}</div>
                <div style={{ color: colorHash['>90 days'] }}>&gt;90 days: {d.data.over_90}</div>
              </div>
            </div>
          </div>
        )}
        margin={50}
      />
    </div>
  </div>
);

export default PCardDaysCirclePack;
