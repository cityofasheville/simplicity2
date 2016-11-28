/**
*
* BarChart
*
*/

import React from 'react';
import Chart from 'chart.js';

class BarChart extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {};
    this.savedDiv = null;
    this.savedChart = null;
    this.chartData = {
      labels: [],
      datasets: [
        {
          backgroundColor: [],
          borderColor: [],
          borderWidth: 1,
          data: [],
        }],
    };
    this.chartOptions = {
      responsive: true,
      animation: false,
      maintainAspectRation: false,
      legend: {
        display: false,
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
        type: 'bar',
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
        type: 'bar',
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
//    $('.bar-tooltip').remove();
  }

  saveDiv(div) {
    this.savedDiv = div;
  }

  render() {
    const { data, labels } = this.props;
    // const colors = [
    //   '#5DA5DA', // (blue)
    //   '#FAA43A', // (orange)
    //   '#60BD68', // (green)
    //   '#F17CB0', // (pink)
    //   '#B2912F', // (brown)
    //   '#B276B2', // (purple)
    //   '#DECF3F', // (yellow)
    //   '#F15854', // (red)
    //   '#4D4D4D',  // (gray)
    // ];
    this.chartData.labels = labels;
    this.chartData.datasets[0].data = data;
    this.chartData.datasets[0].backgroundColor = new Array(data.length).fill('#5DA5DA');
    this.chartData.datasets[0].borderColor = new Array(data.length).fill('#777777');
    this.chartOptions.title.text = this.props.title;
    const saveDiv = this.saveDiv.bind(this); // eslint-disable-line react/jsx-no-bind
    return (
      <div>
        <canvas ref={saveDiv}></canvas>
      </div>
    );
  }
}

BarChart.propTypes = {
  data: React.PropTypes.array.isRequired,
  labels: React.PropTypes.array.isRequired,
  title: React.PropTypes.string.isRequired,
};

export default BarChart;
