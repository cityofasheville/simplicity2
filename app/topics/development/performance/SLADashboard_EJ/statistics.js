
class Statistics {

  inDateRange(inDate, start, end) {
    let inRange = true;
    const date = new Date(inDate).getTime();
    if ((start && date < start.getTime()) ||
        (end && date > end.getTime())) {
      inRange = false;
    }
    return inRange;
  }

  applyFilters(item, filters) {
    let include = true;
    let iFilter = 0;
    while (include && iFilter < filters.length) {
      const { field, type, values } = filters[iFilter];
      if (field in item && item[field]) {
        switch (type) {
          case 'date_range':
            if (!this.inDateRange(item[field], values[0], values[1])) include = false;
            break;

          case 'truthy_in_set':
            if (!(item[field] in values) || !(values[item[field]])) include = false;
            break;

          default:
            // Unknown filter, just let it pass through
            break;
        }
      } else {
        include = false;
      }
      ++iFilter;
    }
    return include;
  }

  filter(input, filters) {
    const output = [];
    input.forEach((item) => {
      if (this.applyFilters(item, filters)) output.push(item);
    });
    return output;
  }

  categoryCounts(data, cFields) {
    const counters = {};
    data.forEach((item) => {
      cFields.forEach((field) => {
        if (!(field in counters)) counters[field] = {};
        const c = item[field];
        if (!(c in counters[field])) counters[field][c] = 0;
        ++counters[field][c];
      });
    });

    const result = {};
    Object.keys(counters).forEach((field) => {
      result[field] = [];
      Object.keys(counters[field]).forEach((val) => {
        result[field].push({ key: val, value: counters[field][val] });
      });
    });

    return result;
  }
}

export default new Statistics();
