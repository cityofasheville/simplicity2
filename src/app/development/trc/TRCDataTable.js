import React from 'react';
// import PropTypes from 'prop-types';
import { timeDay, timeMonth } from 'd3-time';
import PermitsTableWrapper from '../permits/PermitsTableWrapper';
import TimeSlider from '../volume/TimeSlider';
import ErrorBoundary from '../../ErrorBoundary';
import TypePuck from './TypePuck';
import { trcProjectTypes, defaultTableHeaders } from '../utils';


class TRCDataTable extends React.Component {
  constructor() {
    super();
    const now = timeDay.floor(new Date());
    this.initialBrushExtent = [
      timeMonth.offset(now, -3).getTime(),
      now.getTime(),
    ];
    this.state = {
      timeSpan: this.initialBrushExtent,
    };
  }

  render() {
    const tableHeaders = defaultTableHeaders.map(d => {
      if (d.field !== 'permit_subtype') {
        return d;
      }
      const rObj = Object.assign({}, d);
      rObj.formatFunc = d => {
        let trcType = Object.values(trcProjectTypes).find(type =>
          type.permit_type === d.permit_type &&
          type.permit_subtype === d.permit_subtype
        )
        return (<div>
          <span style={{ marginRight: '1em' }}>{trcType.permit_subtype}</span>
          <div style={{ verticalAlign: 'middle', display: 'inline-block' }}>
            <TypePuck
              typeObject={trcType}
              size={30}
            />
          </div>
        </div>);
      }
      return rObj;
    })

    return (<div>
      <ErrorBoundary>
        <TimeSlider
          onBrushEnd={newExtent => this.setState({
            timeSpan: newExtent,
          })}
          defaultBrushExtent={this.initialBrushExtent}
          xSpan={2}
        />
        <PermitsTableWrapper
          // Defaults are fine for now
          after={this.state.timeSpan[0]}
          before={this.state.timeSpan[1]}
          projectTypes={trcProjectTypes}
          tableHeaders={tableHeaders}
        />
      </ErrorBoundary>
    </div>);
  }
}

export default TRCDataTable;
