import React from 'react';
import { NetworkFrame, OrdinalFrame } from 'semiotic';

const colorHash = {
  'Has receipt': '#4575b4',
  'Missing receipt': '#d73027',
};

const getColor = (d) => {
  if (d.missing_itemized_receipt > 0) {
    return '#d73027';
  }
  return '#4575b4';
};
  // '#d73027', '#fdae61', '#abd939', ];

const sumChildren = (d) => {
  let hasReceipt = 0;
  let missingReceipt = 0;

  d.children.forEach((child) => {
    hasReceipt += child.has_itemized_receipt;
    missingReceipt += child.missing_itemized_receipt;
  });

  return (
    <div
      className="pull-right"
      style={{ fontWeight: 200, marginRight: '10px' }}
    >
      <div style={{ color: colorHash['Has receipt'] }}>Has receipt: {hasReceipt}</div>
      <div style={{ color: colorHash['Missing receipt'] }}>Missing receipt: {missingReceipt}</div>
    </div>
  );
};

const sumPieData = (d) => {
  let hasReceipt = 0;
  let missingReceipt = 0;

  d.children.forEach((child) => {
    hasReceipt += child.has_itemized_receipt;
    missingReceipt += child.missing_itemized_receipt;
  });

  return [
    { receipt: 'Has receipt', count: hasReceipt },
    { receipt: 'Missing receipt', count: missingReceipt },
  ];
};

const PCardReceiptsCirclePack = props => (
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
          hierarchySum: d => d.total_receipts,
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
              style={{ width: '435px', height: '250px' }}
            >
              <div className="pull-left">
                <OrdinalFrame
                  size={[175, 175]}
                  data={
                    d.parent ?
                      [
                        { receipt: 'Has receipt', count: d.data.has_itemized_receipt },
                        { receipt: 'Missing receipt', count: d.data.missing_itemized_receipt },
                      ]
                      :
                      sumPieData(d)
                  }
                  oAccessor="receipt"
                  dynamicColumnWidth="count"
                  style={pd => ({ fill: colorHash[pd.receipt], stroke: 'white' })}
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
                    <div style={{ color: colorHash['Has receipt'] }}>Has receipt: {d.data.has_itemized_receipt}</div>
                    <div style={{ color: colorHash['Missing receipt'] }}>Missing receipt: {d.data.missing_itemized_receipt}</div>
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

export default PCardReceiptsCirclePack;

