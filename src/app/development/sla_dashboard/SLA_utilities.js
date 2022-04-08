export const getTasks = () => (
  [
    'Addressing',
    'Building Review',
    'Fire Review',
    'Zoning Review',
    'Driveway',
    'Grading',
    'Stormwater',
  ]
);

export const getAverageCounts = (slaData) => {
  const formattedData = {};
  for (let task of getTasks()) {
    formattedData[task] = [];
  }
  for (let record of slaData) {
    const item = Object.assign({}, {
      month: record.month,
      year: record.year,
      displayDate: [record.month, record.year].join('/')
    });
    item[[record.task, 'Met SLA'].join(' ')] = record.met_sla;
    item[[record.task, 'Past SLA'].join(' ')] = record.past_sla;
    item[[record.task, 'Met SLA Percent'].join(' ')] = Math.round(record.met_sla_percent);
    formattedData[record.task].push(item);
  }
  for (let task of getTasks()) {
    formattedData[task].sort((a, b) => {
      if (a.year < b.year) {
        return -1;
      }
      if (a.year > b.year) {
        return 1;
      }
      return ((a.month < b.month) ? -1 : ((a.month > b.month) ? 1 : 0)) // eslint-disable-line
    });
  }
  return formattedData;
};
