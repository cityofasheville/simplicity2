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
  if (d.under60 > 0) {
    return '#fdae61';
  }
  return '#4575b4';
};
  // '#d73027', '#fdae61', '#abd939', ];

const sumChildren = (d) => {
  let under30 = 0;
  let under60 = 0;
  let under90 = 0;
  let over90 = 0;

  d.children.forEach((child) => {
    under30 += child.under30;
    under60 += child.under60;
    under90 += child.under90;
    over90 += child.over90;
  });

  return (
    <div
      className="pull-right"
      style={{ fontWeight: 200, marginRight: '10px' }}
    >
      <div style={{ color: colorHash['0-30 days'] }}>0-30 days: {under30}</div>
      <div style={{ color: colorHash['31-60 days'] }}>31-60 days: {under60}</div>
      <div style={{ color: colorHash['61-90 days'] }}>61-90 days: {under90}</div>
      <div style={{ color: colorHash['>90 days'] }}>&gt;90 days: {over90}</div>
    </div>
  );
};

const sumPieData = (d) => {
  let under30 = 0;
  let under60 = 0;
  let under90 = 0;
  let over90 = 0;

  d.children.forEach((child) => {
    under30 += child.under30;
    under60 += child.under60;
    under90 += child.under90;
    over90 += child.over90;
  });

  return [
    { days: '0-30 days', count: under30 },
    { days: '31-60 days', count: under60 },
    { days: '61-90 days', count: under90 },
    { days: '>90 days', count: over90 },
  ];
};

const PCardDaysCirclePack = props => (
  <div
    style={{ flexBasis: '35%' }}
  >
    <div style={{ marginLeft: '-50px' }}>
      <NetworkFrame
        size={[400, 400]}
        edges={props.data}
        nodeStyle={d => ({
          fill: getColor(d),
          stroke: 'black',
          strokeOpacity: 0.25,
          fillOpacity: 0.25,
        })}
        edgeStyle={d => ({
          fill: getColor(d),
          stroke: getColor(d),
          opacity: 0.5,
        })}
        networkType={{
          type: 'circlepack',
          projection: 'vertical',
          padding: 0,
          hierarchySum: d => d.totalCount,
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
            <p>
              {
                d.data.breadcrumbPath === undefined ?
                  d.dept
                  :
                  <span>{[...new Set(d.data.breadcrumbPath.split('>').map(element => element.trim()))].slice(1).join(' > ')}</span>
              }
            </p>
            <div
              style={{ width: '420px', height: '250px' }}
            >
              <div className="pull-left">
                <OrdinalFrame
                  size={[175, 175]}
                  data={
                    d.parent ?
                      [
                        { days: '0-30 days', count: d.data.under30 },
                        { days: '31-60 days', count: d.data.under60 },
                        { days: '61-90 days', count: d.data.under90 },
                        { days: '>90 days', count: d.data.over90 },
                      ]
                      :
                      sumPieData(d)
                  }
                  oAccessor="days"
                  dynamicColumnWidth="count"
                  style={pd => ({ fill: colorHash[pd.days], stroke: 'white' })}
                  type="bar"
                  projection="radial"
                  oLabel={false}
                />
              </div>
              {
                d.parent ?
                  <div
                    className="pull-right"
                    style={{ fontWeight: 200, marginRight: '10px' }}
                  >
                    <div style={{ color: colorHash['0-30 days'] }}>0-30 days: {d.data.under30}</div>
                    <div style={{ color: colorHash['31-60 days'] }}>31-60 days: {d.data.under60}</div>
                    <div style={{ color: colorHash['61-90 days'] }}>61-90 days: {d.data.under90}</div>
                    <div style={{ color: colorHash['>90 days'] }}>&gt;90 days: {d.data.over90}</div>
                  </div>
                  :
                  sumChildren(d)
              }
            </div>
          </div>
        )}
        margin={50}
      />
    </div>
  </div>
);

export default PCardDaysCirclePack;
