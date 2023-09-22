import { ITask } from './db';
import { sameDay, formatTaskDate } from './due';

/**
 * Due date urgency calculation.
 *
 * 1. Start with dueDayConst - (dueDay - today) * dayDiffConst
 * 2. Default min and max. 0 and dueDayConst * 2
 */

const DAY_INTERVAL = 1000 * 60 * 60 * 24;

// TODO Move these to user configurable vars.
const dueDayConst: number = 14;
const dayDiffConst: number = 1;

/**
 * Convert time in milliseconds since epoch to days since epoch.
 * @param milliseconds standard unix time in milliseconds
 * @returns unix time converted to days since epoch.
 */
const millisecondsToDays = function (milliseconds: number): number {
  return milliseconds / DAY_INTERVAL;
};

/**
 * Round number to two decimal places.
 * @param n number to round to
 * @returns rounded number
 */
const round = function (n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
};

const today = function (now?: Date | undefined): number {
  const workingNow: Date = now || new Date();
  return millisecondsToDays(workingNow.valueOf());
};

/**
 * Returns an urgency value between a minimum and a maximum. Urgency increases
 * as the due date approaches. Time flies like an eagle on Fridays.
 *
 * 1. Start with dueDayConst - (dueDay - today) * dayDiffConst
 * 2. Default min and max. 0 and dueDayConst * 2
 *
 * @param task A task to calculate for. If task.dueDate is undefined, function returns 0
 * @param now? (optional) Date object representing "now" for testing.
 * @returns numeric value rounded to two decimal places representing urgency.
 */
export const urgencyDueDate = function (
  task: ITask,
  now?: Date | undefined
): number {
  if (task.dateDue === undefined) return 0;
  const rawResult: number = round(
    dueDayConst - (millisecondsToDays(task.dateDue) - today(now)) * dayDiffConst
  );

  // return values where 0 < rawResult < dueDayConst * 2
  return Math.max(Math.min(rawResult, dueDayConst * 2), 0);
};
