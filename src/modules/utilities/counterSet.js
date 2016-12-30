export default class CounterSet {

  constructor(counters) {
    this.counters = {};
    if (counters) {
      counters.forEach((counter) => {
        if (typeof counter === 'string') {
          this.counters[counter] = { type: 'simple', total: 0 };
        } else {
          this.counters[counter.name] = { type: counter.type, total: 0, count: [], stats: [0, 0, 0] };
        }
      });
    }
  }

  createCounter(name, type = 'simple') {
    if (type === 'simple') {
      if (!(name in this.counters)) this.counters[name] = { type: 'simple', total: 0 };
    } else if (!(name in this.counters)) {
      this.counters[name] = { type: 'full', total: 0, count: [], stats: [0, 0, 0] };
    }
  }

  getValue(name) {
    if (name in this.counters) {
      return this.counters[name].total;
    }
    return null;
  }

  getStats(name) {
    if (name in this.counters && this.counters[name].type === 'full') {
      return this.counters[name].stats;
    }
    return null;
  }

  incrementCounter(name, inc = 1) {
    if (!(name in this.counters)) this.createCounter(name);
    this.counters[name].total += inc;
    if (this.counters[name].type === 'full') {
      this.counters[name].count.push(inc);
    }
  }

  finalizeCounter(name) {
    if ('count' in this.counters[name] && this.counters[name].count.length > 0) {
      this.counters[name].count.sort((val1, val2) => (Number(val1) - Number(val2)));
      this.counters[name].stats = [
        this.counters[name].count[Math.floor(this.counters[name].count.length / 2)],
        this.counters[name].count[0],
        this.counters[name].count[this.counters[name].count.length - 1],
      ];
    }
  }
}
