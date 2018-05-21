import React from 'react';
import { NetworkFrame } from 'semiotic';

class PCardDaysSunburst extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (<div>
      <NetworkFrame
        size={[700, 700]}
        edges={this.props.data}
        nodeStyle={(d, i) => ({
          fill: '#fff', //colors[d.depth],
          stroke: "black",
          opacity: 0.75
        })}
        nodeIDAccessor={"name"}
        hoverAnnotation={true}
        networkType={{
          type: "partition",
          projection: "radial",
          nodePadding: 1,
          hierarchySum: d => d.total_count
        }}
        tooltipContent={d => (
          <div className="tooltip-content">
            {d.parent ? <p>{d.parent.data.name}</p> : undefined}
            <p>{d.data.name}</p>
          </div>
        )}
        margin={10}
      />
    </div>);
  }
}

export default PCardDaysSunburst;
