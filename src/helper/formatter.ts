/**
 * Returns ticks for the given timespan:
 * - each 1th of month if timespan is longer than one month
 * - each week (after first date) if timespan is between 10 day and 1 month
 * - each day if timespan is smaller than 10 day
 *
 * Unfortunately we need to rewrite logic like this, because recharts lib
 * does not yet have a "date" scale.
 *
 * @param first First date of the timespan in millisecs since 1970.
 * @param last Last date of the timespan in millisecs since 1970.
 */
export const generateXTicks = (first: number, last: number): any[] => {
  const oneDayInMillis = 1000 * 60 * 60 * 24;
  const firstDate = new Date(first);
  // get difference between dates in days
  const diffDays = (last - first) / oneDayInMillis;

  const ticks = [];

  if (diffDays > 30) {
    // return each month as ticks
    let nextMonthStart = new Date(
      firstDate.getFullYear(),
      firstDate.getMonth() + 1,
      1
    );
    while (nextMonthStart.getTime() < last && ticks.length < 30) {
      ticks.push(nextMonthStart.getTime());
      nextMonthStart = new Date(
        nextMonthStart.getFullYear(),
        nextMonthStart.getMonth() + 1,
        1
      );
    }
  } else if (diffDays > 10) {
    // return each week as ticks
    let oneWeekLater = new Date(
      firstDate.getFullYear(),
      firstDate.getMonth(),
      firstDate.getDate() + 7
    );
    while (oneWeekLater.getTime() < last && ticks.length < 30) {
      ticks.push(oneWeekLater.getTime());
      oneWeekLater = new Date(
        oneWeekLater.getFullYear(),
        oneWeekLater.getMonth(),
        oneWeekLater.getDate() + 7
      );
    }
  } else {
    // return each day as ticks
    let oneDayLater = first + oneDayInMillis;
    while (oneDayLater < last && ticks.length < 30) {
      ticks.push(oneDayLater);
      oneDayLater += oneDayInMillis;
    }
  }
  return ticks;
};

export const generateYTicks = (max: number) => {
  const ticks = [0];
  let value = 50;
  while (value < max) {
    ticks.push(value);
    value += 50;
  }
  ticks.push(value);
  return ticks;
};

export const formatDate = (date: number) => {
  return new Date(date).toLocaleDateString();
};
