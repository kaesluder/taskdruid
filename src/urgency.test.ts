import { expect, test } from 'vitest';
import { ITask } from './db';
import { urgencyDueDate } from './urgency';

const currentTestingDate: Date = new Date('2023-09-03T12:00:00-0400');

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
  dateDue: Date.parse('2023-09-02T12:00:01-0400'),
};

const taskDueTwoWeeks: ITask = {
  summary: 'A test task: 4',
  status: 'PENDING',
  tags: ['b', 'c'],
  dateDue: Date.parse('2023-09-17T12:00:01-0400'),
};

const taskDueLastMonth: ITask = {
  summary: 'A test task: 4',
  status: 'PENDING',
  tags: ['b', 'c'],
  dateDue: Date.parse('2023-08-17T12:00:01-0400'),
};

const taskDueNextMonth: ITask = {
  summary: 'A test task: 4',
  status: 'PENDING',
  tags: ['b', 'c'],
  dateDue: Date.parse('2023-10-17T12:00:01-0400'),
};

test('due today', () => {
  expect(urgencyDueDate(taskDueToday, currentTestingDate)).toBe(14.5);
});

test('due in two weeks', () => {
  expect(urgencyDueDate(taskDueTwoWeeks, currentTestingDate)).toBe(0);
});

test('due yesterday', () => {
  expect(urgencyDueDate(taskDueYesterday, currentTestingDate)).toBe(15);
});

test('due last month returns 28 for max', () => {
  expect(urgencyDueDate(taskDueLastMonth, currentTestingDate)).toBe(28);
});

test('due next month returns 0 for max', () => {
  expect(urgencyDueDate(taskDueNextMonth, currentTestingDate)).toBe(0);
});
