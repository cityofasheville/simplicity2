import React from 'react';
import ReactDOM from 'react-dom';
import { MapControl } from 'react-leaflet';
import L from 'leaflet';

export default class MapLegendControl extends MapControl {
  componentWillMount() {
    const legend = L.control({ position: 'bottomright' });
    const jsx = (
      <div {...this.props}>
        {this.props.children}
      </div>
    );

    legend.onAdd = function (map) {
      const div = L.DomUtil.create('div', '');
      L.DomEvent.on(div, 'click', (e) => {
        e.target.nextSibling.style.display = e.target.nextSibling.style.display === 'block' ? 'none' : 'block';
      });
      ReactDOM.render(jsx, div);
      return div;
    };

    this.leafletElement = legend;
  }
}

MapLegendControl.defaultProps = {
  id: 'legend',
};
