import { expect, test, describe, it } from 'vitest';
import { ITask } from './db';
import {
  urgencyDueDate,
  urgencyTags,
  urgencyStatus,
  totalUrgency,
} from './urgency';
import { defaultTagUrgencyMap, defaultStatusUrgencyMap } from './defaults';

const defaultTagConst: number = 1;

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

describe('urgencyTags', () => {
  it('should return 0 for a task with no tags', () => {
    const task: ITask = {
      summary: 'task with no tags',
      status: 'DONE',
    };

    const taskValueHash = new Map<string, number>();

    expect(urgencyTags(task, taskValueHash)).toBe(0);
  });

  it('should return the sum of tag scores for a task with tags', () => {
    const task: ITask = {
      summary: 'task with some tags',
      status: 'DONE',
      tags: ['tag1', 'tag2', 'tag3'],
    };

    const taskValueHash = new Map<string, number>();
    taskValueHash.set('tag1', 5);
    taskValueHash.set('tag2', 10);
    taskValueHash.set('tag3', 15);

    // The expected result is 5 + 10 + 15 = 30
    expect(urgencyTags(task, taskValueHash)).toBe(30);
  });

  it('should handle missing tag values with a default value', () => {
    const task: ITask = {
      summary: 'task with no tags',
      status: 'DONE',
      tags: ['tag1', 'tag2', 'tag3'],
    };

    const taskValueHash = new Map<string, number>();
    taskValueHash.set('tag1', 5);
    taskValueHash.set('tag3', 15); // 'tag2' is missing

    // The expected result is 5 + defaultTagConst (default value) + 15 = defaultTagConst + 20
    expect(urgencyTags(task, taskValueHash)).toBe(defaultTagConst + 20);
  });
});

describe('urgencyStatus', () => {
  it('should return 0 for a task with an unknown status', () => {
    const task: ITask = {
      summary: 'null task',
      status: 'unknownStatus', // A status not found in priorityValueHash
    };

    const priorityValueHash = new Map<string, number>();

    expect(urgencyStatus(task, priorityValueHash)).toBe(0);
  });

  it('should return the value associated with the task status', () => {
    const task: ITask = {
      summary: 'null task',
      status: 'high', // A status found in priorityValueHash
    };

    const priorityValueHash = new Map<string, number>();
    priorityValueHash.set('low', 1);
    priorityValueHash.set('medium', 5);
    priorityValueHash.set('high', 10);

    // The expected result is 10 because 'high' status is associated with a value of 10
    expect(urgencyStatus(task, priorityValueHash)).toBe(10);
  });

  it('should return 0 for a task with no status', () => {
    const task: ITask = {
      summary: 'null task',
      status: '', // Define a task with empty status
    };

    const priorityValueHash = new Map<string, number>();

    expect(urgencyStatus(task, priorityValueHash)).toBe(0);
  });
});

describe('Test total urgency', () => {
  it('due two weeks = 0, 2 tags = 2, pending = 0;', () => {
    expect(
      totalUrgency(
        taskDueTwoWeeks,
        defaultTagUrgencyMap,
        defaultStatusUrgencyMap,
        currentTestingDate
      )
    ).toBe(2);
  });
});
