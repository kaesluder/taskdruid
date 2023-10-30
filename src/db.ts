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

  /**
   * Async: fetches list of all tags used in db.
   * @returns list of all tag values found in database
   */
  async getTags(): Promise<string[]> {
    const tagsResult = await this.tasks.orderBy('tags').uniqueKeys();
    const result: string[] = tagsResult.map((item) => item.toString());
    return result;
  }

  /**
   * Mark the status of a record as "DONE"
   * @param id record id
   * @returns number of records changed. Should be 1 if successful, 0 if
   * id not found.
   */
  async markDone(id: number): Promise<number> {
    const queryResult = await this.tasks.update(id, { status: 'DONE' });
    console.log(`Marked done: ${queryResult}, id: ${id}`);
    return queryResult;
  }

  /**
   * Mark the status of a record as "PENDING"
   * @param id record id
   * @returns number of records changed. Should be 1 if successful, 0 if
   * id not found.
   */
  async markPending(id: number): Promise<number> {
    const queryResult = await this.tasks.update(id, { status: 'PENDING' });
    console.log(`Marked pending: ${queryResult}, id: ${id}`);
    return queryResult;
  }

  /**
   * Async: Get all tasks from the database.
   * @returns Promise list of all tasks in database.
   */
  async getAll(): Promise<ITask[]> {
    return this.tasks.toArray();
  }

  /**
   * Async: Get tasks with active status from the database.
   * @returns Promise list of active tasks.
   */
  async getActive(): Promise<ITask[]> {
    const activeTags = ['PENDING', 'TODO', 'STARTED'];
    return this.tasks
      .filter((task) => {
        return activeTags.includes(task.status);
      })
      .toArray();
  }
}

export const db = new TasksDexie('TasksDexie');
