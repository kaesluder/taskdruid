import { expect, test } from 'vitest';
import { ITask } from './db';
import { sameDay, formatTaskDate } from './due';

const currentTestingDate: Date = new Date('2023-09-03T13:00:00-0400');

const taskDueFutureThursday: ITask = {
  summary: 'A test task: 1',
  status: 'PENDING',
  tags: ['a', 'b'],
  dateDue: new Date('2023-09-07T00:00:01-0400').valueOf(),
};

const taskDueToday: ITask = {
  summary: 'A test task: 2',
  status: 'PENDING',
  tags: ['b', 'c'],
  dateDue: new Date('2023-09-03T00:00:01-0400').valueOf(),
};

const taskDueYesterday: ITask = {
  summary: 'A test task: 3',
  status: 'PENDING',
  tags: ['b', 'c'],
  dateDue: Date.parse('2023-09-02T00:00:01-0400'),
};

const taskDueTwoWeeks: ITask = {
  summary: 'A test task: 4',
  status: 'PENDING',
  tags: ['b', 'c'],
  dateDue: Date.parse('2023-09-17T00:00:01-0400'),
};

test('sameday works', () => {
  const d1 = new Date();
  const d2 = new Date();
  expect(sameDay(d1, d2));
});

test('tasks due today should be formatted as "today"', () => {
  const formattedDate = formatTaskDate(
    taskDueToday.dateDue,
    currentTestingDate
  );
  expect(formattedDate).toBe('today');
});

test('tasks due next thursday should be formatted as "thursday"', () => {
  const formattedDate = formatTaskDate(
    taskDueFutureThursday.dateDue,
    currentTestingDate
  );
  expect(formattedDate).toBe('Thursday');
});

test('tasks due in past should be noted by negative days', () => {
  const formattedDate = formatTaskDate(
    taskDueYesterday.dateDue,
    currentTestingDate
  );
  expect(formattedDate).toBe('-1d');
});

test('tasks due more than a week in the future should be noted by days', () => {
  const formattedDate = formatTaskDate(
    taskDueTwoWeeks.dateDue,
    currentTestingDate
  );
  expect(formattedDate).toBe('13d');
});
