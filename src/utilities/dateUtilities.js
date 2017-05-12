// TODO: convert to functions


class DateUtilities {
  // Returns the ISO week of the date. From https://weeknumber.net/how-to/javascript
  getWeek(dd) {
    const date = new Date(dd.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7); // eslint-disable-line no-mixed-operators
    // January 4 is always in week 1.
    const week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 // eslint-disable-line no-mixed-operators
                          - 3 + (week1.getDay() + 6) % 7) / 7); // eslint-disable-line no-mixed-operators
  }

  // Returns the four-digit year corresponding to the ISO week of the date.
  getWeekYear(dd) {
    const date = new Date(dd.getTime());
    date.setDate((date.getDate() + 3) - (date.getDay() + 6) % 7); // eslint-disable-line no-mixed-operators
    return date.getFullYear();
  }

  dateIndex(date, mode) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let idx = null;
    if (mode === 'month') {
      const m = date.getMonth();
      idx = { index: m, value: months[m] };
    } else if (mode === 'week') {
      const week = this.getWeek(date);
      const dd = new Date(date.getTime());
      dd.setHours(0, 0, 0, 0);
      dd.setDate(dd.getDate() - (dd.getDay() + 6) % 7); // eslint-disable-line no-mixed-operators
      idx = { index: week, value: months[dd.getMonth()] };
    } else if (mode === 'day-of-week') {
      const day = date.getDay();
      idx = { index: day, value: days[day] };
    }
    return idx;
  }

  inDateRange(inDate, start, end) {
    let inRange = true;
    const date = new Date(inDate).getTime();
    if ((start && date < start.getTime()) ||
        (end && date > end.getTime())) {
      inRange = false;
    }
    return inRange;
  }
}

export default new DateUtilities();
