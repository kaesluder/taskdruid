import Dexie, { Table } from 'dexie';

export interface ITask {
  /**
   * The id of the task. Optional.
   */
  id?: number;
  /**
   * The summary of the task.
   */
  summary: string;
  /**
   * The status of the task.
   */
  status: string;
  /**
   * The tags associated with the task. Optional.
   */
  tags?: string[];
  /**
   * The due date of the task. Optional.
   */
  dateDue?: number;
  /**
   * The last modified date of the task. Optional.
   */
  dateMod?: number;
  /**
   * The completion date of the task. Optional.
   */
  dateCompleted?: number;
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
