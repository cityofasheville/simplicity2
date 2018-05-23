export default class TimeSeriesSet {

  constructor(series) {
    this.series = {};
    if (series) {
      series.forEach((name) => {
        this.series[name] = { data: [], labels: [], minIndex: Number.MAX_SAFE_INTEGER };
      });
    }
  }

  getSeries(name) {
    if (name in this.series) return this.series[name];
    return null;
  }

  getSeriesData(name) {
    if (name in this.series) return this.series[name].data;
    return null;
  }

  getSeriesLabels(name) {
    if (name in this.series) return this.series[name].labels;
    return null;
  }

  addSeries(name) {
    this.series[name] = { data: [], labels: [], minIndex: Number.MAX_SAFE_INTEGER };
  }

  addTimePoint(seriesName, index, value) {
    if (!(seriesName in this.series)) this.addSeries(seriesName);
    const set = this.series[seriesName];
    if (!(set.data[index])) {
      set.data[index] = 0;
      set.labels[index] = value;
      set.minIndex = Math.min(set.minIndex, index);
    }
    set.data[index] += 1;
  }

  pruneTimeStats(set) {
    let newSet = set;
    if (set && set.labels && set.labels.length > 1) {
      const pdata = set.data;
      const plabels = set.labels;
      const minIndex = set.minIndex;
      newSet = { data: [], labels: [], minIndex };
      let last = null;
      pdata.forEach((item, idx) => {
        let label = plabels[idx];
        if (label === last) label = '';
        last = plabels[idx];
        newSet.data[idx - minIndex] = item;
        newSet.labels[idx - minIndex] = label;
      });
    }
    return newSet;
  }

  finalizeSeries(name = null) {
    if (name) {
      this.series[name] = this.pruneTimeStats(this.series[name]);
    } else {
      Object.keys(this.series).forEach((key) => {
        this.series[key] = this.pruneTimeStats(this.series[key]);
      });
    }
  }
}
