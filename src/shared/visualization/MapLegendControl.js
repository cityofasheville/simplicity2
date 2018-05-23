import React from 'react';
import ReactDOM from 'react-dom';
import { MapControl } from 'react-leaflet';
import L from 'leaflet';

export default class MapLegendControl extends MapControl {
  componentWillMount() {
    const legend = L.control({ position: 'bottomright' });
    const jsx = <div {...this.props}>{this.props.children}</div>;

    legend.onAdd = function (map) {
      const div = L.DomUtil.create('div', '');
      L.DomEvent.on(div, 'click', (e) => {
        if (!e.target.classList.contains('closeLegend')) {
          if (e.target.tagName === 'svg') {
            e.target.parentNode.nextSibling.style.display =
              e.target.parentNode.nextSibling.style.display === 'block' ? 'none' : 'block';
          } else if (e.target.tagName === 'path') {
            e.target.parentNode.parentNode.parentNode.nextSibling.style.display =
              e.target.parentNode.parentNode.parentNode.nextSibling.style.display === 'block'
                ? 'none'
                : 'block';
          } else {
            e.target.nextSibling.style.display =
              e.target.nextSibling.style.display === 'block' ? 'none' : 'block';
          }
        }
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
