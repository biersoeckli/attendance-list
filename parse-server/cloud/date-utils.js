const weekdaysShort = new Map([
  [0, 'So'],
  [1, 'Mo'],
  [2, 'Di'],
  [3, 'Mi'],
  [4, 'Do'],
  [5, 'Fr'],
  [6, 'Sa'],
]);

const weekdays = new Map([
  [0, 'Sonntag'],
  [1, 'Montag'],
  [2, 'Dienstag'],
  [3, 'Mittwoch'],
  [4, 'Donnerstag'],
  [5, 'Freitag'],
  [6, 'Samstag'],
]);

/**
 * Checks if date2 is greather than date 1
 */
function gt(date1, date2) {
  if (!date1 || !date2) {
    return false;
  }
  return date1.getTime() <= date2.getTime();
}

/**
 * Checks if date2 is less than date 1
 */
function lt(date1, date2) {
  if (!date1 || !date2) {
    return false;
  }
  return date1.getTime() > date2.getTime();
}

function isSameDay(date1, date2) {
  if (!date1 || !date2) {
    return false;
  }
  const dayEquals = +date1.getDate() == +date2.getDate();
  const monthEquals = +date1.getMonth() == +date2.getMonth();
  const yearEquals = +date1.getFullYear() == +date2.getFullYear();
  return dayEquals && monthEquals && yearEquals;
}

function isTomorrow(date1) {
  if (!date1) {
    return false;
  }
  const now = new Date();
  return this.isSameDay(date1, this.addDays(now, 1));
}

function isYesterday(date1) {
  if (!date1) {
    return false;
  }
  const now = new Date();
  return this.isSameDay(date1, this.addDays(now, -1));
}

function isToday(date1) {
  if (!date1) {
    return false;
  }
  const now = new Date();
  return this.isSameDay(date1, now);
}

function addMinutes(date, days) {
  const newDate = new Date(date);
  newDate.setMinutes(+newDate.getMinutes() + days);
  return newDate;
}

function addDays(date, days) {
  const newDate = new Date(date);
  newDate.setDate(+newDate.getDate() + days);
  return newDate;
}

function addHours(date, days) {
  const newDate = new Date(date);
  newDate.setHours(+newDate.getHours() + days);
  return newDate;
}

function addMonths(date, days) {
  const newDate = new Date(date);
  newDate.setMonth(+newDate.getMonth() + days);
  return newDate;
}

function getMidnight(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
}

function getEndOfDay(date) {
  const midnight = this.getMidnight(date);
  const nextDate = this.addDays(midnight, 1);
  return this.addMinutes(nextDate, -1);
}

exports.gt = gt;
exports.lt = lt;
exports.isSameDay = isSameDay;
exports.isTomorrow = isTomorrow;
exports.isYesterday = isYesterday;
exports.isToday = isToday;
exports.addMinutes = addMinutes;
exports.addDays = addDays;
exports.addHours = addHours;
exports.addMonths = addMonths;
exports.getMidnight = getMidnight;
exports.getEndOfDay = getEndOfDay;
