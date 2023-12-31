import { ITask } from './db';

const DAY_INTERVAL = 1000 * 60 * 60 * 24;
const WEEK_INTERVAL = DAY_INTERVAL * 7;

/**
 * Return true if two dates are on the "same day". Probably converts
 * to local time zone. Good enough if both dates are flagged in the same
 * TZ.
 * @param d1 Date 1
 * @param d2 Date 2
 * @returns boolean true/false.
 */
export const sameDay = function (d1: Date, d2: Date) {
  //console.log(d1);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

/**
 * Text formatting for due dates. Returns day-of-week
 * for nearby dates.
 *
 * Time flies like an eagle, fruit flies like a banana.
 *
 * @param taskDate due date of task in unix milliseconds
 * @param now (optional) optional "now" value used for testing
 * @returns
 */
export const formatTaskDate = function (
  taskDate: number | undefined,
  now?: Date | undefined
) {
  const workingNow: Date = now || new Date();
  //   if (workingNow - task.dateDue < DAY_INTERVAL) {
  //     return 'today';
  //   }

  if (taskDate === undefined) return '';

  const taskDateDate = new Date(taskDate);

  const dateDiff = taskDate - workingNow.valueOf();
  console.log(`taskDateDate ${taskDateDate}`);
  console.log(`dateDiff ${dateDiff}`);
  console.log(`WEEK_INTERVAL ${WEEK_INTERVAL}`);
  console.log(`DAY_INTERVAL ${DAY_INTERVAL}`);

  if (dateDiff >= -DAY_INTERVAL && dateDiff <= 0) return 'today';
  if (dateDiff >= 0 && dateDiff <= DAY_INTERVAL) return 'tomorrow';
  if (dateDiff >= DAY_INTERVAL && dateDiff <= WEEK_INTERVAL)
    return taskDateDate.toLocaleDateString('en-US', { weekday: 'long' });
  if (dateDiff < -DAY_INTERVAL)
    return `${Math.trunc(dateDiff / DAY_INTERVAL)}d`;
  if (dateDiff > WEEK_INTERVAL)
    return `${Math.trunc(dateDiff / DAY_INTERVAL)}d`;
};
