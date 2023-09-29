import Dexie, { Table } from 'dexie';

/**
 * @interface Most of the expected and optional fields of a task object.
 * @optional {number} id will be created internally when the record is stored
 * @param {string} summary is a required summary
 * @param {string} status of the task: PENDING, BLOCKED, BLOCKING, DONE...
 */
export interface ITask {
  id?: number;
  summary: string;
  status: string;
  tags?: string[];
  dateDue?: number;
  dateMod?: number;
  dateCompleted?: number;
  dateCreated?: number;
}

export class TasksDexie extends Dexie {
  tasks!: Table<ITask, number>;

  /**
   * Wrapper class extending Dexie to be aware of types.
   *
   * @param databaseName - Arbitrary name of database.
   * @returns Extended Dexie object with indexes.
   */
  constructor(databaseName: string) {
    super(databaseName);
    this.version(1).stores({
      tasks: '++id, status, *tags ', // Primary key and indexed props
    });
  }
}

export const db = new TasksDexie('TasksDexie');
