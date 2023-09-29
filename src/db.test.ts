import { expect, test } from 'vitest';
import 'fake-indexeddb/auto';
import { ITask, TasksDexie } from './db';

const testTask: ITask = {
  summary: 'A test task: 1',
  status: 'PENDING',
  tags: ['a', 'b'],
};

const testTask2: ITask = {
  summary: 'A test task: 2',
  status: 'PENDING',
  tags: ['b', 'c'],
};

test('insert a field', async () => {
  const db = await new TasksDexie('test1');
  const id = await db.tasks.add(testTask);
  expect(id).toBe(1);
});

test('insert then query a field', async () => {
  const db = await new TasksDexie('test2');
  await db.tasks.add(testTask);
  const queriedTask = await db.tasks.where('id').equals(1).toArray();
  expect(queriedTask[0].summary).toBe(testTask.summary);
});

test('insert two', async () => {
  const db = await new TasksDexie('test3');
  await db.tasks.add(testTask);
  await db.tasks.add(testTask2);
  const queriedTask = await db.tasks
    .where('status')
    .equals('PENDING')
    .sortBy('id');
  expect(queriedTask.length).toBe(2);
});

test('search by tag b returns 2 records', async () => {
  const db = await new TasksDexie('test4');
  await db.tasks.add(testTask);
  await db.tasks.add(testTask2);
  const queriedTask = await db.tasks.where('tags').equals('b').sortBy('id');
  expect(queriedTask.length).toBe(2);
});
