/**
*
* PieChart
*
*/

import React from 'react';
import Chart from 'chart.js';

class PieChart extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {};
    this.savedDiv = null;
    this.savedChart = null;
    this.chartData = {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [],
          hoverBackgroundColor: [],
        }],
    };
    this.chartOptions = {
      responsive: true,
      animation: {
        animateRotate: false,
        animateScale: false,
      },
      maintainAspectRation: false,
      legend: {
        display: true,
        position: 'bottom',
        fullWidth: false,
      },
      title: {
        display: true,
        fontSize: 18,
        text: '',
      },
    };
  }

  componentDidMount() {
    const el = this.savedDiv;
    if (el != null) {
      const myChart = new Chart(el, {
        type: 'pie',
        title: 'Hi',
        data: this.chartData,
        options: this.chartOptions,
      });
      this.savedChart = myChart;
    }
  }

  componentDidUpdate() {
    const el = this.savedDiv;
    if (this.savedChart != null) {
      this.savedChart.destroy();
      this.savedChart = null;
    }
    if (el != null) {
      const myChart = new Chart(el, {
        type: 'pie',
        data: this.chartData,
        options: this.chartOptions,
      });
      this.savedChart = myChart;
    }
  }

  componentWillUnmount() {
    // Not sure this is actually doing anything.
    const tts = document.getElementsByClassName('bar-tooltip');
    if (tts) {
      for (let i = 0; i < tts[i]; ++i) {
        tts[i].remove();
      }
    }
    // $('.bar-tooltip').remove();
  }

  saveDiv(div) {
    this.savedDiv = div;
  }

  render() {
    const { data } = this.props;
    let colorIndex = 0;
    const colors = [
      '#5DA5DA', // (blue)
      '#FAA43A', // (orange)
      '#60BD68', // (green)
      '#F17CB0', // (pink)
      '#B2912F', // (brown)
      '#B276B2', // (purple)
      '#DECF3F', // (yellow)
      '#F15854', // (red)
      '#4D4D4D',  // (gray)
    ];

    const labels = [];
    const ds = {
      data: [],
      backgroundColor: [],
      hoverBackgroundColor: [],
    };
    data.forEach((item) => {
      labels.push(item.key);
      ds.data.push(item.value + 0);
      ds.backgroundColor.push(colors[colorIndex]);
      ds.hoverBackgroundColor.push(colors[colorIndex]);
      ++colorIndex;
      if (colorIndex >= colors.length) colorIndex = 0;
    });

    this.chartData = {
      labels,
      datasets: [ds],
    };
    this.chartOptions.title.text = this.props.title;
    const saveDiv = this.saveDiv.bind(this); // eslint-disable-line react/jsx-no-bind
    return (
      <div>
        <canvas ref={saveDiv}></canvas>
      </div>
    );
  }
}

PieChart.propTypes = {
  data: React.PropTypes.array.isRequired,
  title: React.PropTypes.string.isRequired,
};

export default PieChart;
